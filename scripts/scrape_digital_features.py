#!/usr/bin/env python3
"""
Check digital features for banks by examining app stores and websites.
Outputs a JSON assessment of digital maturity per bank.

Requirements:
  pip install requests beautifulsoup4

Usage:
  python scrape_digital_features.py --bank "CaixaBank" --country "Spain"
"""

import argparse
import json
import sys

def check_app_store(bank_name):
    """Check Apple App Store for bank's mobile app."""
    try:
        import requests
    except ImportError:
        return {"status": "unknown", "note": "requests not installed"}

    search_url = f"https://itunes.apple.com/search?term={bank_name}&entity=software&country=us&limit=5"
    try:
        resp = requests.get(search_url, timeout=10)
        data = resp.json()
        results = data.get("results", [])

        matching = [r for r in results if bank_name.lower() in r.get("trackName", "").lower()
                    or bank_name.lower() in r.get("artistName", "").lower()]

        if matching:
            app = matching[0]
            return {
                "found": True,
                "app_name": app.get("trackName"),
                "developer": app.get("artistName"),
                "rating": app.get("averageUserRating"),
                "rating_count": app.get("userRatingCount"),
                "url": app.get("trackViewUrl"),
            }
        return {"found": False}
    except Exception as e:
        return {"error": str(e)}

def check_website_features(website_url):
    """Check bank website for API/developer portal links."""
    if not website_url:
        return {"status": "no_website"}

    try:
        import requests
        from bs4 import BeautifulSoup
    except ImportError:
        return {"status": "dependencies_missing"}

    keywords = {
        "open_banking": ["api", "developer", "open banking", "psd2", "openapi"],
        "digital_onboarding": ["online account", "open account", "digital onboarding", "video ident"],
        "ai_chatbot": ["chatbot", "virtual assistant", "ai assistant", "robo-advis"],
    }

    try:
        resp = requests.get(website_url, timeout=15, headers={
            "User-Agent": "Mozilla/5.0 (Research Bot)"
        })
        text = resp.text.lower()

        results = {}
        for category, words in keywords.items():
            found = [w for w in words if w in text]
            results[category] = {
                "detected": len(found) > 0,
                "keywords_found": found,
            }
        return results
    except Exception as e:
        return {"error": str(e)}

def main():
    parser = argparse.ArgumentParser(description="Check digital features for a bank")
    parser.add_argument("--bank", required=True, help="Bank name")
    parser.add_argument("--website", help="Bank website URL")
    parser.add_argument("--country", help="Bank country")
    args = parser.parse_args()

    print(f"Assessing digital features for: {args.bank}", file=sys.stderr)

    assessment = {
        "bank": args.bank,
        "country": args.country,
        "app_store": check_app_store(args.bank),
    }

    if args.website:
        assessment["website_analysis"] = check_website_features(args.website)

    print(json.dumps(assessment, indent=2, ensure_ascii=False))

if __name__ == "__main__":
    main()
