import asyncio
import json
import sys
import os
from playwright.async_api import async_playwright

async def discover_categories():
    categories = set()
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        # --- 1. Discover Daraz Categories ---
        print("🔍 Scanning Daraz Categories...", file=sys.stderr)
        try:
            await page.goto("https://www.daraz.pk/", wait_until="domcontentloaded", timeout=30000)
            # Find any text inside their side-menu or main links
            daraz_cats = await page.evaluate('''() => {
                const names = [];
                // Target the side menu items specifically
                const items = document.querySelectorAll('.category-item-title, .lzd-site-menu-nav-category-label');
                items.forEach(i => names.push(i.innerText.trim()));
                return names;
            }''')
            categories.update([c.lower() for c in daraz_cats if c and len(c) > 2])
        except Exception as e:
            print(f"⚠️ Daraz Scan Error: {e}", file=sys.stderr)

        # --- 2. Discover Markaz Categories ---
        print("🔍 Scanning Markaz Categories...", file=sys.stderr)
        try:
            # Markaz often has a simple menu or homepage categories
            await page.goto("https://markaz.app/", wait_until="domcontentloaded", timeout=30000)
            markaz_cats = await page.evaluate('''() => {
                const names = [];
                // Look for category tiles or menu items
                const items = document.querySelectorAll('span, p, h3');
                items.forEach(i => {
                    const text = i.innerText.trim();
                    if (text.length > 3 && text.length < 20 && !text.includes('Rs.')) {
                        names.push(text);
                    }
                });
                return names;
            }''')
            categories.update([c.lower() for c in markaz_cats if c and len(c) > 2])
        except Exception as e:
            print(f"⚠️ Markaz Scan Error: {e}", file=sys.stderr)

        await browser.close()
    
    # Filter out common non-category words
    stop_words = {'home', 'login', 'signup', 'cart', 'help', 'search', 'account', 'orders', 'explore', 'contact'}
    final_list = [c for c in categories if c not in stop_words and not c.isdigit()]
    
    return sorted(list(set(final_list)))

if __name__ == "__main__":
    found = asyncio.run(discover_categories())
    print(json.dumps(found))
