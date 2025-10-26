"""
Simple file-based database for user podcast management.
"""
import uuid
import json
import os
from datetime import datetime, timezone
from typing import List, Dict, Optional
from fastapi import HTTPException, status

class SimpleDB:
    """Handles simple file-based database operations."""
    
    def __init__(self):
        """Initialize simple database."""
        self.data_dir = "data"
        self.podcasts_file = os.path.join(self.data_dir, "podcasts.json")
        os.makedirs(self.data_dir, exist_ok=True)
        
        # Initialize empty database if it doesn't exist
        if not os.path.exists(self.podcasts_file):
            with open(self.podcasts_file, 'w') as f:
                json.dump({}, f)
    
    def _load_data(self) -> dict:
        """Load data from JSON file."""
        try:
            with open(self.podcasts_file, 'r') as f:
                return json.load(f)
        except (json.JSONDecodeError, FileNotFoundError):
            return {}
    
    def _save_data(self, data: dict):
        """Save data to JSON file."""
        with open(self.podcasts_file, 'w') as f:
            json.dump(data, f, indent=2, default=str)
    
    async def save_podcast(self, user_id: str, title: str, summary: str, audio_url: str) -> str:
        """
        Save podcast data to simple database.
        
        Args:
            user_id: User ID
            title: Podcast title (original filename)
            summary: Podcast summary text
            audio_url: URL of audio file
            
        Returns:
            str: Podcast ID
            
        Raises:
            HTTPException: If save operation fails
        """
        try:
            # Generate unique podcast ID
            podcast_id = str(uuid.uuid4())
            
            # Create podcast document
            podcast_data = {
                'title': title,
                'summary': summary,
                'audio_url': audio_url,
                'createdAt': datetime.now(timezone.utc).isoformat(),
                'podcast_id': podcast_id,
                'user_id': user_id
            }
            
            # Load existing data
            data = self._load_data()
            
            # Add podcast
            if user_id not in data:
                data[user_id] = {}
            data[user_id][podcast_id] = podcast_data
            
            # Save data
            self._save_data(data)
            
            return podcast_id
            
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to save podcast: {str(e)}"
            )
    
    async def get_user_podcasts(self, user_id: str) -> List[Dict]:
        """
        Get all podcasts for a user.
        
        Args:
            user_id: User ID
            
        Returns:
            List[Dict]: List of podcast documents
            
        Raises:
            HTTPException: If retrieval fails
        """
        try:
            # Load data
            data = self._load_data()
            
            # Get podcasts for user
            if user_id not in data:
                return []
            
            podcasts = []
            for podcast_id, podcast_data in data[user_id].items():
                podcast_data['id'] = podcast_id
                podcasts.append(podcast_data)
            
            # Sort by creation date (newest first)
            podcasts.sort(key=lambda x: x.get('createdAt', ''), reverse=True)
            
            return podcasts
            
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to retrieve podcasts: {str(e)}"
            )
    
    async def get_podcast(self, user_id: str, podcast_id: str) -> Optional[Dict]:
        """
        Get a specific podcast by ID.
        
        Args:
            user_id: User ID
            podcast_id: Podcast ID
            
        Returns:
            Optional[Dict]: Podcast document or None if not found
            
        Raises:
            HTTPException: If retrieval fails
        """
        try:
            # Load data
            data = self._load_data()
            
            # Check if user and podcast exist
            if user_id not in data or podcast_id not in data[user_id]:
                return None
            
            podcast_data = data[user_id][podcast_id].copy()
            podcast_data['id'] = podcast_id
            
            return podcast_data
            
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to retrieve podcast: {str(e)}"
            )
    
    async def delete_podcast(self, user_id: str, podcast_id: str) -> bool:
        """
        Delete a podcast from simple database.
        
        Args:
            user_id: User ID
            podcast_id: Podcast ID
            
        Returns:
            bool: True if deletion successful
            
        Raises:
            HTTPException: If deletion fails
        """
        try:
            # Load data
            data = self._load_data()
            
            # Check if user and podcast exist
            if user_id not in data or podcast_id not in data[user_id]:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Podcast not found"
                )
            
            # Delete the podcast
            del data[user_id][podcast_id]
            
            # Save data
            self._save_data(data)
            
            return True
            
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to delete podcast: {str(e)}"
            )
    
    async def update_podcast(self, user_id: str, podcast_id: str, update_data: Dict) -> bool:
        """
        Update a podcast document.
        
        Args:
            user_id: User ID
            podcast_id: Podcast ID
            update_data: Dictionary of fields to update
            
        Returns:
            bool: True if update successful
            
        Raises:
            HTTPException: If update fails
        """
        try:
            # Load data
            data = self._load_data()
            
            # Check if user and podcast exist
            if user_id not in data or podcast_id not in data[user_id]:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Podcast not found"
                )
            
            # Update the podcast
            data[user_id][podcast_id].update(update_data)
            
            # Save data
            self._save_data(data)
            
            return True
            
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to update podcast: {str(e)}"
            )

# Global simple database instance
simple_db = SimpleDB()
