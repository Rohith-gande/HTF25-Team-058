"""
Simple local file storage for audio files.
"""
import os
import shutil
from fastapi import HTTPException, status
from typing import Optional
from config import settings

class SimpleStorage:
    """Handles simple local file storage operations."""
    
    def __init__(self):
        """Initialize simple storage."""
        self.storage_dir = "storage"
        self.audio_dir = os.path.join(self.storage_dir, "audio")
        os.makedirs(self.audio_dir, exist_ok=True)
    
    async def upload_file(self, local_file_path: str, remote_path: str) -> str:
        """
        Copy file to local storage.
        
        Args:
            local_file_path: Path to local file to upload
            remote_path: Path in local storage
            
        Returns:
            str: Local file URL
            
        Raises:
            HTTPException: If upload fails
        """
        try:
            # Check if local file exists
            if not os.path.exists(local_file_path):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Local file not found"
                )
            
            # Create destination directory
            dest_path = os.path.join(self.storage_dir, remote_path)
            dest_dir = os.path.dirname(dest_path)
            os.makedirs(dest_dir, exist_ok=True)
            
            # Copy file
            shutil.copy2(local_file_path, dest_path)
            
            # Return local file URL
            return f"/storage/{remote_path}"
            
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to upload file to local storage: {str(e)}"
            )
    
    async def delete_file(self, remote_path: str) -> bool:
        """
        Delete file from local storage.
        
        Args:
            remote_path: Path in local storage
            
        Returns:
            bool: True if deletion successful
            
        Raises:
            HTTPException: If deletion fails
        """
        try:
            file_path = os.path.join(self.storage_dir, remote_path)
            if os.path.exists(file_path):
                os.remove(file_path)
            return True
            
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to delete file from local storage: {str(e)}"
            )
    
    async def upload_podcast_audio(self, audio_file_path: str, user_id: str, podcast_id: str) -> str:
        """
        Copy podcast audio file to local storage.
        
        Args:
            audio_file_path: Path to local audio file
            user_id: User ID
            podcast_id: Podcast ID
            
        Returns:
            str: Local URL of uploaded audio file
            
        Raises:
            HTTPException: If upload fails
        """
        try:
            # Create remote path for the audio file
            remote_path = f"podcasts/{user_id}/{podcast_id}/audio.mp3"
            
            # Upload file
            local_url = await self.upload_file(audio_file_path, remote_path)
            
            return local_url
            
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to upload podcast audio: {str(e)}"
            )
    
    async def delete_podcast_audio(self, user_id: str, podcast_id: str) -> bool:
        """
        Delete podcast audio file from local storage.
        
        Args:
            user_id: User ID
            podcast_id: Podcast ID
            
        Returns:
            bool: True if deletion successful
            
        Raises:
            HTTPException: If deletion fails
        """
        try:
            remote_path = f"podcasts/{user_id}/{podcast_id}/audio.mp3"
            return await self.delete_file(remote_path)
            
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to delete podcast audio: {str(e)}"
            )

# Global simple storage instance
simple_storage = SimpleStorage()
