import asyncio
import json
import os
import sys
from datetime import datetime, timedelta

# Add the project root to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))

from backend.database import Database

async def detect_emerging_trends():
    print("📈 PakPick AI: Trend Detection Engine")
    print("====================================")
    
    await Database.connect_db()
    
    # 1. Fetch all products from Knowledge Base
    all_products = await Database.get_products("products")
    
    if not all_products:
        print("❌ Knowledge Base is empty. Run ingestion first!")
        return

    # 2. Logic to detect "Newly Introduced & Trending"
    # Criteria:
    # - Recently added (if we had timestamps)
    # - High sentiment score (> 0.8)
    # - High POS score (> 75)
    # - Low review count (proxy for "New") but high growth prediction
    
    emerging = []
    for p in all_products:
        sentiment = p.get("sentiment_score", 0)
        pos = p.get("pos_score", 0)
        reviews = int(str(p.get("reviews", "0")).replace("(", "").replace(")", "").strip() or 0)
        
        # Heuristic for "Newly Introduced Trend"
        if sentiment > 0.8 and pos > 70 and reviews < 50:
            emerging.append(p)

    # Sort by the best opportunity
    emerging.sort(key=lambda x: x.get("pos_score", 0), reverse=True)

    print(f"✅ Analyzed {len(all_products)} products.")
    print(f"🔥 Found {len(emerging)} Emerging Trends!")
    print("-" * 40)
    
    for trend in emerging[:10]:
        print(f"Product: {trend['title']}")
        print(f"Platform: {trend['platform']} | Price: PKR {trend['price']}")
        print(f"Opportunity Score: {trend['pos_score']} | Status: NEWLY TRENDING")
        print("-" * 40)

    # Save these to a special trends table for the frontend
    if emerging:
        for trend in emerging:
            trend["detected_at"] = datetime.now().isoformat()
            trend["trend_type"] = "Emerging"
            await Database.save_product(trend, "emerging_trends")
        print(f"💾 Saved {len(emerging)} trends to database.")

if __name__ == "__main__":
    asyncio.run(detect_emerging_trends())
