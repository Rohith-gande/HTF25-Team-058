"""
Text processing module for chunking and summarization.
"""
import re
from typing import List
from config import settings

class TextProcessor:
    """Handles text chunking and processing for summarization."""
    
    def __init__(self):
        """Initialize text processor."""
        self.chunk_size = settings.CHUNK_SIZE
    
    def count_words(self, text: str) -> int:
        """
        Count words in text.
        
        Args:
            text: Input text
            
        Returns:
            int: Word count
        """
        # Split by whitespace and filter out empty strings
        words = [word for word in text.split() if word.strip()]
        return len(words)
    
    def split_into_sentences(self, text: str) -> List[str]:
        """
        Split text into sentences.
        
        Args:
            text: Input text
            
        Returns:
            List[str]: List of sentences
        """
        # Simple sentence splitting using regex
        sentences = re.split(r'[.!?]+', text)
        # Filter out empty sentences and strip whitespace
        sentences = [s.strip() for s in sentences if s.strip()]
        return sentences
    
    def create_chunks(self, text: str) -> List[str]:
        """
        Split large text into chunks for processing.
        
        Args:
            text: Input text to chunk
            
        Returns:
            List[str]: List of text chunks
        """
        word_count = self.count_words(text)
        
        # If text is small enough, return as single chunk
        if word_count <= self.chunk_size:
            return [text]
        
        # Split into sentences first
        sentences = self.split_into_sentences(text)
        chunks = []
        current_chunk = ""
        current_word_count = 0
        
        for sentence in sentences:
            sentence_word_count = self.count_words(sentence)
            
            # If adding this sentence would exceed chunk size, start new chunk
            if current_word_count + sentence_word_count > self.chunk_size and current_chunk:
                chunks.append(current_chunk.strip())
                current_chunk = sentence
                current_word_count = sentence_word_count
            else:
                # Add sentence to current chunk
                if current_chunk:
                    current_chunk += " " + sentence
                else:
                    current_chunk = sentence
                current_word_count += sentence_word_count
        
        # Add the last chunk if it has content
        if current_chunk.strip():
            chunks.append(current_chunk.strip())
        
        return chunks
    
    def clean_text(self, text: str) -> str:
        """
        Clean and normalize text.
        
        Args:
            text: Input text
            
        Returns:
            str: Cleaned text
        """
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text)
        # Remove special characters that might interfere with processing
        text = re.sub(r'[^\w\s.,!?;:\-()]', '', text)
        return text.strip()
    
    def process_text_for_chunking(self, text: str) -> List[str]:
        """
        Process text and create chunks for summarization.
        
        Args:
            text: Input text
            
        Returns:
            List[str]: List of processed text chunks
        """
        # Clean the text first
        cleaned_text = self.clean_text(text)
        
        # Create chunks
        chunks = self.create_chunks(cleaned_text)
        
        # Ensure chunks are not empty
        chunks = [chunk for chunk in chunks if chunk.strip()]
        
        return chunks

# Global text processor instance
text_processor = TextProcessor()
