"""
File processing module for PDF and TXT file handling.
"""
import os
import PyPDF2
from fastapi import HTTPException, status, UploadFile
from typing import Tuple
from config import settings

class FileProcessor:
    """Handles file upload, validation, and text extraction."""
    
    def __init__(self):
        """Initialize file processor."""
        self.allowed_extensions = settings.ALLOWED_EXTENSIONS
        self.max_file_size = settings.MAX_FILE_SIZE
    
    def validate_file(self, file: UploadFile) -> Tuple[bool, str]:
        """
        Validate uploaded file for type and size.
        
        Args:
            file: Uploaded file object
            
        Returns:
            Tuple[bool, str]: (is_valid, error_message)
        """
        # Check file size
        if hasattr(file, 'size') and file.size and file.size > self.max_file_size:
            return False, f"File size exceeds {self.max_file_size / (1024*1024):.1f}MB limit"
        
        # Check file extension
        if not file.filename:
            return False, "No filename provided"
        
        file_extension = os.path.splitext(file.filename.lower())[1]
        if file_extension not in self.allowed_extensions:
            return False, f"Unsupported file type. Allowed: {', '.join(self.allowed_extensions)}"
        
        return True, ""
    
    async def extract_text_from_pdf(self, file_content: bytes) -> str:
        """
        Extract text content from PDF file.
        
        Args:
            file_content: PDF file content as bytes
            
        Returns:
            str: Extracted text content
            
        Raises:
            HTTPException: If PDF processing fails
        """
        try:
            import io
            pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_content))
            text = ""
            
            for page_num in range(len(pdf_reader.pages)):
                page = pdf_reader.pages[page_num]
                text += page.extract_text() + "\n"
            
            if not text.strip():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="No text content found in PDF"
                )
            
            return text.strip()
            
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to extract text from PDF: {str(e)}"
            )
    
    async def extract_text_from_txt(self, file_content: bytes) -> str:
        """
        Extract text content from TXT file.
        
        Args:
            file_content: TXT file content as bytes
            
        Returns:
            str: Extracted text content
            
        Raises:
            HTTPException: If text processing fails
        """
        try:
            # Try different encodings
            encodings = ['utf-8', 'latin-1', 'cp1252', 'iso-8859-1']
            text = None
            
            for encoding in encodings:
                try:
                    text = file_content.decode(encoding)
                    break
                except UnicodeDecodeError:
                    continue
            
            if text is None:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Unable to decode text file with supported encodings"
                )
            
            if not text.strip():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="No text content found in file"
                )
            
            return text.strip()
            
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to extract text from file: {str(e)}"
            )
    
    async def process_uploaded_file(self, file: UploadFile) -> Tuple[str, str]:
        """
        Process uploaded file and extract text content.
        
        Args:
            file: Uploaded file object
            
        Returns:
            Tuple[str, str]: (extracted_text, original_filename)
            
        Raises:
            HTTPException: If file processing fails
        """
        # Validate file
        is_valid, error_msg = self.validate_file(file)
        if not is_valid:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=error_msg
            )
        
        # Read file content
        try:
            file_content = await file.read()
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to read file: {str(e)}"
            )
        
        # Extract text based on file type
        file_extension = os.path.splitext(file.filename.lower())[1]
        
        if file_extension == ".pdf":
            text_content = await self.extract_text_from_pdf(file_content)
        elif file_extension == ".txt":
            text_content = await self.extract_text_from_txt(file_content)
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Unsupported file type"
            )
        
        return text_content, file.filename

# Global file processor instance
file_processor = FileProcessor()
