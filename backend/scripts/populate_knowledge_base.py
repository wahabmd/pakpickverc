import asyncio
import subprocess
import json
import os
import sys
from datetime import datetime

# Add the project root to sys.path
root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
sys.path.append(root)

# Keywords to "train" the AI with (popular niches in Pakistan)
DEFAULT_KEYWORDS = [
    "earbuds", "smart watch", "power bank", "kitchen gadgets",
    "hair dryer", "mini fan", "tripod", "gaming mouse",
    "led strip lights", "wall clock", "water bottle", "yoga mat",
    "mechanical keyboard", "air fryer", "electric kettle", "blender",
    "mens kurta", "lawn suit", "handbags", "makeup pallet",
    "vitamin c serum", "sunblock", "protein powder", "creatine",
    "gym wear", "dumbbells", "ring light", "vlogging mic",
    "wall decor", "artificial plants", "cushion covers", "car vacuum"
]

async def ingest_keyword(keyword):
    print(f"🚀 Ingesting: {keyword}...")
    try:
        from backend.main import search
        from backend.database import Database
        
        if Database.mode == "Disconnected":
            await Database.connect_db()
            
        # Call the actual search function directly
        results = await search(keyword)
        count = len(results.get("results", []))
        
        if count > 0:
            print(f"✅ Successfully ingested {count} items for '{keyword}'")
        else:
            print(f"⚠️ No new items found for '{keyword}' (Check scrapers)")
            
    except Exception as e:
        print(f"⚠️ Error during ingestion of {keyword}: {e}")

async def main():
    print("PakPick AI - Deep Knowledge Base Ingestion")
    print("=========================================")
    
    # 1. Dynamically discover categories from Daraz/Markaz
    print("🔍 Discovering current platform categories...")
    from backend.scripts.discover_categories import discover_categories
    scanned_cats = await discover_categories()
    
    # Combine lists
    KEYWORDS = list(set(DEFAULT_KEYWORDS + scanned_cats))
    
    print(f"Starting bulk ingestion for {len(KEYWORDS)} niches...")
    
    # Run in batches
    batch_size = 3
    for i in range(0, len(KEYWORDS), batch_size):
        batch = KEYWORDS[i:i+batch_size]
        tasks = [ingest_keyword(k) for k in batch]
        await asyncio.gather(*tasks)
        print(f"--- Finished batch {i//batch_size + 1} ---")
        await asyncio.sleep(1)

    print("\n🎉 Bulk Ingestion Complete!")
    print("The local TinyDB is now populated with real market data.")
    print("MLEngine will now prioritize these cached real results over mock data.")

if __name__ == "__main__":
    asyncio.run(main())
