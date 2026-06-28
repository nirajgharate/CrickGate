import os
import time
from typing import TypedDict, Annotated, Sequence
import operator
from dotenv import load_dotenv

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import BaseMessage, SystemMessage, ToolMessage
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver

from tools import search_turf_database, check_turf_availability, book_turf_slot, trigger_screen_action

load_dotenv()

# Define tools list
tools = [search_turf_database, check_turf_availability, book_turf_slot, trigger_screen_action]
tools_dict = {t.name: t for t in tools}

# Load model
api_key = os.getenv("GEMINI_API_KEY")
llm = ChatGoogleGenerativeAI(
    model="models/gemini-flash-latest",
    google_api_key=api_key,
    temperature=0.4
)
model = llm.bind_tools(tools)

# Define State
class AgentState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], operator.add]
    user_id: str

SYSTEM_INSTRUCTION = """You are TurfBot, the premium voice-enabled AI assistant for TurfGate — a sports turf booking application.
Your job is to help players find cricket or football turfs, check slot availability, and book slots directly in chat.

Your active user ID is: '{user_id}'.

CRITICAL INSTRUCTIONS:
1. FINDING TURFS: Use the `search_turf_database` tool. Recommending turfs should be natural.
2. CHECKING AVAILABILITY: Always use `check_turf_availability` before recommending a booking.
3. BOOKING SLOTS: You must explicitly confirm with the user before booking (e.g. "Would you like me to book Green Arena on 20 Sep at 6:00 PM?"). Only call `book_turf_slot` after they say yes.
4. LOYALTY POINTS: Tell users they can redeem loyalty points to save money on booking (10 points = ₹1). If they agree to redeem points, set the `redeem_points` parameter to True when calling `book_turf_slot`.
5. RECEIPT SCANNING: If they upload an image of a payment receipt, verify the payment amount, date, and status. Confirmatory response should mention the details.
6. SCREEN ACTIONS: If they ask to show, see, find, focus, or highlight a turf on their screen, call `trigger_screen_action(action_type='highlight-turf', target_name='Turf Name')`.
7. If active user ID is missing, tell them they must be logged in to book slots.
8. Keep your answers brief (2-3 sentences max) for voice outputs, unless listing matches.
"""

def call_model(state: AgentState):
    """LLM Node: Evaluates input and selects tools or replies (with auto-retry for 429 rate limits)"""
    user_id = state.get("user_id", "Not Logged In")
    sys_content = SYSTEM_INSTRUCTION.format(user_id=user_id)
    
    # Inject system instruction at the beginning
    messages = [SystemMessage(content=sys_content)] + list(state["messages"])
    
    max_retries = 3
    for attempt in range(max_retries):
        try:
            response = model.invoke(messages)
            return {"messages": [response]}
        except Exception as e:
            err_msg = str(e)
            if "429" in err_msg or "RESOURCE_EXHAUSTED" in err_msg:
                if attempt < max_retries - 1:
                    print(f"⚠️ Rate limit hit. Retrying in 6 seconds (attempt {attempt + 1}/{max_retries})...")
                    time.sleep(6)
                    continue
            raise e

def execute_tools(state: AgentState):
    """Tool Executor Node: Runs tool calls requested by LLM"""
    messages = state["messages"]
    last_message = messages[-1]
    
    tool_outputs = []
    for tool_call in last_message.tool_calls:
        tool_name = tool_call["name"]
        tool_args = tool_call["args"]
        
        # Inject user_id if calling book_turf_slot
        if tool_name == "book_turf_slot" and "user_id" not in tool_args:
            tool_args["user_id"] = state.get("user_id", "")
            
        tool = tools_dict[tool_name]
        print(f"Executing tool {tool_name} with args: {tool_args}")
        
        try:
            result = tool.invoke(tool_args)
        except Exception as e:
            result = f"Error executing tool {tool_name}: {str(e)}"
            
        # Formulate tool output message
        tool_message = ToolMessage(
            content=str(result),
            tool_call_id=tool_call["id"],
            name=tool_name
        )
        tool_outputs.append(tool_message)
        
    return {"messages": tool_outputs}

def should_continue(state: AgentState):
    """Conditional Edge: Decides if we execute tools or finish"""
    messages = state["messages"]
    last_message = messages[-1]
    
    if hasattr(last_message, "tool_calls") and last_message.tool_calls:
        return "tools"
    return END

# Build Graph
workflow = StateGraph(AgentState)

# Add Nodes
workflow.add_node("agent", call_model)
workflow.add_node("tools", execute_tools)

# Define flow
workflow.set_entry_point("agent")

# Add Routing Edge
workflow.add_conditional_edges(
    "agent",
    should_continue,
    {
        "tools": "tools",
        END: END
    }
)

# Link tools back to agent
workflow.add_edge("tools", "agent")

# Compile with Redis persistent checkpointer (fallback to MemorySaver if Redis is offline)
try:
    from langgraph.checkpoint.redis import RedisSaver
    import redis
    
    redis_client = redis.Redis(host="localhost", port=6379, socket_connect_timeout=2)
    redis_client.ping()
    memory = RedisSaver(redis_client)
    print("✅ Connected to Redis! Persistent memory enabled.")
except Exception as e:
    print(f"⚠️ Redis connection failed or package missing: {e}. Falling back to in-memory checkpointer.")
    memory = MemorySaver()
    
app = workflow.compile(checkpointer=memory)
