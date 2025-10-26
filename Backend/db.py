from pymongo import MongoClient
import os

MONGO_URI = os.environ.get("MONGO_URI")

client = MongoClient(MONGO_URI)
db = client["ai_podcast_db"]

users_collection = db["users"]
podcasts_collection = db["podcasts"]
