# Facts extracted from 2024-2026 Moncton Budget Document (Final)

Source: `https://www5.moncton.ca/docs/councilmeetings/2023/2024_2026%20Budget_Document_Final.pdf`
Extracted: 2026-05-14

## General Operating Fund Financial Schedule (PDF page 41, printed p. 39)

10 administrative departments. Total balances exactly: $222,471,717 for 2026.

| # | Department | 2024 Budget | 2025 Budget | **2026 Budget** | YoY 2025→26 |
|---|---|---:|---:|---:|---:|
| 01 | Grants | $8,922,229 | $9,137,622 | **$8,953,571** | −2.0% |
| 02 | Governance and Corporate Management | $1,353,814 | $1,307,165 | **$1,332,291** | +1.9% |
| 03 | Corporate Services | $7,964,702 | $8,268,327 | **$8,630,571** | +4.4% |
| 04 | Legal and City Clerk Services | $1,365,260 | $1,395,002 | **$1,431,872** | +2.6% |
| 05 | Finance Services | $41,482,112 | $42,133,409 | **$40,905,837** | −2.9% |
| 06 | Operations Services | $44,277,246 | $44,035,203 | **$44,557,995** | +1.2% |
| 07 | Codiac Transpo | $15,178,455 | $15,833,385 | **$15,927,808** | +0.6% |
| 08 | Sustainable Growth and Development Services | $9,419,037 | $9,827,723 | **$8,761,044** | −10.9% |
| 09 | Protective Services | $61,652,243 | $64,493,389 | **$71,156,443** | +10.3% |
| 10 | Community Services | $20,387,977 | $20,553,579 | **$20,814,285** | +1.3% |
| | **Total General Fund Operating** | **$212,003,075** | **$216,984,804** | **$222,471,717** | **+2.5%** |

Separate fund (NOT in the above, not property-tax-funded — billed via user fees):
- Utility Operating Fund (Water/Wastewater) 2026: **$45,857,987**
- Combined operating expenditure 2026: **$268,329,704**

## 3-Year Expenditures by Type (PDF page 43, printed p. 41)

This is the General Fund + Utility Fund combined, broken down by *type of expense* rather than by department. 2026 column:

| Expense Type | 2026 (Gen+Util combined) |
|---|---:|
| Wages & Benefits | $75,320,120 |
| CRPA *(unidentified acronym — `Capital Reserve` or `pension` related?)* | $41,120,703 |
| Fiscal Cost *(= debt servicing — both interest AND principal)* | $36,125,715 |
| Contracts | $31,047,619 |
| Capital from Operating *(= transfer to capital reserve)* | $17,215,697 |
| Supplies & Materials | $13,059,892 |
| Deposit to Reserves | $10,278,466 |
| Grants | $9,126,561 |
| Maintenance & Repairs | $7,244,402 |
| Utilities | $6,652,028 |
| Water Costs | $4,574,134 |
| Promotional | $3,995,530 |
| Insurance & Property Taxes | $3,362,337 |
| Professional Services – Assessment Costs | $2,833,133 |
| Professional Services – Other | $1,786,106 |
| Professional Development | $1,365,671 |
| Contingencies | $1,354,142 |
| Equipment | $1,041,091 |
| Wages Overtime | $917,428 |
| Communication | $773,900 |
| Automation Plan | $137,916 |
| Transfers/Recoveries | ($1,002,887) |
| **TOTAL** | **$268,329,704** |

The 2024-2026 budget document confirms (p. 29): "Fiscal Costs: For budgeting purposes, both principal and interest costs are included as operating expenditures." So debt servicing IS in this number.

## What the budget book DOES NOT have

- **No PSAB-style functional classification.** A scan of all 544 pages found zero pages with two-or-more PSAB-category pairs (Protective/Transportation, Environmental Health/Public Health, etc.) co-occurring. The City of Moncton's budget document exclusively uses its 10 administrative departments.
- **No 2026 tax-rate figure.** The budget document only quotes the 2024 rate ($1.4287 per $100). 2026's rate would be set annually at a separate Council session, likely the November 2025 budget update the user mentioned.
- **No per-department sub-function breakdown.** Each department's pages break down by expense TYPE (Wages, Contracts, Fiscal Cost, etc.), not by sub-function (Roads, Snow, Sidewalks). You can't extract "Codiac RCMP vs Fire vs Bylaw" from the budget book at this level — that would need separate sourcing (Codiac RCMP has its own contract; Fire is a City department, etc.).

## Implications for `src/data/budget-2026.json`

The current placeholder JSON is wrong in three structural ways:

1. **Total is overstated by $13.5M.** Placeholder says $236M; actual General Fund 2026 is $222.47M.
2. **The 9 PSAB-style categories don't exist in the source document.** They were either invented by the previous Claude or extrapolated from a different (audited?) document.
3. **The "subItems" line items (Codiac RCMP $43.9M, Fire $25.6M, etc.) are not transcribed from the budget book.** The budget book groups all of Protective Services together at the top level ($71.16M) and breaks it down by expense type below.

## Next-decision options

The user needs to pick one of these before this can land safely:

- **Option A** — Restructure to faithful 10-department City structure, expense-type subcategories. Most accurate. Requires a UI rethink (10 categories instead of 9, different naming, no clean "police vs fire" split).
- **Option B** — Find the City's most recent audited financial statements (Schedule 3 / functional classification per PSAB) and use THOSE numbers + categories. Different document; would publish prior-year *actual* results rather than *budgeted* 2026 forecast.
- **Option C** — Keep current 9-category UI; manually map the City's 10 departments to 9 PSAB categories using a best-effort allocation. Some splits (esp. Environmental Health / Environmental Development) would have to come from external sources, and the mapping itself is a judgment call that introduces error.

Personal recommendation: **Option A** — fidelity to the published source matters more than UI consistency for a civic-transparency project, and the 10 City departments aren't that different from the current 9 PSAB ones (Protective, Codiac Transpo, Community = Recreation, Operations = Transportation, etc. all line up).
