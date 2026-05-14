"""Build the proposed budget-2026.json from the PDF.

Top-level categories = 10 City departments (faithful to the budget document).
Subcategories per department = expense-type breakdown from each dept's summary page.
"""
import pdfplumber, json, re, sys
from collections import OrderedDict

PDF = "C:/Users/aaron/Code/moncton-taxes/budget-pdf/2024_2026_budget.pdf"

# Department -> (start_page_index, display name).
# Page indices are 0-based; the "page #" mapping comes from map_sections.py output:
# (page#) 448 GRANTS / 449 GOVERNANCE / 451 CORPORATE / 453 LEGAL / 454 FINANCE
# 456 OPERATIONS / 458 CODIAC / 460 SUST GROWTH / 462 PROTECTIVE / 464 COMMUNITY
DEPTS = [
    # (display_name, slug, first_page_index, expected_total_2026)
    ("Protective Services",      "protective-services",  461,  71_156_443),  # 462 - 1
    ("Operations Services",      "operations-services",  455,  44_557_995),  # 456 - 1
    ("Finance Services",         "finance-services",     453,  40_905_837),  # 454 - 1
    ("Community Services",       "community-services",   463,  20_814_285),  # 464 - 1
    ("Codiac Transpo",           "codiac-transpo",       457,  15_927_808),  # 458 - 1
    ("Grants",                   "grants",               447,   8_953_571),  # 448 - 1
    ("Sustainable Growth and Development Services", "sustainable-growth-and-development", 459, 8_761_044),  # 460 - 1
    ("Corporate Services",       "corporate-services",   450,   8_630_571),  # 451 - 1
    ("Legal and City Clerk Services", "legal-and-city-clerk", 452, 1_431_872),  # 453 - 1
    ("Governance and Corporate Management", "governance-corp-management", 448, 1_332_291),  # 449 - 1
]

# Expense-type lines are normal-case (e.g. "Wages & Benefits", "Contracts").
# Major rollup lines are ALL-CAPS (e.g. "LABOUR COSTS", "NON-LABOUR COSTS", "RECOVERY").
# We want the leaf expense types, not the rollups.
ROLLUP_LABELS = {
    "LABOUR COSTS", "NON-LABOUR COSTS", "RECOVERY",
    "TOTAL REVENUES", "TOTAL EXPENSES", "NET COST", "EXPENSES", "REVENUES",
}

NUM_PATTERN = re.compile(r"\(?-?[\d,]+\)?")

def parse_amount(s):
    s = s.strip().replace(",", "").replace("$", "").replace(" ", "")
    neg = s.startswith("(") and s.endswith(")")
    if neg:
        s = s[1:-1]
    try:
        n = int(float(s))
        return -n if neg else n
    except ValueError:
        return None

def parse_line(line):
    """Parse an expense line of the form 'Label v1 v2 v3 v4 v5 pct%'.
    Returns (label, [v1,v2,v3,v4,v5], pct) or None if not parseable."""
    # Find all numbers in the line
    tokens = line.strip().split()
    if len(tokens) < 6:
        return None
    # The last token should be a percent (or 'INC' or similar). Skip last 1 if it ends with %.
    pct = None
    if tokens[-1].endswith("%"):
        pct = tokens[-1]
        tokens = tokens[:-1]
    # The last 5 tokens are the year values 2023B / 2023P / 2024 / 2025 / 2026
    if len(tokens) < 6:
        return None
    raw_vals = tokens[-5:]
    label = " ".join(tokens[:-5]).strip()
    if not label:
        return None
    vals = [parse_amount(v) for v in raw_vals]
    if any(v is None for v in vals):
        return None
    return label, vals, pct

def extract_dept(pdf, start_idx, expected_total):
    """Read pages starting at start_idx until we hit the TOTAL EXPENSES line
    matching expected_total. Return dict of {expense_type: {2024, 2025, 2026}}."""
    rows = OrderedDict()
    total_row = None
    found_total = False
    for offset in range(0, 4):  # at most 4 pages
        page_idx = start_idx + offset
        if page_idx >= len(pdf.pages):
            break
        text = pdf.pages[page_idx].extract_text() or ""
        for raw_line in text.split("\n"):
            line = raw_line.strip()
            if not line:
                continue
            parsed = parse_line(line)
            if not parsed:
                continue
            label, vals, _pct = parsed
            if label.upper() in ROLLUP_LABELS:
                if label.upper() == "TOTAL EXPENSES" and vals[-1] == expected_total:
                    total_row = vals
                    found_total = True
                continue
            # Skip lines that look like revenue (numeric account codes like 3221-00)
            if re.match(r"^\d{4}-\d{2}", label):
                continue
            # Capture expense-type rows
            if label not in rows:
                rows[label] = vals
        if found_total:
            break
    return rows, total_row

result_categories = []
warnings = []

with pdfplumber.open(PDF) as pdf:
    for display_name, slug, start_idx, expected in DEPTS:
        rows, total_row = extract_dept(pdf, start_idx, expected)
        if total_row is None:
            warnings.append(f"{display_name}: TOTAL EXPENSES = ${expected:,} not found")
            continue

        # Build subItems from the leaf expense-type rows.
        # Only include rows where 2026 (last value) is non-zero.
        sub_items = []
        for label, vals in rows.items():
            v2026 = vals[-1]
            if v2026 == 0:
                continue
            sub_items.append({
                "name": label,
                "amount": v2026,
            })

        # Reconcile: sum of expense-type rows (after removing the labour/non-labour rollups
        # we excluded) should = TOTAL EXPENSES. If off, flag.
        sub_sum = sum(s["amount"] for s in sub_items)
        if sub_sum != expected:
            warnings.append(
                f"{display_name}: subItem sum ${sub_sum:,} != TOTAL EXPENSES ${expected:,} "
                f"(diff ${sub_sum - expected:,})"
            )

        category = {
            "id": slug,
            "name": display_name,
            "amount": total_row[-1],   # 2026 budget
            "prev":   total_row[-2],   # 2025 budget
            "color": "",  # filled in below
            "description": "",  # filled in below
            "subItems": sub_items,
        }
        result_categories.append(category)

# Color palette (10 distinct, accessible-ish)
PALETTE = {
    "protective-services":         "#DC2626",  # red
    "operations-services":         "#2563EB",  # blue
    "finance-services":            "#0891B2",  # cyan
    "community-services":          "#059669",  # green
    "codiac-transpo":              "#8B5CF6",  # violet
    "grants":                      "#65A30D",  # lime
    "sustainable-growth-and-development": "#CA8A04",  # amber
    "corporate-services":          "#7C3AED",  # purple
    "legal-and-city-clerk":        "#475569",  # slate
    "governance-corp-management":  "#EA580C",  # orange
}

DESCRIPTIONS = {
    "protective-services": "Codiac RCMP (policing), Moncton Fire Department, bylaw enforcement, and emergency preparedness.",
    "operations-services": "Roads, snow & ice control, sidewalks, traffic signals, parks maintenance, public works, sanitation, and fleet.",
    "finance-services": "Finance, treasury, insurance, debt servicing (fiscal cost), capital transfers, and most city-wide fiscal expenses.",
    "community-services": "Parks programming, arenas, pools, the Coliseum, Magnetic Hill Zoo, Resurgo Place, Moncton Public Library, recreation, and culture.",
    "codiac-transpo": "Codiac Transpo public transit — bus operations, fares, maintenance, and routes serving Moncton, Dieppe, and Riverview.",
    "grants": "Operating grants the City pays to outside organizations — recreational, cultural, social-service, transportation, and protective grant recipients.",
    "sustainable-growth-and-development": "Urban planning, economic development, tourism, building inspection, engineering, and downtown initiatives.",
    "corporate-services": "City-wide corporate functions: communications, customer service, human resources, information systems, and strategic initiatives.",
    "legal-and-city-clerk": "City Clerk's office and the City's in-house legal services.",
    "governance-corp-management": "Mayor and Council, the Chief Administrative Officer's office, and high-level corporate management.",
}

for c in result_categories:
    c["color"] = PALETTE.get(c["id"], "#888888")
    c["description"] = DESCRIPTIONS.get(c["id"], "")

# Sort by 2026 amount descending (existing breakdown.js does this at runtime, but
# keeping the JSON in the same order makes diffs easier to read).
result_categories.sort(key=lambda c: -c["amount"])

total_2026 = sum(c["amount"] for c in result_categories)
total_2025 = sum(c["prev"]  for c in result_categories)

doc = {
    "fiscalYear": 2026,
    "totalOperating": total_2026,
    "totalOperatingPrev": total_2025,
    "prevFiscalYear": 2025,
    # The 2024-2026 budget PDF only quotes the 2024 rate ($1.4287/$100). 2026's rate
    # was set in a separate Council session (Nov 2025 news release per user note).
    # Keep placeholder until that source is reconciled.
    "taxRatePer100": 1.3614,
    "taxRateNote": "PROVISIONAL — 2026 rate is not in the 2024-2026 Budget Document; needs verification against November 2025 Council news release.",
    "sourceUrl": "https://www5.moncton.ca/docs/councilmeetings/2023/2024_2026%20Budget_Document_Final.pdf",
    "sourceLabel": "City of Moncton 2024-2026 Multi-Year Budget Document (Final)",
    "lastUpdated": "2026-05-14",
    "dataStatus": "transcribed-2024-2026-budget",
    "dataStatusNote": "Top-level totals and per-department expense-type subcategories transcribed from the City of Moncton 2024-2026 Multi-Year Budget Document (published 2023). 2026 figures are the budgeted column. Does not yet include the November 2025 amendment if any.",
    "schemaNotes": "Categories now reflect the City of Moncton's actual 10 administrative departments rather than PSAB-style functional classifications. Subitems are expense types (Wages, Contracts, Fiscal Cost, etc.) as published in the budget document — the document does not publish sub-function splits like 'RCMP vs Fire' in this format.",
    "categories": result_categories,
}

out = "C:/Users/aaron/Code/moncton-taxes/src/data/budget-2026.proposed.json"
with open(out, "w", encoding="utf-8") as f:
    json.dump(doc, f, indent=2, ensure_ascii=False)

print(f"Wrote {out}")
print(f"  Categories: {len(result_categories)}")
print(f"  2026 total: ${total_2026:,}")
print(f"  2025 total: ${total_2025:,}")
print(f"  Expected 2026 total per fin schedule: $222,471,717")
print(f"  Match: {total_2026 == 222_471_717}")

if warnings:
    print("\nWARNINGS:")
    for w in warnings:
        print(f"  - {w}")
