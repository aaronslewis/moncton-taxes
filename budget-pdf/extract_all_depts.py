"""For each department, find the page whose TOTAL EXPENSES line ends in the
expected 2026 dollar amount. (Without requiring the dept name in first 5
lines — the original heuristic was too strict.)
"""
import pdfplumber, re

PDF = "C:/Users/aaron/Code/moncton-taxes/budget-pdf/2024_2026_budget.pdf"

EXPECTED_2026 = {
    "GRANTS":                                 8_953_571,
    "GOVERNANCE AND CORPORATE MANAGEMENT":    1_332_291,
    "CORPORATE SERVICES":                     8_630_571,
    "LEGAL AND CITY CLERK SERVICES":          1_431_872,
    "FINANCE SERVICES":                      40_905_837,
    "OPERATIONS SERVICES":                   44_557_995,
    "CODIAC TRANSPO":                        15_927_808,
    "SUSTAINABLE GROWTH AND DEVELOPMENT SERVICES": 8_761_044,
    "PROTECTIVE SERVICES":                   71_156_443,
    "COMMUNITY SERVICES":                    20_814_285,
}

# Phase 1: find every page where a TOTAL EXPENSES line ends in one of the expected amounts
candidates = {dept: [] for dept in EXPECTED_2026}
with pdfplumber.open(PDF) as pdf:
    for i, page in enumerate(pdf.pages):
        text = page.extract_text() or ""
        for line in text.split("\n"):
            if "TOTAL EXPENSES" not in line:
                continue
            # Look at the last number on the line
            for dept, amount in EXPECTED_2026.items():
                fmt = f"{amount:,}"
                if line.rstrip().endswith(fmt) or f" {fmt} " in line:
                    # Make sure dept name appears somewhere on the page
                    if dept in text:
                        candidates[dept].append(i)

print("Candidate pages per dept:")
for dept, pages in candidates.items():
    print(f"  {dept}: {[p+1 for p in pages]}")

# Phase 2: pick the FIRST candidate per dept and dump its text
print("\n\n=== FULL TEXT FOR EACH DEPT SUMMARY PAGE ===")
with pdfplumber.open(PDF) as pdf:
    for dept, pages in candidates.items():
        if not pages:
            print(f"\n\n##### {dept}: NO PAGE FOUND with TOTAL EXPENSES = ${EXPECTED_2026[dept]:,} #####")
            continue
        pg = pages[0]
        print(f"\n\n##### {dept} — PDF page {pg+1} #####")
        print(pdf.pages[pg].extract_text())
