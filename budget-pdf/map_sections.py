"""Identify each section in the 'Detailed City Budgets by Service Areas' part
of the document (~ pages 446-510) by looking at the first non-header text line
on each page."""
import pdfplumber

PDF = "C:/Users/aaron/Code/moncton-taxes/budget-pdf/2024_2026_budget.pdf"

with pdfplumber.open(PDF) as pdf:
    for i in range(440, 510):
        text = pdf.pages[i].extract_text() or ""
        lines = [ln.strip() for ln in text.split("\n") if ln.strip()]
        # Strip the running header
        relevant_lines = [ln for ln in lines if ln != "Detailed City Budgets by Service Areas"]
        # Find the TOTAL EXPENSES line (the 2026 figure is last)
        total_line = next((ln for ln in lines if "TOTAL EXPENSES" in ln), None)
        first_relevant = relevant_lines[0] if relevant_lines else "(blank)"
        print(f"Page {i+1:4d}  | first: {first_relevant[:50]:<50} | total: {total_line[:80] if total_line else '-'}")
