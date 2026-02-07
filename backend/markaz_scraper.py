import asyncio
import json
import sys
from playwright.async_api import async_playwright
from playwright_stealth import Stealth

async def scrape_markaz(keyword):
    results = []
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            viewport={'width': 1280, 'height': 720}
        )
        page = await context.new_page()
        await Stealth().apply_stealth_async(page)
        
        # SPEED OPTIMIZATION: Block heavy media but NOT images
        async def block_aggressively(route):
            if route.request.resource_type in ["media", "font"]:
                await route.abort()
            else:
                await route.continue_()
        await page.route("**/*", block_aggressively)
        # Try the most likely search URL
        search_urls = [
            f"https://markaz.app/search?q={keyword.replace(' ', '%20')}",
            f"https://www.shop.markaz.app/explore/search?q={keyword.replace(' ', '%20')}"
        ]
        
        for search_url in search_urls:
            print(f"📡 Probing Markaz: {search_url}", file=sys.stderr)
            try:
                # We don't block CSS here because it might break hydration and rendering
                await page.goto(search_url, wait_until="networkidle", timeout=30000)
                await asyncio.sleep(4) # Wait for cards to render
                
                # Use page.evaluate to extract products
                products_data = await page.evaluate('''() => {
                    const found = [];
                    // Look for anything that looks like a product card
                    const linkTags = Array.from(document.querySelectorAll('a'));
                    
                    linkTags.forEach(a => {
                        const href = a.href;
                        // Products usually have ID in URL or /product/
                        if (href.includes('/product/') || href.includes('?id=')) {
                            const text = a.innerText || "";
                            if (text.includes('Rs') || text.includes('Rs.')) {
                                const img = a.querySelector('img');
                                found.push({
                                    title: text.split('\\n')[0].trim(),
                                    full_text: text,
                                    link: href,
                                    image: img ? img.src : ""
                                });
                            }
                        }
                    });

                    // Search by divs if anchors failed
                    if (found.length === 0) {
                       const divs = Array.from(document.querySelectorAll('div'));
                       divs.forEach(div => {
                           if (div.innerText && (div.innerText.includes('Rs') || div.innerText.includes('Rs.')) && div.querySelector('img')) {
                               const a = div.querySelector('a');
                               if (a) {
                                   found.push({
                                       title: div.innerText.split('\\n')[0].trim(),
                                       full_text: div.innerText,
                                       link: a.href,
                                       image: div.querySelector('img').src
                                   });
                               }
                           }
                       });
                    }
                    return found.slice(0, 15);
                }''')
                
                if products_data:
                    for p_data in products_data:
                        try:
                            # Extract price using regex from full_text
                            import re
                            raw_text = p_data.get('full_text', '')
                            price_match = re.search(r'Rs\.?\s*([\d,]+)', raw_text)
                            if price_match:
                                price_str = price_match.group(1).replace(',', '')
                                price = int(price_str)
                            else:
                                # Fallback sum-of-digits
                                price = int(''.join(filter(str.isdigit, raw_text))) if any(c.isdigit() for c in raw_text) else 0

                            if price > 0:
                                results.append({
                                    "title": p_data.get('title', "Markaz Product"),
                                    "price": price,
                                    "platform": "Markaz",
                                    "image": p_data.get('image', ""),
                                    "link": p_data.get('link', ""),
                                    "rating": 4.2,
                                    "reviews": 15,
                                    "growth": "+12%",
                                    "pos": 75
                                })
                        except: continue
                    
                    if results: break # Found results, stop probing
            except Exception as e:
                print(f"Probe failed for {search_url}: {e}", file=sys.stderr)
        
        await browser.close()
    return results

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps([]))
        sys.exit(1)
        
    keyword = sys.argv[1]
    results = asyncio.run(scrape_markaz(keyword))
    print(json.dumps(results))
