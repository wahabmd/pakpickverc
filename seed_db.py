import asyncio
import sys
from backend.database import Database
from backend.serp_scraper import scrape_serp
from backend.main import MLEngine

async def seed_database():
    """
    Smart Seeding Script to populate the database with high-demand niches.
    Uses the Deep Web Scraper to ensure reliable data.
    """
    print("🌱 Starting Smart Database Seeding...")
    await Database.connect_db()
    
    # Top 30 High-Potential Niches (Daraz & Markaz Mix)
    niches = [
        # Tech & Gadgets (Daraz Dominant)
        "Wireless Earbuds", "Smart Watch Series 8", "Gaming Mouse RGB", 
        "Mechanical Keyboard", "Ring Light with Stand", "Power Bank 20000mAh",
        "Gaming Headset", "Tripod Stand Mobile", "Laptop Stand Adjustable",
        "Action Camera 4k", "Bluetooth Speaker Portable", "Usb Hun C",
        "Android TV Box", "Wireless Charger Fast", "Smart Band Fitness",
        
        # Fashion & Lifestyle (Markaz/Reseller Dominant)
        "Ladies Handbag Luxury", "Men's Wallet Leather", "Makeup Brush Set",
        "Kitchen Chopper Electric", "Baby Diaper Bag", "Car Mobile Holder",
        "Solar Light Outdoor", "Face Serum Vitamin C", "Hair Straightener",
        "Mens Kurta Shalwar", "Ladies Lawn Suit 3pc", "Bed Sheet Double",
        "Water Bottle Insulated", "Shoe Rack Organizer", "Vegetable Slicer"
    ]
    
    total_added = 0
    
    for niche in niches:
        print(f"\n📡 Mining Niche: {niche}...")
        try:
            # use reliable SERP scraper
            results = await scrape_serp(f"{niche} price in pakistan daraz markaz")
            
            if results:
                print(f"   ✅ Found {len(results)} items. Storing...")
                for item in results:
                    # Add AI Analysis fields (Simulated for speed)
                    item["sentiment_score"] = 0.85
                    item["sentiment_label"] = "High Demand"
                    item["pos_score"] = 80 + (len(item["title"]) % 15)
                    item["advice"] = "Great seeding item."
                    
                    # Save to DB
                    await Database.save_product(item)
                total_added += len(results)
            else:
                print("   ⚠️ No results found.")
                
            # Respect rate limits
            await asyncio.sleep(2)
            
        except Exception as e:
            print(f"   ❌ Error: {e}")

    print(f"\n✨ Seeding Complete! Added {total_added} high-quality products to the Knowledge Base.")
    print("   Now your Survey and Search will feel 'Instant' for these topics.")

if __name__ == "__main__":
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())
    asyncio.run(seed_database())
