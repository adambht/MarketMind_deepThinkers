from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from generator import generate_ad
from database import Database  # ✅ the class that handles MongoDB
from typing import List
import os

app = FastAPI()

class AdRequest(BaseModel):
    name_market: str
    description: str

@app.post("/generate")
async def generate_ad_route(req: AdRequest):
    try:
        ad = generate_ad(req.name_market, req.description)
        # Use Database.log_ad_request instead of insert_history
        await Database.log_ad_request(req.name_market, req.description, ad)
        return {"generated_ad": ad}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health_check():
    return {"status": "OK"}

@app.on_event("startup")
async def startup():
    await Database.connect()

@app.on_event("shutdown")
async def shutdown():
    await Database.close()

class AdHistoryItem(BaseModel):
    name_market: str
    description: str
    generated_ad: str
    timestamp: str

@app.get("/history", response_model=List[AdHistoryItem])
async def get_history(limit: int = 50, skip: int = 0):
    try:
        history = await Database.get_history(limit=limit, skip=skip)
        return history
    except Exception as e:
        print(f"Error retrieving ad history: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve history: {str(e)}")