import asyncio
import motor.motor_asyncio
import os
import certifi
from dotenv import load_dotenv

load_dotenv()

async def test_connection():
    uri = os.getenv("MONGO_URI")
    print(f"Testing URI: {uri[:40]}...")
    
    try:
        client = motor.motor_asyncio.AsyncIOMotorClient(
            uri,
            serverSelectionTimeoutMS=5000,
            tlsCAFile=certifi.where()
        )
        # Attempt to ping
        await client.admin.command('ping')
        print("✅ SUCCESS: Connected to MongoDB!")
    except Exception as e:
        print(f"❌ FAILED: {str(e)}")
        
        if "SSL handshake failed" in str(e) or "TLSV1_ALERT_INTERNAL_ERROR" in str(e):
            print("\n💡 HINT: This is almost certainly an IP Whitelist issue.")
            print("1. Log in to MongoDB Atlas.")
            print("2. Go to 'Network Access'.")
            print("3. Add '0.0.0.0/0' (Allow access from anywhere) temporarily to confirm.")
        elif "Authentication failed" in str(e):
            print("\n💡 HINT: Incorrect username or password.")
            print("Check that special characters are URL encoded (e.g., # as %23).")

if __name__ == "__main__":
    asyncio.run(test_connection())
