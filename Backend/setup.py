"""
Setup script for the AI Podcast Generator API.
"""
import os
import sys
import subprocess
from pathlib import Path

def check_python_version():
    """Check if Python version is compatible."""
    if sys.version_info < (3, 8):
        print("❌ Python 3.8 or higher is required")
        sys.exit(1)
    print("✅ Python version is compatible")

def install_dependencies():
    """Install required dependencies."""
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ Dependencies installed successfully")
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install dependencies: {e}")
        sys.exit(1)

def create_directories():
    """Create necessary directories."""
    directories = ["temp_audio", "logs"]
    for directory in directories:
        os.makedirs(directory, exist_ok=True)
        print(f"✅ Created directory: {directory}")

def create_env_file():
    """Create .env file from template."""
    env_file = Path(".env")
    if not env_file.exists():
        env_content = """# Firebase Configuration
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\nYour private key here\\n-----END PRIVATE KEY-----\\n"
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com

# Gemini API Configuration
GEMINI_API_KEY=your-gemini-api-key

# Optional: Debug mode
DEBUG=false
"""
        with open(".env", "w") as f:
            f.write(env_content)
        print("✅ Created .env file - please configure your credentials")
    else:
        print("✅ .env file already exists")

def main():
    """Main setup function."""
    print("🚀 Setting up AI Podcast Generator API...")
    
    # Check Python version
    check_python_version()
    
    # Install dependencies
    install_dependencies()
    
    # Create directories
    create_directories()
    
    # Create environment file
    create_env_file()
    
    print("\n🎉 Setup completed successfully!")
    print("\n📝 Next steps:")
    print("1. Configure your .env file with Firebase and Gemini credentials")
    print("2. Run: python main.py")
    print("3. Test the API at: http://localhost:8000")

if __name__ == "__main__":
    main()
