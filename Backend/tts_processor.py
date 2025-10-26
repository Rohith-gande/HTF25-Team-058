"""
Text-to-Speech processing module using gTTS and pydub.
"""
import os
import uuid
import tempfile
from typing import List
from gtts import gTTS
from pydub import AudioSegment
from pydub.utils import which
from fastapi import HTTPException, status
from config import settings

class TTSProcessor:
    """Handles text-to-speech conversion and audio processing."""
    
    def __init__(self):
        """Initialize TTS processor."""
        self.language = settings.TTS_LANGUAGE
        self.slow = settings.TTS_SLOW
        self.audio_format = settings.AUDIO_FORMAT
        self.temp_dir = settings.TEMP_DIR
        
        # Ensure temp directory exists
        os.makedirs(self.temp_dir, exist_ok=True)
    
    def split_text_for_tts(self, text: str, max_length: int = 5000) -> List[str]:
        """
        Split long text into smaller segments for TTS processing.
        
        Args:
            text: Input text to split
            max_length: Maximum characters per segment
            
        Returns:
            List[str]: List of text segments
        """
        if len(text) <= max_length:
            return [text]
        
        segments = []
        sentences = text.split('. ')
        current_segment = ""
        
        for sentence in sentences:
            # If adding this sentence would exceed max_length, start new segment
            if len(current_segment) + len(sentence) + 2 > max_length and current_segment:
                segments.append(current_segment.strip())
                current_segment = sentence
            else:
                if current_segment:
                    current_segment += ". " + sentence
                else:
                    current_segment = sentence
        
        # Add the last segment
        if current_segment.strip():
            segments.append(current_segment.strip())
        
        return segments
    
    async def text_to_speech_segment(self, text: str, output_path: str) -> str:
        """
        Convert text segment to speech using gTTS.
        
        Args:
            text: Text to convert to speech
            output_path: Path to save audio file
            
        Returns:
            str: Path to generated audio file
            
        Raises:
            HTTPException: If TTS conversion fails
        """
        try:
            # Create gTTS object
            tts = gTTS(text=text, lang=self.language, slow=self.slow)
            
            # Save to file
            tts.save(output_path)
            
            return output_path
            
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to convert text to speech: {str(e)}"
            )
    
    async def merge_audio_files(self, audio_files: List[str], output_path: str) -> str:
        """
        Merge multiple audio files into a single file.
        
        Args:
            audio_files: List of paths to audio files to merge
            output_path: Path to save merged audio file
            
        Returns:
            str: Path to merged audio file
            
        Raises:
            HTTPException: If audio merging fails
        """
        try:
            if not audio_files:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="No audio files to merge"
                )
            
            # Load first audio file
            merged_audio = AudioSegment.from_mp3(audio_files[0])
            
            # Add remaining audio files
            for audio_file in audio_files[1:]:
                audio_segment = AudioSegment.from_mp3(audio_file)
                merged_audio += audio_segment
            
            # Export merged audio
            merged_audio.export(output_path, format=self.audio_format)
            
            return output_path
            
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to merge audio files: {str(e)}"
            )
    
    async def convert_text_to_speech(self, text: str) -> str:
        """
        Convert text to speech and return path to audio file.
        
        Args:
            text: Text to convert to speech
            
        Returns:
            str: Path to generated audio file
            
        Raises:
            HTTPException: If TTS conversion fails
        """
        try:
            # Generate unique filename
            podcast_id = str(uuid.uuid4())
            final_audio_path = os.path.join(self.temp_dir, f"podcast_{podcast_id}.{self.audio_format}")
            
            # Split text into segments
            text_segments = self.split_text_for_tts(text)
            
            if len(text_segments) == 1:
                # Single segment - direct conversion
                await self.text_to_speech_segment(text_segments[0], final_audio_path)
            else:
                # Multiple segments - convert each and merge
                segment_files = []
                
                for i, segment in enumerate(text_segments):
                    segment_path = os.path.join(self.temp_dir, f"segment_{i}_{podcast_id}.{self.audio_format}")
                    await self.text_to_speech_segment(segment, segment_path)
                    segment_files.append(segment_path)
                
                # Merge all segments
                await self.merge_audio_files(segment_files, final_audio_path)
                
                # Clean up segment files
                for segment_file in segment_files:
                    try:
                        os.remove(segment_file)
                    except OSError:
                        pass  # File might already be deleted
            
            return final_audio_path
            
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to convert text to speech: {str(e)}"
            )
    
    def cleanup_temp_files(self, file_paths: List[str]):
        """
        Clean up temporary files.
        
        Args:
            file_paths: List of file paths to delete
        """
        for file_path in file_paths:
            try:
                if os.path.exists(file_path):
                    os.remove(file_path)
            except OSError:
                pass  # File might already be deleted

# Global TTS processor instance
tts_processor = TTSProcessor()
