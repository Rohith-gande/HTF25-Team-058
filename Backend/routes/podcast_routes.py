# from fastapi import APIRouter, Form
# from models.podcast import save_podcast, get_user_podcasts, get_podcast, delete_podcast

# router = APIRouter(prefix="/api/v1/user/podcasts", tags=["Podcasts"])

# @router.post("/")
# async def create_podcast(user_id: str = Form(...), title: str = Form(...), summary: str = Form(...), audio_url: str = Form(...)):
#     podcast_id = await save_podcast(user_id, title, summary, audio_url)
#     return {"message": "Podcast created", "podcast_id": podcast_id}

# @router.get("/")
# async def list_podcasts(user_id: str):
#     podcasts = await get_user_podcasts(user_id)
#     return {"podcasts": podcasts}

# @router.get("/{podcast_id}")
# async def get_single_podcast(user_id: str, podcast_id: str):
#     podcast = await get_podcast(user_id, podcast_id)
#     if not podcast:
#         return {"detail": "Podcast not found"}
#     return podcast

# @router.delete("/{podcast_id}")
# async def delete_single_podcast(user_id: str, podcast_id: str):
#     await delete_podcast(user_id, podcast_id)
#     return {"message": "Podcast deleted"}
