from fastapi import APIRouter, Form, UploadFile, File, HTTPException, status, Header
from fastapi.responses import JSONResponse
from models.podcast import save_podcast, get_user_podcasts, get_podcast, delete_podcast 
from file_processor import file_processor
from summarizer import summarizer
from tts_processor import tts_processor
from storage import simple_storage
import uuid, os
from db import users_collection
from db import podcasts_collection

router = APIRouter()
DEFAULT_USER_ID = "default-user"  # keep for testing without auth

def get_user_id_from_header(authorization: str):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid token")
    token = authorization.split(" ")[1]
    user_id = token.replace("token-", "")
    return user_id

@router.get("/profile")
async def get_profile(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer"):
        raise HTTPException(status_code=401, detail="Missing or invalid token")
    token = authorization.split(" ")[1]
    user_id = token.replace("token-", "")
    # Get user and podcasts
    user = users_collection.find_one({"_id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    podcasts = await get_user_podcasts(user_id)
    total_podcasts = len(podcasts)
    total_duration = sum(p.get("duration", 0) for p in podcasts)
    return {"user": {"id": user["_id"], "name": user["name"], "email": user["email"]}, "stats": {"total": total_podcasts, "duration": total_duration}}

@router.post("/generate_podcast/")
async def generate_podcast(file: UploadFile = File(...), authorization: str = Header(None)):
    user_id = get_user_id_from_header(authorization)
    print(f"Processing file: {file.filename}")
    text_content, original_filename = await file_processor.process_uploaded_file(file)
    print("Creating podcast script...")
    podcast_script = await summarizer.create_podcast_script(text_content)
    print("Converting to speech...")
    audio_file_path = await tts_processor.convert_text_to_speech(podcast_script)
    print("Audio file generated at:", audio_file_path)
    print("Uploading to cloud storage...")
    podcast_id = str(uuid.uuid4())
    print("Uploading to Cloudinary:", audio_file_path)
    try:
        audio_url = await simple_storage.upload_podcast_audio(audio_file_path, user_id, podcast_id)
        print(audio_url)
    except Exception as e:
        print("Cloudinary upload failed:", str(e))
        raise HTTPException(
            status_code=500,
            detail=f"Cloudinary upload failed: {str(e)}"
        )
    
    podcasts_collection.insert_one({
        "_id": podcast_id,
        "user_id": user_id,
        "title": original_filename,
        "summary": podcast_script,
        "audio_url": audio_url,
        "duration": len(podcast_script.split()) // 2
    })

    try: os.remove(audio_file_path)
    except OSError: pass

    return JSONResponse(status_code=status.HTTP_201_CREATED, content={
        "message": "Podcast generated successfully",
        "podcast_id": podcast_id,
        "title": original_filename,
        "summary": podcast_script,
        "audio_url": audio_url
    })

@router.get("/user/podcasts")
async def get_user_podcasts_endpoint(authorization: str = Header(None)):
    user_id = get_user_id_from_header(authorization)
    podcasts = list(podcasts_collection.find({"user_id": user_id}))
    for p in podcasts:
        p["id"] = p["_id"]
        del p["_id"]
    return JSONResponse(status_code=200, content={
        "message": "Podcasts retrieved successfully",
        "podcasts": podcasts,
        "count": len(podcasts)
    })

@router.get("/user/podcasts/{podcast_id}")
async def get_podcast_endpoint(podcast_id: str, authorization: str = Header(None)):
    user_id = get_user_id_from_header(authorization)
    podcast = podcasts_collection.find_one({"_id": podcast_id, "user_id": user_id})
    if not podcast:
        raise HTTPException(status_code=404, detail="Podcast not found")
    podcast["id"] = podcast["_id"]
    del podcast["_id"]
    return JSONResponse(status_code=200, content={
        "message": "Podcast retrieved successfully",
        "podcast": podcast
    })

@router.delete("/user/podcasts/{podcast_id}")
async def delete_podcast_endpoint(podcast_id: str, authorization: str = Header(None)):
    user_id = get_user_id_from_header(authorization)
    result = podcasts_collection.delete_one({"_id": podcast_id, "user_id": user_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Podcast not found")

    try:
        await simple_storage.delete_podcast_audio(user_id, podcast_id)
    except Exception:
        pass

    return JSONResponse(status_code=200, content={
        "message": "Podcast deleted successfully",
        "podcast_id": podcast_id
    })

@router.get("/health")
async def health_check():
    return JSONResponse(status_code=200, content={"message": "Podcast Generator API is running", "status": "healthy"})