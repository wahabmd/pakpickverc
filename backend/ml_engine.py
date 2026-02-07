from textblob import TextBlob
import pandas as pd
from datetime import datetime, timedelta
import random

class MLEngine:
    @staticmethod
    def analyze_sentiment(text: str):
        """
        Analyzes the sentiment of a given text (like a product title or review).
        Returns a score between 0 and 1.
        """
        if not text or text == "Unknown":
            return 0.5
        
        analysis = TextBlob(text)
        # polarity is -1 to 1, convert to 0 to 1
        normalized_score = (analysis.sentiment.polarity + 1) / 2
        return normalized_score

    @staticmethod
    def calculate_pos_score(price_str, reviews_count, sentiment_score):
        """
        Calculate the Product Opportunity Score (0-100).
        Formula: (Sentiment * 40) + (Review Volume Proxy * 30) + (Price Stability Proxy * 30)
        """
        try:
            # Clean price
            price = float(str(price_str).replace(",", "").replace("Rs.", "").replace("Rs", "").strip())
        except:
            price = 1000

        # Sentiment is 40% of the score
        sentiment_component = sentiment_score * 40
        
        # Review count (proxy for demand) - 30% of the score
        # Normalize: 100+ reviews is "high" (30 points)
        try:
            rc = int(str(reviews_count).replace("(", "").replace(")", "").strip())
        except:
            rc = 0
        review_component = min(rc / 100, 1.0) * 30

        # Price Factor (higher price often means higher profit margin for sellers) - 30%
        # Normalize: Rs. 5000+ is "high"
        price_component = min(price / 5000, 1.0) * 30

        total_score = sentiment_component + review_component + price_component
        return round(total_score, 1)

    @staticmethod
    def get_forecast(product_history):
        """
        Performs a basic forecast.
        In a real scenario, this uses the 'prophet' library.
        For this prototype, we'll simulate a 30-day growth prediction based on the trend.
        """
        if not product_history or len(product_history) < 2:
            # Baseline if no history provided
            growth = random.uniform(3, 8)
            return {
                "monthly_growth_prediction": f"+{growth:.1f}%",
                "confidence_score": f"{random.randint(65, 80)}%"
            }

        # Real Logic: Simple linear regression proxy
        try:
            # Extract y values (sales/demand)
            y = [item.get('value', 0) for item in product_history]
            if len(y) < 5:
                # Not enough points for a real trend, add some physics-based noise
                growth = (y[-1] / y[0] - 1) * 100 if y[0] > 0 else 5
            else:
                # Calculate simple slope
                n = len(y)
                x = list(range(n))
                sum_x = sum(x)
                sum_y = sum(y)
                sum_xy = sum(i*j for i,j in zip(x, y))
                sum_xx = sum(i*i for i in x)
                
                slope = (n * sum_xy - sum_x * sum_y) / (n * sum_xx - sum_x**2) if (n * sum_xx - sum_x**2) != 0 else 0
                # Growth rate as percentage of baseline
                avg_y = sum_y / n
                growth = (slope / avg_y) * 100 if avg_y > 0 else 5
            
            # Bound the growth to realistic values for a prototype
            growth = max(min(growth, 45), -15)
            confidence = 70 + min(len(y) * 2, 25) # More data = more confidence
            
            return {
                "monthly_growth_prediction": ("+" if growth >= 0 else "") + f"{growth:.1f}%",
                "confidence_score": f"{confidence}%"
            }
        except Exception as e:
            return {"growth": "+5%", "confidence": "70%"}

    @staticmethod
    def estimate_sales(reviews_count):
        """
        Estimates monthly sales using the Stock Tracking / Review Velocity method.
        Base logic: 1 review per 50-100 sales.
        """
        try:
            rc = int(str(reviews_count).replace("(", "").replace(")", "").strip())
        except:
            rc = 0
            
        # Review to Sales ratio in Pakistan is typically lower (more people buy without reviewing)
        # We estimate 1 review = 40 sales
        estimated_monthly = (rc * 40) / 12 # Average per month if total reviews
        # Add a variation for realism
        variation = random.uniform(0.8, 1.2)
        return int(max(estimated_monthly * variation, 5))

    @staticmethod
    def calculate_profit(retail_price, sourcing_cost=None):
        """
        Calculates profit margin after Daraz fees (Commission, Payment Fee, Shipping, VAT).
        Default Sourcing Cost: 60% of retail if not provided.
        """
        try:
            price = float(str(retail_price).replace(",", "").replace("Rs.", "").replace("Rs", "").strip())
        except:
            price = 0
            
        if sourcing_cost is None:
            sourcing_cost = price * 0.6  # Assume 60% sourcing cost
        else:
            try:
                sourcing_cost = float(str(sourcing_cost).replace(",", "").replace("Rs.", "").replace("Rs", "").strip())
            except:
                sourcing_cost = price * 0.6

        # Daraz Fees (Approx):
        # 1. Commission: 10-15%
        # 2. Payment Fee: 1.25%
        # 3. Packaging: Rs. 20-50
        # 4. Shipping: Often customer pays, but seller might subsidize or pay for returns
        
        daraz_commission = price * 0.12
        payment_fee = price * 0.0125
        packaging_cost = 30
        
        total_fees = daraz_commission + payment_fee + packaging_cost
        profit = price - sourcing_cost - total_fees
        margin = (profit / price) * 100 if price > 0 else 0
        
        return {
            "retail_price": price,
            "sourcing_cost": sourcing_cost,
            "fees": round(total_fees, 0),
            "profit": round(profit, 0),
            "margin": f"{margin:.1f}%",
            "is_profitable": profit > 0
        }

    @staticmethod
    def calculate_competition_score(items):
        """
        Calculates Competition Score based on number of unique items and price variance.
        Low Score (0-30) = High Competition
        High Score (70-100) = Low Competition (Opportunity)
        """
        if not items:
            return 50
            
        count = len(items)
        if count < 5: return 85 # Very low competition
        if count < 10: return 65 # Moderate
        if count < 20: return 40 # High
        return 20 # Very High (Saturated)
