"""Peek at the Protective Services and Operations Services sections to see
what sub-line-item data is available per department.
"""
import pdfplumber

PDF = "C:/Users/aaron/Code/moncton-taxes/budget-pdf/2024_2026_budget.pdf"

# Find the page where each department's detail section starts.
# These are the major all-caps section markers near the start of each dept block.
markers = [
    "PROTECTIVE SERVICES",
    "OPERATIONS SERVICES",
    "COMMUNITY SERVICES",
    "SUSTAINABLE GROWTH",
    "CODIAC TRANSPO",
    "FINANCE SERVICES",
]

with pdfplumber.open(PDF) as pdf:
    for marker in markers:
        first_full_page = None
        for i, page in enumerate(pdf.pages):
            text = page.extract_text() or ""
            # Heuristic: the section title appears as the first non-empty line
            lines = [ln.strip() for ln in text.split("\n") if ln.strip()]
            if lines and lines[0] == marker:
                first_full_page = i
                break
        if first_full_page is not None:
            print(f"\n\n========== {marker} starts at page index {first_full_page} (page #{first_full_page+1}) ==========")
            # Dump first page text only (the department summary page)
            with pdfplumber.open(PDF) as p2:
                txt = p2.pages[first_full_page].extract_text() or ""
                print(txt[:3000])
        else:
            print(f"\n{marker}: NOT FOUND as standalone title page")
