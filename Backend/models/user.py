from db import users_collection
from datetime import datetime
from fastapi import HTTPException
import hashlib
import uuid

async def create_user(name: str, email: str, password: str):
    """Register a new user in MongoDB."""
    if users_collection.find_one({"email": email.lower()}):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_id = str(uuid.uuid4())
    hashed_pw = hashlib.sha256(password.encode()).hexdigest()
    
    user_doc = {
        "_id": user_id,
        "name": name,
        "email": email.lower(),
        "password": hashed_pw,
        "createdAt": datetime.utcnow()
    }
    
    users_collection.insert_one(user_doc)
    return {"id": user_id, "name": name, "email": email.lower()}


async def authenticate_user(email: str, password: str):
    """Authenticate user by email & password."""
    hashed_pw = hashlib.sha256(password.encode()).hexdigest()
    user = users_collection.find_one({"email": email.lower(), "password": hashed_pw})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"id": user["_id"], "name": user["name"], "email": user["email"]}
