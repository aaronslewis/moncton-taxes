"""Extract the General Operating Fund Financial Schedule (PDF page 41, index 40)
as a clean per-row table."""
import pdfplumber
import sys

PDF = "C:/Users/aaron/Code/moncton-taxes/budget-pdf/2024_2026_budget.pdf"

# PDF page index 40 has the actual financial schedule (page 7 was TOC).
with pdfplumber.open(PDF) as pdf:
    page = pdf.pages[40]
    print("=== RAW TEXT (page 41) ===")
    print(page.extract_text())
    print()
    print("=== TABLES (page 41) ===")
    tables = page.extract_tables()
    for t_idx, table in enumerate(tables):
        print(f"--- Table {t_idx+1} ({len(table)} rows x {len(table[0]) if table else 0} cols) ---")
        for row in table:
            print(row)
        print()

    # Also dump the next 2 pages (Utility schedule, Expenditures by Type)
    for offset, label in [(1, "Utility Operating Fund Schedule"), (2, "Expenditures by Type")]:
        print(f"\n\n========== PAGE {41 + offset} ({label}) ==========")
        p = pdf.pages[40 + offset]
        print("--- TEXT ---")
        print(p.extract_text())
        print("--- TABLES ---")
        for t_idx, table in enumerate(p.extract_tables()):
            print(f"--- Table {t_idx+1} ({len(table)} rows) ---")
            for row in table:
                print(row)
            print()
