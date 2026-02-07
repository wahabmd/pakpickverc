import asyncio
import os
import json
import sys

# Add project root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from backend.database import Database

async def migrate_data():
    print("🚀 PakPick AI: Cloud Migration Utility")
    print("======================================")
    
    # Connect (this will detect if MongoDB is available)
    await Database.connect_db()
    
    if Database.mode == "Local (Permanent Fix)":
        print("⚠️ MongoDB NOT connected/detected. Local mode is active.")
        print("⚠️ Migration aborted. Please set your MONGO_URI in .env first.")
        return

    print(f"📡 MongoDB Connected. Starting ingestion from local storage...")
    
    local_path = 'backend/data/local_storage.json'
    if not os.path.exists(local_path):
        print("❌ Local storage file not found. Nothing to migrate.")
        return

    try:
        from tinydb import TinyDB
        local_db = TinyDB(local_path)
        
        # 1. Migrate MAIN products
        products = local_db.table('products').all()
        print(f"📦 Found {len(products)} products locally.")
        for p in products:
            # save_product automatically favors Cloud if connected
            await Database.save_product(p, "products")
            
        # 2. Migrate TRENDS
        trends = local_db.table('emerging_trends').all()
        print(f"📦 Found {len(trends)} trends locally.")
        for t in trends:
            await Database.save_product(t, "emerging_trends")
            
        print("✅ Migration Complete! Your Cloud Database is now in sync.")
        
    except Exception as e:
        print(f"❌ Migration Error: {e}")

if __name__ == "__main__":
    asyncio.run(migrate_data())
