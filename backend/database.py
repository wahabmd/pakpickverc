import motor.motor_asyncio
import os
import json
import certifi
from tinydb import TinyDB, Query
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DATABASE_NAME = "pakpick_ai"

class Database:
    client: motor.motor_asyncio.AsyncIOMotorClient = None
    db: motor.motor_asyncio.AsyncIOMotorDatabase = None
    local_db: TinyDB = None
    mode: str = "Disconnected"

    @classmethod
    async def connect_db(cls):
        """Establish connection to MongoDB Atlas, with Local Fallback."""
        # 1. Try Cloud Atlas
        try:
            if not MONGO_URI:
                raise Exception("No MONGO_URI provided in .env")
                
            print(f"📡 Attempting to connect to Cloud MongoDB...")
            cls.client = motor.motor_asyncio.AsyncIOMotorClient(
                MONGO_URI, 
                tlsCAFile=certifi.where(),
                serverSelectionTimeoutMS=2000, # Ultra-fast timeout (2s)
                connectTimeoutMS=2000,
                socketTimeoutMS=2000,
            )
            cls.db = cls.client[DATABASE_NAME]
            # Force a call to ensure connection is actually alive
            await cls.client.admin.command('ping')
            cls.mode = "Cloud (Atlas)"
            print("✅ Successfully connected to MongoDB Atlas!")
            return
        except Exception as e:
            print(f"⚠️ Cloud Connection Failed (Switching to Local): {e}")
            cls.db = None
            cls.mode = "Local (Fallback Active)"
        
        # 2. Permanent Local Fallback (The Fix)
        try:
            print("🏠 Switching to Local Database Mode...")
            if not os.path.exists('backend/data'):
                os.makedirs('backend/data')
            cls.local_db = TinyDB('backend/data/local_storage.json')
            if cls.mode == "Disconnected":
                cls.mode = "Local (Permanent Fix)"
            print("✅ Local Database Initialized! (No IP/Internet issues anymore)")
        except Exception as local_e:
            print(f"❌ Critical Error: Could not initialize local DB: {local_e}")
            cls.mode = "Error"

    @classmethod
    async def save_product(cls, product_data, collection_name="products"):
        """Saves product to Cloud if available, otherwise Local JSON."""
        # Clean product data of non-JSON items (like ObjectIds)
        data_to_save = product_data.copy()
        if "_id" in data_to_save:
            data_to_save["_id"] = str(data_to_save["_id"])

        # Try Cloud
        if cls.db is not None:
            try:
                await cls.db[collection_name].update_one(
                    {"title": data_to_save["title"], "platform": data_to_save["platform"]},
                    {"$set": data_to_save},
                    upsert=True
                )
                return "Saved to Cloud"
            except:
                pass # Fallback to local if cloud fails during write
        
        # Try Local
        if cls.local_db is not None:
            table = cls.local_db.table(collection_name)
            Product = Query()
            table.upsert(data_to_save, (Product.title == data_to_save["title"]) & (Product.platform == data_to_save["platform"]))
            return "Saved to Local"
        
        return "Not Saved"

    @classmethod
    async def clear_collection(cls, collection_name):
        """Removes all items from a collection."""
        if cls.db is not None:
            try: await cls.db[collection_name].delete_many({})
            except: pass
        if cls.local_db is not None:
            try: cls.local_db.table(collection_name).truncate()
            except: pass

    @classmethod
    async def get_products(cls, collecton_name="products"):
        """Fetches products from either Cloud or Local."""
        if cls.db is not None:
            try:
                cursor = cls.db[collecton_name].find({})
                return await cursor.to_list(length=1000)
            except:
                pass
        
        if cls.local_db is not None:
            return cls.local_db.table(collecton_name).all()
            
        return []
