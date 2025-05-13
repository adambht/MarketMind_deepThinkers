from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ConnectionFailure
import os
from datetime import datetime

# MongoDB settings
MONGO_URL = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.environ.get("DB_NAME", "ad_service")
HISTORY_COLLECTION = "ad_history"

class Database:
    client = None
    db = None
    connected = False

    @classmethod
    async def connect(cls):
        try:
            cls.client = AsyncIOMotorClient(MONGO_URL)
            await cls.client.admin.command('ping')
            cls.db = cls.client[DB_NAME]
            cls.connected = True
            print(f"Connected to MongoDB at {MONGO_URL}")
        except ConnectionFailure as e:
            print(f"MongoDB connection failed: {e}")
            cls.connected = False

    @classmethod
    async def close(cls):
        if cls.client:
            cls.client.close()
            cls.connected = False
            print("MongoDB connection closed")

    @classmethod
    async def log_ad_request(cls, name, description, ad_text):
        if not cls.connected or cls.db is None:
            print("Warning: Database not connected")
            return False

        now = datetime.utcnow()
        document = {
            "name_market": name,
            "description": description,
            "generated_ad": ad_text,
            "timestamp": now
        }

        await cls.db[HISTORY_COLLECTION].insert_one(document)
        return True

    @classmethod
    async def get_history(cls, limit=50, skip=0):
        if not cls.connected or cls.db is None:
            print("Warning: Cannot fetch history - not connected")
            return []

        cursor = cls.db[HISTORY_COLLECTION].find({}, {'_id': 0}).sort("timestamp", -1).skip(skip).limit(limit)
        results = await cursor.to_list(length=limit)

        for item in results:
            if "timestamp" in item and isinstance(item["timestamp"], datetime):
                item["timestamp"] = item["timestamp"].isoformat()

        return results
