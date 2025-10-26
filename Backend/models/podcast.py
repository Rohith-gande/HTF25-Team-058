from db import podcasts_collection
from datetime import datetime
import uuid
from fastapi import HTTPException

async def save_podcast(user_id: str, title: str, summary: str, audio_url: str):
    podcast_id = str(uuid.uuid4())
    podcast_doc = {
        "_id": podcast_id,
        "user_id": user_id,
        "title": title,
        "summary": summary,
        "audio_url": audio_url,
        "createdAt": datetime.utcnow()
    }
    podcasts_collection.insert_one(podcast_doc)
    return podcast_id

async def get_user_podcasts(user_id: str):
    podcasts = list(podcasts_collection.find({"user_id": user_id}).sort("createdAt", -1))
    for p in podcasts:
        p["id"] = p["_id"]
        del p["_id"]
    return podcasts

async def get_podcast(user_id: str, podcast_id: str):
    podcast = podcasts_collection.find_one({"_id": podcast_id, "user_id": user_id})
    if podcast:
        podcast["id"] = podcast["_id"]
        del podcast["_id"]
    return podcast

async def delete_podcast(user_id: str, podcast_id: str):
    result = podcasts_collection.delete_one({"_id": podcast_id, "user_id": user_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Podcast not found")
    return True
