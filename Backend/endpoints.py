"""
FastAPI endpoints for the podcast generator application.
"""
import os
import uuid
from fastapi import APIRouter, HTTPException, status, UploadFile, File
from fastapi.responses import JSONResponse
from typing import Optional, List, Dict
from file_processor import file_processor
from summarizer import summarizer
from tts_processor import tts_processor
from storage import simple_storage
from database import simple_db

# Create router for endpoints
router = APIRouter()

# Default user ID for all operations (no authentication required)
DEFAULT_USER_ID = "default-user"

@router.post("/generate_podcast/")
async def generate_podcast(
    file: UploadFile = File(...)
):
    """
    Generate podcast from uploaded file.
    
    Args:
        file: Uploaded PDF or TXT file
        
    Returns:
        JSONResponse: Podcast data including summary and audio URL
    """
    try:
        # Step 1: Process uploaded file and extract text
        print(f"Processing file: {file.filename}")
        text_content, original_filename = await file_processor.process_uploaded_file(file)
        
        # Step 2: Create podcast script using AI summarization
        print("Creating podcast script...")
        podcast_script = await summarizer.create_podcast_script(text_content)
        
        # Step 3: Convert script to speech
        print("Converting to speech...")
        audio_file_path = await tts_processor.convert_text_to_speech(podcast_script)
        
        # Step 4: Upload audio to local storage
        print("Uploading to local storage...")
        podcast_id = str(uuid.uuid4())
        audio_url = await simple_storage.upload_podcast_audio(
            audio_file_path, DEFAULT_USER_ID, podcast_id
        )
        
        # Step 5: Save podcast data to simple database
        print("Saving to database...")
        saved_podcast_id = await simple_db.save_podcast(
            DEFAULT_USER_ID, original_filename, podcast_script, audio_url
        )
        
        # Step 6: Clean up local temporary files
        try:
            os.remove(audio_file_path)
        except OSError:
            pass  # File might already be deleted
        
        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content={
                "message": "Podcast generated successfully",
                "podcast_id": saved_podcast_id,
                "title": original_filename,
                "summary": podcast_script,
                "audio_url": audio_url
            }
        )
        
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        # Clean up on error
        try:
            if 'audio_file_path' in locals() and os.path.exists(audio_file_path):
                os.remove(audio_file_path)
        except OSError:
            pass
        
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate podcast: {str(e)}"
        )

@router.get("/user/podcasts")
async def get_user_podcasts():
    """
    Get all podcasts for the default user.
    
    Returns:
        JSONResponse: List of user's podcasts
    """
    try:
        podcasts = await simple_db.get_user_podcasts(DEFAULT_USER_ID)
        
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "message": "Podcasts retrieved successfully",
                "podcasts": podcasts,
                "count": len(podcasts)
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve podcasts: {str(e)}"
        )

@router.get("/user/podcasts/{podcast_id}")
async def get_podcast(podcast_id: str):
    """
    Get a specific podcast by ID.
    
    Args:
        podcast_id: Podcast ID
        
    Returns:
        JSONResponse: Podcast data
    """
    try:
        podcast = await simple_db.get_podcast(DEFAULT_USER_ID, podcast_id)
        
        if not podcast:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Podcast not found"
            )
        
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "message": "Podcast retrieved successfully",
                "podcast": podcast
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve podcast: {str(e)}"
        )

@router.delete("/user/podcasts/{podcast_id}")
async def delete_podcast(podcast_id: str):
    """
    Delete a podcast and its associated audio file.
    
    Args:
        podcast_id: Podcast ID
        
    Returns:
        JSONResponse: Deletion confirmation
    """
    try:
        # Get podcast data first to get audio URL
        podcast = await simple_db.get_podcast(DEFAULT_USER_ID, podcast_id)
        
        if not podcast:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Podcast not found"
            )
        
        # Delete from database
        await simple_db.delete_podcast(DEFAULT_USER_ID, podcast_id)
        
        # Delete audio file from local storage
        try:
            await simple_storage.delete_podcast_audio(DEFAULT_USER_ID, podcast_id)
        except Exception as e:
            print(f"Warning: Failed to delete audio file: {str(e)}")
            # Don't fail the entire operation if audio deletion fails
        
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "message": "Podcast deleted successfully",
                "podcast_id": podcast_id
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete podcast: {str(e)}"
        )

@router.get("/health")
async def health_check():
    """
    Health check endpoint.
    
    Returns:
        JSONResponse: Service status
    """
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            "message": "Podcast Generator API is running",
            "status": "healthy"
        }
    )
