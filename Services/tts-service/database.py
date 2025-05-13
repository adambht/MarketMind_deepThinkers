from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ConnectionFailure
import os
from datetime import datetime

# MongoDB connection settings
MONGO_URL = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.environ.get("DB_NAME", "tts_service")

# Collections
HISTORY_COLLECTION = "tts_history"

class Database:
    client = None
    db = None
    connected = False

    @classmethod
    async def connect(cls):
        try:
            cls.client = AsyncIOMotorClient(MONGO_URL)
            # Check connection
            await cls.client.admin.command('ping')
            cls.db = cls.client[DB_NAME]
            cls.connected = True
            print(f"Connected to MongoDB at {MONGO_URL}")
            return True
        except ConnectionFailure as e:
            print(f"Failed to connect to MongoDB: {e}")
            cls.connected = False
            return False

    @classmethod
    async def close(cls):
        if cls.client is not None:
            cls.client.close()
            cls.connected = False
            print("MongoDB connection closed")

    @classmethod
    async def log_tts_request(cls, text, speaker, output_file, status="success", error=None):
        """Log a TTS request to the database"""
        if not cls.connected or cls.db is None:
            print("Warning: Cannot log to database - not connected")
            return False
        
        # Create timestamp as datetime for MongoDB (good for sorting/querying)
        now = datetime.utcnow()
        
        document = {
            "text": text,
            "speaker": speaker,
            "output_file": output_file,
            "timestamp": now,  # Store as datetime in MongoDB
            "status": status
        }
        
        if error:
            document["error"] = str(error)
            
        await cls.db[HISTORY_COLLECTION].insert_one(document)
        return True
    
    @classmethod
    async def get_history(cls, limit=50, skip=0):
        """Get TTS request history"""
        if not cls.connected or cls.db is None:
            print("Warning: Cannot get history - not connected to database")
            return []
            
        cursor = cls.db[HISTORY_COLLECTION].find(
            {}, 
            {'_id': 0}  # Exclude MongoDB's _id field
        ).sort('timestamp', -1).skip(skip).limit(limit)
        
        # Get the results
        results = await cursor.to_list(length=limit)
        
        # Convert datetime objects to ISO format strings
        for item in results:
            if 'timestamp' in item and isinstance(item['timestamp'], datetime):
                item['timestamp'] = item['timestamp'].isoformat()
                
        return results