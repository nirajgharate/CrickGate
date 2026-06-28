import re
from langchain_core.tools import tool
from database import (
    check_slot_available, 
    create_booking, 
    get_turf_by_id, 
    get_booked_slots, 
    get_user_points, 
    deduct_user_points
)
from rag_storage import search_turfs_rag

# Standard operational hours for slot suggestions
STANDARD_SLOTS = [
    "6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM",
    "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM",
    "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM", "11:00 PM"
]

def extract_numeric_price(price_str):
    """Extract digits from price string e.g. '₹900 per hr' -> 900"""
    if not price_str:
        return 1000.0
    digits = re.findall(r'\d+', str(price_str))
    if digits:
        return float("".join(digits))
    return 1000.0

@tool
def search_turf_database(query: str) -> str:
    """
    Search TurfGate's database of cricket and football turfs by semantic meaning.
    Use this whenever the user wants to find, suggest, discover or list turfs.
    
    Args:
        query: Description of what the user is looking for (e.g. 'cheap turf near Nashik with parking')
        
    Returns:
        A list of matching turfs with names, IDs, locations, prices, facilities, and ratings.
    """
    results = search_turfs_rag(query, k=3)
    if not results:
        return "No sports turfs matching your criteria were found in our database."
        
    response = "Here are the best matching turfs I found:\n\n"
    for i, doc in enumerate(results, 1):
        content = doc.page_content.strip()
        response += f"--- MATCH {i} ---\n{content}\n"
    return response

@tool
def check_turf_availability(turf_id: str, date: str, time_slot: str) -> str:
    """
    Check if a specific slot is available for booking at a turf.
    If unavailable, it will automatically find and return alternate free slots for that date.
    Use this when the user wants to know if a turf is free on a given date and time.
    
    Args:
        turf_id: The unique ID string of the turf (e.g. '65b4c1...')
        date: Date in format YYYY-MM-DD or readable (e.g. '2026-09-20' or '20 Sep')
        time_slot: Time slot string (e.g. '6:00 PM', '18:00', '6:00 PM - 8:00 PM')
        
    Returns:
        A string message stating whether the turf slot is available or lists alternative available slots.
    """
    # 1. Fetch turf details to confirm it exists
    turf = get_turf_by_id(turf_id)
    if not turf:
        return f"Turf with ID '{turf_id}' could not be found."
        
    # 2. Check if slot is available
    is_available = check_slot_available(turf_id, date, time_slot)
    
    if is_available:
        return f"Good news! The turf '{turf['name']}' is AVAILABLE on {date} at {time_slot}."
    else:
        # Calculate alternate free slots on this day
        booked = get_booked_slots(turf_id, date)
        free_slots = [slot for slot in STANDARD_SLOTS if slot not in booked]
        # Suggest top 4 free slots
        alt_str = ", ".join(free_slots[:4]) if free_slots else "No other slots are free today."
        return (
            f"Sorry, '{turf['name']}' is already BOOKED on {date} at {time_slot}.\n"
            f"💡 Alternative slots AVAILABLE on {date} are: {alt_str}"
        )

@tool
def book_turf_slot(turf_id: str, date: str, time_slot: str, user_id: str, redeem_points: bool = False) -> str:
    """
    Book a slot for a turf.
    ALWAYS double check slot availability first. Call this tool only after the user
    has explicitly confirmed they want to book this turf, date, and slot.
    
    Args:
        turf_id: The unique ID string of the turf to book
        date: Date of booking (e.g. '2026-09-20')
        time_slot: Time slot (e.g. '6:00 PM')
        user_id: The unique ID string of the player booking the turf
        redeem_points: Set to True if the user requested to redeem their loyalty points for a discount
        
    Returns:
        Confirmation details with booking ID, turf name, date, time, price, and loyalty points summary.
    """
    # 1. Verify user ID is passed
    if not user_id or user_id == "null" or user_id == "undefined":
        return "Error: You must be logged in to book a turf. Please sign in to TurfGate."
        
    # 2. Verify turf exists
    turf = get_turf_by_id(turf_id)
    if not turf:
        return f"Error: Turf with ID '{turf_id}' does not exist."
        
    # 3. Double-check availability
    is_available = check_slot_available(turf_id, date, time_slot)
    if not is_available:
        return f"Error: Slot {time_slot} on {date} is already booked. Please choose another time."
        
    # 4. Extract price
    original_price = extract_numeric_price(turf.get("price"))
    final_price = original_price
    
    # 5. Handle points deduction if requested
    points_used = 0
    discount = 0.0
    if redeem_points:
        user_points = get_user_points(user_id)
        if user_points > 0:
            # 10 points = 1 rupee discount. Max discount is original price.
            points_needed = int(original_price * 10)
            points_used = min(user_points, points_needed)
            discount = points_used / 10.0
            final_price = max(0.0, original_price - discount)
            # Deduct points from database
            deduct_user_points(user_id, points_used)
    
    # 6. Insert booking
    booking = create_booking(turf_id, user_id, date, time_slot, final_price)
    if booking:
        points_str = f"Points Redeemed: {points_used} (Discount applied: ₹{discount:.0f})\n" if points_used > 0 else ""
        return (
            f"🎉 Booking Confirmed Successfully!\n"
            f"Booking ID: {booking['_id']}\n"
            f"Turf: {turf['name']}\n"
            f"Location: {turf['location']}\n"
            f"Date: {date}\n"
            f"Time Slot: {time_slot}\n"
            f"{points_str}"
            f"Amount Paid: ₹{final_price:.0f} (Payment method: Card)\n"
            f"Status: Completed"
        )
    return "Error: Something went wrong while inserting the booking into database."

@tool
def trigger_screen_action(action_type: str, target_name: str) -> str:
    """
    Trigger a user interface animation on the website (like highlighting or scrolling to a turf).
    Call this whenever the user asks to see, show, find on screen, focus, scroll to, or highlight a turf.
    
    Args:
        action_type: The type of action to perform, e.g. 'highlight-turf'
        target_name: The name of the turf to highlight (e.g. 'Green Arena')
        
    Returns:
        Confirmation that the UI trigger event has been scheduled.
    """
    return f"[ACTION: {action_type} | TARGET: {target_name}] Screen action triggered successfully."
