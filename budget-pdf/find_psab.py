"""Scan the budget PDF for any section that uses PSAB-style functional
classification (Protective Services / Transportation / Environmental Health
/ Environmental Development / Public Health / Recreation & Cultural / General
Government / Fiscal Services) — that's what the current JSON expects and what
audited NB municipal financial statements typically use.
"""
import pdfplumber, re

PDF = "C:/Users/aaron/Code/moncton-taxes/budget-pdf/2024_2026_budget.pdf"

# Hits we care about — co-occurring PSAB categories on a single page
psab_marker_pairs = [
    ("Protective Services", "Transportation Services"),
    ("Environmental Health", "Public Health"),
    ("Environmental Development", "Recreation"),
    ("Fiscal Services", "General Government"),
]

with pdfplumber.open(PDF) as pdf:
    print(f"Scanning {len(pdf.pages)} pages...")
    for i, page in enumerate(pdf.pages):
        text = page.extract_text() or ""
        hits = sum(1 for a, b in psab_marker_pairs if a in text and b in text)
        if hits >= 2:
            print(f"\n=== Page {i+1} (index {i}) — {hits} PSAB-pair hits ===")
            # Show first 60 lines so we can sanity-check
            for line in text.split("\n")[:60]:
                print("  " + line)
            print("  ...")
