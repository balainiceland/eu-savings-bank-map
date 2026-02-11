#!/usr/bin/env python3
"""
Scrape ESBG (European Savings and Retail Banking Group) member directory.
Outputs a JSON file of member banks with basic info for further enrichment.

Requirements:
  pip install requests beautifulsoup4

Usage:
  python scrape_esbg_members.py > esbg_members.json
"""

import json
import sys

def main():
    try:
        import requests
        from bs4 import BeautifulSoup
    except ImportError:
        print("Install dependencies: pip install requests beautifulsoup4", file=sys.stderr)
        sys.exit(1)

    # ESBG members page (URL may need updating)
    url = "https://www.wsbi-esbg.org/members/"

    print(f"Fetching {url}...", file=sys.stderr)

    try:
        response = requests.get(url, timeout=30, headers={
            "User-Agent": "Mozilla/5.0 (Research Bot - European Savings Bank Map)"
        })
        response.raise_for_status()
    except requests.RequestException as e:
        print(f"Error fetching page: {e}", file=sys.stderr)
        print("You may need to update the URL or check network access.", file=sys.stderr)
        # Output placeholder data
        placeholder = [
            {"name": "ESBG Member Scraping", "status": "URL needs verification",
             "note": "Visit https://www.wsbi-esbg.org/ to find current member directory URL"}
        ]
        print(json.dumps(placeholder, indent=2))
        return

    soup = BeautifulSoup(response.text, "html.parser")

    members = []
    # Look for member entries — structure depends on actual page
    # This is a template that will need adjustment based on actual HTML
    for card in soup.select(".member-card, .member-item, article"):
        name_el = card.select_one("h2, h3, .title, .name")
        country_el = card.select_one(".country, .location")
        link_el = card.select_one("a[href]")

        if name_el:
            member = {
                "name": name_el.get_text(strip=True),
                "country": country_el.get_text(strip=True) if country_el else None,
                "website": link_el["href"] if link_el else None,
            }
            members.append(member)

    print(f"Found {len(members)} members", file=sys.stderr)
    print(json.dumps(members, indent=2, ensure_ascii=False))

if __name__ == "__main__":
    main()
