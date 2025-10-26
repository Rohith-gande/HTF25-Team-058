# AI Podcast Generator API

A complete FastAPI backend for generating AI-powered podcasts from PDF and TXT files using Gemini 2.0 Flash, gTTS, and Firebase services.

## Features

- **File Upload**: Accept PDF and TXT files via POST endpoint
- **User Authentication**: Firebase Authentication with token verification
- **Text Processing**: Intelligent text chunking for large documents
- **AI Summarization**: Gemini 2.0 Flash for creating podcast scripts
- **Text-to-Speech**: gTTS for audio generation with segment merging
- **Firebase Storage**: Secure file storage with public URLs
- **User Management**: Firestore for user-specific podcast history
- **RESTful API**: Complete CRUD operations for podcast management

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd podcast
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables**
   Create a `.env` file with the following variables:
   ```env
   FIREBASE_PROJECT_ID=your-firebase-project-id
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
   FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
   GEMINI_API_KEY=your-gemini-api-key
   ```

4. **Firebase Setup**
   - Create a Firebase project
   - Enable Authentication and Firestore
   - Create a service account and download the JSON key
   - Extract the required fields for environment variables

5. **Run the application**
   ```bash
   python main.py
   ```

## API Endpoints

### Authentication
All endpoints require a Firebase ID token in the Authorization header:
```
Authorization: Bearer <firebase-id-token>
```

### Endpoints

#### 1. Generate Podcast
- **POST** `/api/v1/generate_podcast/`
- **Description**: Upload a file and generate a podcast
- **Body**: Multipart form data with file
- **Response**: Podcast data with audio URL

#### 2. Get User Podcasts
- **GET** `/api/v1/user/podcasts`
- **Description**: Retrieve all podcasts for the authenticated user
- **Response**: List of user's podcasts

#### 3. Get Specific Podcast
- **GET** `/api/v1/user/podcasts/{podcast_id}`
- **Description**: Retrieve a specific podcast by ID
- **Response**: Podcast details

#### 4. Delete Podcast
- **DELETE** `/api/v1/user/podcasts/{podcast_id}`
- **Description**: Delete a podcast and its audio file
- **Response**: Deletion confirmation

#### 5. Health Check
- **GET** `/api/v1/health`
- **Description**: Check API health status
- **Response**: Service status

## Usage Examples

### 1. Generate Podcast
```bash
curl -X POST "http://localhost:8000/api/v1/generate_podcast/" \
  -H "Authorization: Bearer <firebase-id-token>" \
  -F "file=@document.pdf"
```

### 2. Get User Podcasts
```bash
curl -X GET "http://localhost:8000/api/v1/user/podcasts" \
  -H "Authorization: Bearer <firebase-id-token>"
```

### 3. Delete Podcast
```bash
curl -X DELETE "http://localhost:8000/api/v1/user/podcasts/{podcast_id}" \
  -H "Authorization: Bearer <firebase-id-token>"
```

## Project Structure

```
podcast/
├── main.py                 # Main FastAPI application
├── config.py              # Configuration settings
├── auth.py                # Firebase authentication
├── file_processor.py      # File upload and text extraction
├── text_processor.py      # Text chunking and processing
├── summarizer.py          # AI summarization with Gemini
├── tts_processor.py       # Text-to-speech conversion
├── storage.py             # Firebase Storage operations
├── database.py            # Firestore database operations
├── endpoints.py           # FastAPI route handlers
├── error_handler.py       # Error handling and cleanup
├── requirements.txt       # Python dependencies
└── README.md             # This file
```

## Configuration

### Environment Variables
- `FIREBASE_PROJECT_ID`: Your Firebase project ID
- `FIREBASE_PRIVATE_KEY`: Service account private key
- `FIREBASE_CLIENT_EMAIL`: Service account email
- `GEMINI_API_KEY`: Google Gemini API key

### Settings
- Max file size: 10MB
- Chunk size: 2000 words
- Supported formats: PDF, TXT
- Audio format: MP3
- TTS language: English

## Error Handling

The API includes comprehensive error handling for:
- Invalid file formats
- File size limits
- Authentication failures
- AI processing errors
- TTS conversion failures
- Storage operations
- Database operations

## Cleanup

The application automatically cleans up temporary files after processing. All local audio files are removed after successful upload to Firebase Storage.

## Development

### Running in Development
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Testing
```bash
# Test health endpoint
curl http://localhost:8000/health

# Test with authentication
curl -X GET "http://localhost:8000/api/v1/user/podcasts" \
  -H "Authorization: Bearer <firebase-id-token>"
```

## Production Deployment

1. **Environment Setup**
   - Set production environment variables
   - Configure CORS for your domain
   - Set up proper logging

2. **Firebase Configuration**
   - Ensure proper security rules
   - Configure storage bucket permissions
   - Set up Firestore security rules

3. **Deployment**
   - Use a production ASGI server like Gunicorn
   - Set up reverse proxy with Nginx
   - Configure SSL certificates

## Troubleshooting

### Common Issues

1. **Firebase Authentication Errors**
   - Verify service account credentials
   - Check Firebase project configuration
   - Ensure proper token format

2. **File Processing Errors**
   - Check file format and size
   - Verify file permissions
   - Ensure sufficient disk space

3. **AI Processing Errors**
   - Verify Gemini API key
   - Check API quotas and limits
   - Monitor API response times

4. **Storage Errors**
   - Verify Firebase Storage configuration
   - Check bucket permissions
   - Ensure proper file paths

## License

This project is licensed under the MIT License.

## Support

For support and questions, please create an issue in the repository.
