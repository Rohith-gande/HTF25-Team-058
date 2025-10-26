"""
AI summarization module using Gemini 2.0 Flash.
"""
import google.generativeai as genai
from fastapi import HTTPException, status
from typing import List
from config import settings

class Summarizer:
    """Handles text summarization using Gemini 2.0 Flash."""
    
    def __init__(self):
        """Initialize Gemini API."""
        self.api_key = settings.GEMINI_API_KEY
        self._configure_gemini()
    
    def _configure_gemini(self):
        """Configure Gemini API with API key."""
        if not self.api_key:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Gemini API key not configured"
            )
        
        try:
            genai.configure(api_key=self.api_key)
            # Initialize the model
            self.model = genai.GenerativeModel('gemini-2.0-flash')
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to configure Gemini API: {str(e)}"
            )
    
    def create_summarization_prompt(self, chunk_text: str) -> str:
        """
        Create prompt for summarization.
        
        Args:
            chunk_text: Text chunk to summarize
            
        Returns:
            str: Formatted prompt
        """
        prompt = f"""Summarize the following text into a 10–15 minute conversational educational podcast script. Keep a smooth narrative, simple language, and structured sections with transitions. Text: {chunk_text}"""
        return prompt
    
    async def summarize_chunk(self, chunk_text: str) -> str:
        """
        Summarize a single text chunk.
        
        Args:
            chunk_text: Text chunk to summarize
            
        Returns:
            str: Summarized text
            
        Raises:
            HTTPException: If summarization fails
        """
        try:
            prompt = self.create_summarization_prompt(chunk_text)
            
            # Generate summary using Gemini
            response = self.model.generate_content(prompt)
            
            if not response.text:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Empty response from Gemini API"
                )
            
            return response.text.strip()
            
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to summarize text: {str(e)}"
            )
    
    async def summarize_chunks(self, chunks: List[str]) -> str:
        """
        Summarize multiple text chunks and combine results.
        
        Args:
            chunks: List of text chunks to summarize
            
        Returns:
            str: Combined summarized text
            
        Raises:
            HTTPException: If summarization fails
        """
        try:
            summaries = []
            
            # Process each chunk
            for i, chunk in enumerate(chunks):
                print(f"Summarizing chunk {i+1}/{len(chunks)}")
                summary = await self.summarize_chunk(chunk)
                summaries.append(summary)
            
            # Combine all summaries
            combined_summary = "\n\n".join(summaries)
            
            return combined_summary
            
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to summarize chunks: {str(e)}"
            )
    
    async def create_podcast_script(self, text: str) -> str:
        """
        Create a complete podcast script from input text.
        
        Args:
            text: Input text to convert to podcast script
            
        Returns:
            str: Complete podcast script
            
        Raises:
            HTTPException: If script creation fails
        """
        try:
            # If text is already small, summarize directly
            if len(text.split()) <= settings.CHUNK_SIZE:
                return await self.summarize_chunk(text)
            
            # For larger texts, we need to chunk and summarize
            from text_processor import text_processor
            chunks = text_processor.process_text_for_chunking(text)
            
            if not chunks:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="No valid text chunks found"
                )
            
            # Summarize all chunks
            return await self.summarize_chunks(chunks)
            
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to create podcast script: {str(e)}"
            )

# Global summarizer instance
summarizer = Summarizer()
