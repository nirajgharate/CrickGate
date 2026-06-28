import os
from typing import Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_core.messages import HumanMessage
from agent import app as agent_app
from rag_storage import sync_vector_store
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="TurfGate AI Agent Service")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all for local dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    session_id: str
    user_id: Optional[str] = None
    image_data: Optional[str] = None
    image_mime_type: Optional[str] = None

class ChatResponse(BaseModel):
    reply: str

@app.get("/health")
def health():
    return {"status": "healthy", "service": "TurfGate AI Agent"}

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")
        
    try:
        # Config for LangGraph thread session memory
        config = {"configurable": {"thread_id": request.session_id}}
        
        # Assemble message (check for image upload)
        if request.image_data and request.image_mime_type:
            content = [
                {"type": "text", "text": request.message},
                {
                    "type": "image_url",
                    "image_url": f"data:{request.image_mime_type};base64,{request.image_data}"
                }
            ]
            message = HumanMessage(content=content)
        else:
            message = HumanMessage(content=request.message)
            
        # Invoke agent
        result = agent_app.invoke(
            {
                "messages": [message],
                "user_id": request.user_id or ""
            },
            config=config
        )
        
        # Find the last assistant message
        reply = ""
        for msg in reversed(result.get("messages", [])):
            if msg.type == "ai" and msg.content:
                content = msg.content
                if isinstance(content, list):
                    text_parts = []
                    for part in content:
                        if isinstance(part, dict) and "text" in part:
                            text_parts.append(part["text"])
                        elif isinstance(part, str):
                            text_parts.append(part)
                    reply = "".join(text_parts)
                else:
                    reply = str(content)
                break
                
        if not reply:
            reply = "I processed your request but didn't generate a reply text. How can I help you?"
            
        return ChatResponse(reply=reply)
    except Exception as e:
        print(f"Error in chat endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/sync-rag")
async def sync_rag():
    try:
        success = sync_vector_store()
        if success:
            return {"status": "success", "message": "ChromaDB vector store synchronized with MongoDB."}
        else:
            raise HTTPException(status_code=500, detail="Sync failed. Check database records.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
