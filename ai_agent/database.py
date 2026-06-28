import os
from pymongo import MongoClient
from bson import ObjectId
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
DATABASE_NAME = os.getenv("DATABASE_NAME", "test")

# Initialize client
client = MongoClient(MONGODB_URI)
db = client[DATABASE_NAME]

def get_db():
    return db

def get_all_turfs():
    """Fetch all turf records from database"""
    return list(db.turves.find({}))

def get_turf_by_id(turf_id):
    """Fetch a single turf by its ID"""
    try:
        return db.turves.find_one({"_id": ObjectId(turf_id)})
    except Exception:
        return None

def check_slot_available(turf_id, date, time_slot):
    """
    Check if a booking already exists for the given turf, date, and slot
    and is not cancelled.
    """
    try:
        query = {
            "turfId": ObjectId(turf_id),
            "date": date,
            "timeSlot": time_slot,
            "status": {"$ne": "cancelled"}
        }
        booking = db.bookings.find_one(query)
        return booking is None
    except Exception as e:
        print(f"Error checking slot availability: {e}")
        return False

def create_booking(turf_id, user_id, date, time_slot, price):
    """
    Create a new booking in the bookings collection.
    """
    try:
        booking_data = {
            "turfId": ObjectId(turf_id),
            "userId": ObjectId(user_id),
            "date": date,
            "timeSlot": time_slot,
            "price": float(price),
            "status": "completed",
            "paymentMethod": "card"
        }
        result = db.bookings.insert_one(booking_data)
        if result.inserted_id:
            booking_data["_id"] = str(result.inserted_id)
            booking_data["turfId"] = str(booking_data["turfId"])
            booking_data["userId"] = str(booking_data["userId"])
            return booking_data
        return None
    except Exception as e:
        print(f"Error creating booking: {e}")
        return None

def get_user_points(user_id):
    """Retrieve user's loyalty points from MongoDB"""
    try:
        user = db.users.find_one({"_id": ObjectId(user_id)})
        return int(user.get("loyaltyPoints", 0)) if user else 0
    except Exception as e:
        print(f"Error fetching user points: {e}")
        return 0

def deduct_user_points(user_id, points):
    """Deduct loyalty points from user's account in MongoDB"""
    try:
        result = db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$inc": {"loyaltyPoints": -int(points)}}
        )
        return result.modified_count > 0
    except Exception as e:
        print(f"Error deducting user points: {e}")
        return False

def get_booked_slots(turf_id, date):
    """Fetch active booking slots for a turf on a given day"""
    try:
        query = {
            "turfId": ObjectId(turf_id),
            "date": date,
            "status": {"$ne": "cancelled"}
        }
        bookings = list(db.bookings.find(query))
        return [b["timeSlot"] for b in bookings]
    except Exception as e:
        print(f"Error fetching booked slots: {e}")
        return []
