from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from fastapi.responses import FileResponse
from typing import List, Optional
from tts import generate_speech
from database import Database
import os

app = FastAPI(title="TTS Service", description="Multi-speaker TTS API")

class TTSRequest(BaseModel):
    text: str
    speaker: str

class TTSHistoryItem(BaseModel):
    text: str
    speaker: str
    output_file: str
    timestamp: str  # Already defined as string to match our converted ISO format
    status: str
    error: Optional[str] = None

@app.on_event("startup")
async def startup_db_client():
    db_connected = await Database.connect()
    if not db_connected:
        print("Warning: Application will run without database functionality")

@app.on_event("shutdown")
async def shutdown_db_client():
    await Database.close()

@app.post("/tts", summary="Generate speech from text and speaker")
async def tts_endpoint(request: TTSRequest):
    try:
        # Generate speech first
        output_path = generate_speech(request.text, request.speaker)
        
        # Try to log the request, but don't fail if database logging fails
        try:
            await Database.log_tts_request(
                text=request.text,
                speaker=request.speaker,
                output_file=output_path
            )
        except Exception as db_error:
            print(f"Failed to log to database: {db_error}")
            # Continue with the response even if logging fails
        
        return FileResponse(
            output_path, 
            media_type="audio/wav", 
            filename=os.path.basename(output_path)
        )
    except Exception as e:
        # Try to log the error, but don't worry if this fails
        try:
            await Database.log_tts_request(
                text=request.text,
                speaker=request.speaker,
                output_file="",
                status="error",
                error=str(e)
            )
        except Exception as db_error:
            print(f"Failed to log error to database: {db_error}")
        
        # Return the original error to the client
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/history", response_model=List[TTSHistoryItem], summary="Get TTS request history")
async def get_history(limit: int = 50, skip: int = 0):
    try:
        # Get history with timestamps already converted to ISO format strings
        history = await Database.get_history(limit=limit, skip=skip)
        
        # Additional validation to ensure all fields match the response model
        valid_history = []
        for item in history:
            try:
                # Make sure we have all required fields with proper types
                valid_item = {
                    "text": str(item.get("text", "")),
                    "speaker": str(item.get("speaker", "")),
                    "output_file": str(item.get("output_file", "")),
                    "timestamp": str(item.get("timestamp", "")),  # Ensure it's a string
                    "status": str(item.get("status", "unknown"))
                }
                
                # Add optional fields
                if "error" in item:
                    valid_item["error"] = str(item["error"])
                    
                valid_history.append(valid_item)
            except Exception as item_error:
                print(f"Skipping invalid history item: {item_error}")
                continue
                
        return valid_history
    except Exception as e:
        print(f"History retrieval error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve history: {str(e)}")

@app.get("/speakers", summary="Get available speakers")
async def get_speakers():
    try:
        # Import here to avoid circular imports
        from model_loader import speaker_embeddings
        return {"speakers": list(speaker_embeddings.keys())}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health", summary="Check service health")
async def health_check():
    status = {
        "service": "ok",
        "database": "connected" if Database.connected else "disconnected"
    }
    return status