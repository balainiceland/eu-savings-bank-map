#!/usr/bin/env python3
"""
Geocode bank addresses using OpenCage Geocoder API.
Reads banks from Supabase, geocodes missing lat/lng, updates records.

Requirements:
  pip install opencage supabase

Usage:
  export OPENCAGE_API_KEY=your-key
  export SUPABASE_URL=https://your-project.supabase.co
  export SUPABASE_SERVICE_KEY=your-service-key
  python geocode_banks.py
"""

import os
import sys
import time

def main():
    try:
        from opencage.geocoder import OpenCageGeocode
        from supabase import create_client
    except ImportError:
        print("Install dependencies: pip install opencage supabase")
        sys.exit(1)

    api_key = os.environ.get("OPENCAGE_API_KEY")
    supabase_url = os.environ.get("SUPABASE_URL")
    supabase_key = os.environ.get("SUPABASE_SERVICE_KEY")

    if not all([api_key, supabase_url, supabase_key]):
        print("Set OPENCAGE_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_KEY")
        sys.exit(1)

    geocoder = OpenCageGeocode(api_key)
    supabase = create_client(supabase_url, supabase_key)

    # Fetch banks with lat=0 or lng=0
    result = supabase.table("banks").select("id, name, city, country, address").or_("latitude.eq.0,longitude.eq.0").execute()
    banks = result.data or []

    print(f"Found {len(banks)} banks needing geocoding")

    for bank in banks:
        query_parts = [bank.get("address", ""), bank.get("city", ""), bank.get("country", "")]
        query = ", ".join(p for p in query_parts if p)

        if not query:
            print(f"  Skipping {bank['name']}: no address info")
            continue

        print(f"  Geocoding: {bank['name']} -> {query}")

        try:
            results = geocoder.geocode(query)
            if results:
                lat = results[0]["geometry"]["lat"]
                lng = results[0]["geometry"]["lng"]
                print(f"    -> {lat}, {lng}")

                supabase.table("banks").update({
                    "latitude": lat,
                    "longitude": lng,
                }).eq("id", bank["id"]).execute()
            else:
                print(f"    -> No results")
        except Exception as e:
            print(f"    -> Error: {e}")

        time.sleep(1)  # Rate limiting

    print("Done!")

if __name__ == "__main__":
    main()
