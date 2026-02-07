from tinydb import TinyDB, Query
import os
import json
from datetime import datetime

def populate_cache():
    if not os.path.exists('backend/data'):
        os.makedirs('backend/data')
    
    db = TinyDB('backend/data/local_storage.json')
    cache_table = db.table('search_cache')
    QueryObj = Query()

    # Sample "Real" Results for "Kurta"
    kurta_results = [
        {
            "title": "Stitched Cotton Kurta for Men - Summer Collection",
            "price": 1850,
            "platform": "Daraz",
            "image": "https://images.unsplash.com/photo-1597983073492-bc2401844ae8?w=200",
            "link": "https://www.daraz.pk/products/stitched-cotton-kurta-i432423.html",
            "sentiment_score": 0.85,
            "sentiment_label": "Positive",
            "pos_score": 88.5,
            "growth": "+15.2%",
            "confidence": "92%"
        },
        {
            "title": "Embroidered Lawn Kurti - Elegant Wear",
            "price": 2400,
            "platform": "Markaz",
            "image": "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=200",
            "link": "https://www.shop.markaz.app/product/32423",
            "sentiment_score": 0.72,
            "sentiment_label": "Positive",
            "pos_score": 76.1,
            "growth": "+8.4%",
            "confidence": "85%"
        }
    ]

    # Sample "Real" Results for "Mouse"
    mouse_results = [
        {
            "title": "Logitech G502 Hero Gaming Mouse",
            "price": 8500,
            "platform": "Daraz",
            "image": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=200",
            "link": "https://www.daraz.pk/products/g502-i123123.html",
            "sentiment_score": 0.95,
            "sentiment_label": "Positive",
            "pos_score": 94.2,
            "growth": "+22.1%",
            "confidence": "98%"
        }
    ]

    cache_table.upsert({"q": "kurta", "results": kurta_results, "timestamp": datetime.now().isoformat()}, QueryObj.q == "kurta")
    cache_table.upsert({"q": "mouse", "results": mouse_results, "timestamp": datetime.now().isoformat()}, QueryObj.q == "mouse")
    
    print("✅ Pre-populated cache for 'kurta' and 'mouse'.")

if __name__ == "__main__":
    populate_cache()
