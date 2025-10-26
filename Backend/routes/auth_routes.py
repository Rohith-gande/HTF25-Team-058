from fastapi import APIRouter, Form
from models.user import create_user, authenticate_user

router = APIRouter()

@router.post("/signup")
async def signup(name: str = Form(...), email: str = Form(...), password: str = Form(...)):
    user = await create_user(name, email, password)
    id_token = f"token-{user['id']}"
    return {"idToken": id_token, "user": user}

@router.post("/signin")
async def signin(email: str = Form(...), password: str = Form(...)):
    user = await authenticate_user(email, password)
    id_token = f"token-{user['id']}"
    return {"idToken": id_token, "user": user}
