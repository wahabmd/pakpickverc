import json
import os
import asyncio
from backend.database import Database

COLAB_DATA_PATH = "backend/data/colab_data.json"

async def sync_colab_data(force=False):
    """
    Syncs data from colab_data.json to the active database (Cloud or Local).
    Only syncs if database is empty or force=True.
    """
    print("🔄 Data Seeder: Checking colab_data.json...")
    
    if not os.path.exists(COLAB_DATA_PATH):
        print(f"❌ Data Seeder: File not found at {COLAB_DATA_PATH}")
        return

    # Connect to DB if not connected
    if Database.mode == "Disconnected":
        await Database.connect_db()

    # Check if we already have products
    existing_products = await Database.get_products()
    if len(existing_products) > 0 and not force:
        print(f"✅ Data Seeder: Database already has {len(existing_products)} items. Skipping sync.")
        return

    try:
        with open(COLAB_DATA_PATH, "r", encoding="utf-8") as f:
            products = json.load(f)
        
        print(f"📦 Data Seeder: Found {len(products)} products in colab_data.json. Syncing...")
        
        count = 0
        for product in products:
            # Basic validation
            if "title" in product and "platform" in product:
                # Save to database (handling both Cloud/Local via Database class)
                await Database.save_product(product)
                count += 1
                if count % 100 == 0:
                    print(f"⚡ Synced {count}/{len(products)} products...")

        print(f"🏁 Data Seeder: Successfully synced {count} products to {Database.mode}.")
    except Exception as e:
        print(f"❌ Data Seeder Error: {e}")

if __name__ == "__main__":
    # Allow running as a standalone script
    asyncio.run(sync_colab_data(force=True))
