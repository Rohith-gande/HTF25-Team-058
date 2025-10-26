"""
Main FastAPI application for AI-powered podcast generator.
"""
import os
import uvicorn
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
from endpoints import router
from error_handler import error_handler, cleanup_context
from config import settings

# Application lifespan management
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application lifespan."""
    # Startup
    print("🚀 Starting AI Podcast Generator API...")
    print(f"📁 Temp directory: {settings.TEMP_DIR}")
    print(f"🔧 Max file size: {settings.MAX_FILE_SIZE / (1024*1024):.1f}MB")
    print(f"📝 Chunk size: {settings.CHUNK_SIZE} words")
    
    # Create temp directory if it doesn't exist
    os.makedirs(settings.TEMP_DIR, exist_ok=True)
    
    yield
    
    # Shutdown
    print("🛑 Shutting down AI Podcast Generator API...")
    error_handler.cleanup_temp_files()
    print("✅ Cleanup completed")

# Create FastAPI application
app = FastAPI(
    title="AI Podcast Generator API",
    description="Generate AI-powered podcasts from PDF and TXT files",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(router, prefix="/api/v1")

# Mount static files for serving audio files
app.mount("/storage", StaticFiles(directory="storage"), name="storage")

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Handle all unhandled exceptions."""
    error_handler.cleanup_temp_files()
    
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": True,
            "message": "Internal server error",
            "detail": str(exc) if settings.DEBUG else "An unexpected error occurred"
        }
    )

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint with API information."""
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            "message": "AI Podcast Generator API",
            "version": "1.0.0",
            "endpoints": {
                "generate_podcast": "POST /api/v1/generate_podcast/",
                "get_podcasts": "GET /api/v1/user/podcasts",
                "get_podcast": "GET /api/v1/user/podcasts/{podcast_id}",
                "delete_podcast": "DELETE /api/v1/user/podcasts/{podcast_id}",
                "health": "GET /api/v1/health"
            },
            "features": [
                "PDF and TXT file upload",
                "AI-powered summarization using Gemini 2.0 Flash",
                "Text-to-speech conversion with gTTS",
                "Firebase Authentication and Storage",
                "User-specific podcast management"
            ]
        }
    )

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            "status": "healthy",
            "message": "AI Podcast Generator API is running"
        }
    )

if __name__ == "__main__":
    # Run the application
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
