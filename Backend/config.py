"""
Configuration settings for the podcast generator application.
"""
import os
from typing import Optional
from dotenv import load_dotenv
load_dotenv()
class Settings:
    """Application settings and configuration."""
    
    # Gemini API Configuration
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY")
    
    # File Upload Settings
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB
    ALLOWED_EXTENSIONS: set = {".pdf", ".txt"}
    CHUNK_SIZE: int = 2000  # words per chunk
    
    # Audio Settings
    TTS_LANGUAGE: str = "en"
    TTS_SLOW: bool = False
    AUDIO_FORMAT: str = "mp3"
    
    # Temporary file settings
    TEMP_DIR: str = "temp_audio"
    
    def __init__(self):
        """Initialize settings and create temp directory if needed."""
        os.makedirs(self.TEMP_DIR, exist_ok=True)

# Global settings instance
settings = Settings()
