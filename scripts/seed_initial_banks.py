#!/usr/bin/env python3
"""
Compile seed data for European savings banks into SQL insert statements.
Usage: python seed_initial_banks.py > ../sql/seed_generated.sql
"""

import json

BANKS = [
    {
        "name": "Sparkasse KölnBonn",
        "country": "Germany", "country_code": "DE", "city": "Cologne",
        "lat": 50.9375, "lng": 6.9603,
        "parent_group": "Sparkassen-Finanzgruppe",
        "founded_year": 1826, "total_assets": 30000, "customer_count": 1000,
        "employee_count": 4200, "branch_count": 90, "featured": True,
        "features": {"mobile_banking": "advanced", "open_banking": "intermediate",
                     "digital_onboarding": "intermediate", "ai_chatbot": "basic",
                     "devops_cloud": "intermediate"},
    },
    {
        "name": "Hamburger Sparkasse",
        "country": "Germany", "country_code": "DE", "city": "Hamburg",
        "lat": 53.5511, "lng": 9.9937,
        "parent_group": "Sparkassen-Finanzgruppe",
        "founded_year": 1827, "total_assets": 50000, "customer_count": 1500,
        "employee_count": 5000, "branch_count": 100, "featured": True,
        "features": {"mobile_banking": "advanced", "open_banking": "intermediate",
                     "digital_onboarding": "advanced", "ai_chatbot": "intermediate",
                     "devops_cloud": "intermediate"},
    },
    {
        "name": "CaixaBank",
        "country": "Spain", "country_code": "ES", "city": "Valencia",
        "lat": 39.4699, "lng": -0.3763,
        "founded_year": 2011, "total_assets": 600000, "customer_count": 20000,
        "employee_count": 44000, "branch_count": 4400, "featured": True,
        "features": {"mobile_banking": "advanced", "open_banking": "advanced",
                     "digital_onboarding": "advanced", "ai_chatbot": "advanced",
                     "devops_cloud": "advanced"},
    },
    {
        "name": "Swedbank",
        "country": "Sweden", "country_code": "SE", "city": "Stockholm",
        "lat": 59.3293, "lng": 18.0686,
        "founded_year": 1820, "total_assets": 250000, "customer_count": 7000,
        "employee_count": 14000, "branch_count": 350, "featured": True,
        "features": {"mobile_banking": "advanced", "open_banking": "advanced",
                     "digital_onboarding": "advanced", "ai_chatbot": "intermediate",
                     "devops_cloud": "advanced"},
    },
    {
        "name": "Erste Group",
        "country": "Austria", "country_code": "AT", "city": "Vienna",
        "lat": 48.2082, "lng": 16.3738,
        "founded_year": 1819, "total_assets": 300000, "customer_count": 17000,
        "employee_count": 46000, "branch_count": 1200, "featured": True,
        "features": {"mobile_banking": "advanced", "open_banking": "advanced",
                     "digital_onboarding": "advanced", "ai_chatbot": "advanced",
                     "devops_cloud": "intermediate"},
    },
]

MATURITY_POINTS = {"none": 0, "basic": 1, "intermediate": 2, "advanced": 3}

def compute_score(features):
    total = sum(MATURITY_POINTS[v] for v in features.values())
    return round((total / 15) * 100)

def sql_str(val):
    if val is None:
        return "NULL"
    if isinstance(val, bool):
        return "true" if val else "false"
    if isinstance(val, (int, float)):
        return str(val)
    escaped = str(val).replace("'", "''")
    return f"'{escaped}'"

def generate_sql():
    print("-- Auto-generated seed data")
    print()
    for bank in BANKS:
        score = compute_score(bank["features"])
        print(f"-- {bank['name']} (Score: {score})")
        print(f"WITH b AS (")
        cols = ["name", "country", "country_code", "city", "latitude", "longitude"]
        vals = [sql_str(bank["name"]), sql_str(bank["country"]), sql_str(bank["country_code"]),
                sql_str(bank["city"]), str(bank["lat"]), str(bank["lng"])]

        if bank.get("parent_group"):
            cols.append("parent_group")
            vals.append(sql_str(bank["parent_group"]))
        if bank.get("founded_year"):
            cols.append("founded_year")
            vals.append(str(bank["founded_year"]))
        if bank.get("total_assets"):
            cols.append("total_assets")
            vals.append(str(bank["total_assets"]))
        if bank.get("customer_count"):
            cols.append("customer_count")
            vals.append(str(bank["customer_count"]))
        if bank.get("employee_count"):
            cols.append("employee_count")
            vals.append(str(bank["employee_count"]))
        if bank.get("branch_count"):
            cols.append("branch_count")
            vals.append(str(bank["branch_count"]))

        cols.extend(["digital_score", "status", "featured"])
        vals.extend([str(score), "'published'", sql_str(bank.get("featured", False))])

        print(f"  INSERT INTO banks ({', '.join(cols)})")
        print(f"  VALUES ({', '.join(vals)})")
        print(f"  RETURNING id")
        print(f")")

        feature_rows = []
        for cat, level in bank["features"].items():
            present = "true" if level != "none" else "false"
            feature_rows.append(f"  ((SELECT id FROM b), '{cat}', {present}, '{level}')")

        print(f"INSERT INTO digital_features (bank_id, category, present, maturity_level) VALUES")
        print(",\n".join(feature_rows) + ";")
        print()

if __name__ == "__main__":
    generate_sql()
