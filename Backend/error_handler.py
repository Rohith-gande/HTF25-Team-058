"""
Error handling and cleanup utilities.
"""
import os
import logging
from typing import List, Optional
from fastapi import HTTPException, status
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ErrorHandler:
    """Handles errors and cleanup operations."""
    
    def __init__(self):
        """Initialize error handler."""
        self.temp_files: List[str] = []
    
    def register_temp_file(self, file_path: str):
        """Register a temporary file for cleanup."""
        if file_path not in self.temp_files:
            self.temp_files.append(file_path)
    
    def cleanup_temp_files(self):
        """Clean up all registered temporary files."""
        for file_path in self.temp_files:
            try:
                if os.path.exists(file_path):
                    os.remove(file_path)
                    logger.info(f"Cleaned up temporary file: {file_path}")
            except OSError as e:
                logger.warning(f"Failed to clean up file {file_path}: {str(e)}")
        
        self.temp_files.clear()
    
    def cleanup_specific_files(self, file_paths: List[str]):
        """Clean up specific files."""
        for file_path in file_paths:
            try:
                if os.path.exists(file_path):
                    os.remove(file_path)
                    logger.info(f"Cleaned up file: {file_path}")
            except OSError as e:
                logger.warning(f"Failed to clean up file {file_path}: {str(e)}")
    
    def handle_file_processing_error(self, error: Exception, file_path: Optional[str] = None) -> HTTPException:
        """Handle file processing errors."""
        logger.error(f"File processing error: {str(error)}")
        
        if file_path:
            self.cleanup_specific_files([file_path])
        
        return HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File processing failed: {str(error)}"
        )
    
    def handle_ai_processing_error(self, error: Exception) -> HTTPException:
        """Handle AI processing errors."""
        logger.error(f"AI processing error: {str(error)}")
        
        return HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI processing failed: {str(error)}"
        )
    
    def handle_tts_error(self, error: Exception, temp_files: List[str]) -> HTTPException:
        """Handle TTS processing errors."""
        logger.error(f"TTS processing error: {str(error)}")
        
        self.cleanup_specific_files(temp_files)
        
        return HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Text-to-speech conversion failed: {str(error)}"
        )
    
    def handle_storage_error(self, error: Exception, temp_files: List[str]) -> HTTPException:
        """Handle storage errors."""
        logger.error(f"Storage error: {str(error)}")
        
        self.cleanup_specific_files(temp_files)
        
        return HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Storage operation failed: {str(error)}"
        )
    
    def handle_database_error(self, error: Exception) -> HTTPException:
        """Handle database errors."""
        logger.error(f"Database error: {str(error)}")
        
        return HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database operation failed: {str(error)}"
        )
    
    def handle_authentication_error(self, error: Exception) -> HTTPException:
        """Handle authentication errors."""
        logger.error(f"Authentication error: {str(error)}")
        
        return HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Authentication failed: {str(error)}"
        )
    
    def create_error_response(self, status_code: int, detail: str) -> JSONResponse:
        """Create standardized error response."""
        return JSONResponse(
            status_code=status_code,
            content={
                "error": True,
                "message": detail,
                "status_code": status_code
            }
        )

# Global error handler instance
error_handler = ErrorHandler()

# Context manager for cleanup
@asynccontextmanager
async def cleanup_context():
    """Context manager for automatic cleanup."""
    try:
        yield error_handler
    finally:
        error_handler.cleanup_temp_files()

# Custom exception classes
class FileProcessingError(Exception):
    """Raised when file processing fails."""
    pass

class AIProcessingError(Exception):
    """Raised when AI processing fails."""
    pass

class TTSProcessingError(Exception):
    """Raised when TTS processing fails."""
    pass

class StorageError(Exception):
    """Raised when storage operations fail."""
    pass

class DatabaseError(Exception):
    """Raised when database operations fail."""
    pass

class AuthenticationError(Exception):
    """Raised when authentication fails."""
    pass
