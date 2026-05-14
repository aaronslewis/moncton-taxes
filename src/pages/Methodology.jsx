import budget from '../data/budget-2026.json';

export default function Methodology() {
  return (
    <>
      <header className="page-header">
        <div className="container">
          <h1>Methodology</h1>
          <p>
            How we calculate where your Moncton property tax dollars go &mdash; the data
            sources, the assumptions, and the caveats.
          </p>
        </div>
      </header>

      <section className="page-section">
        <div className="container" style={{ maxWidth: 760 }}>
          <h2>The short version</h2>
          <p>
            We take the City of Moncton's published operating budget for{' '}
            <strong>{budget.fiscalYear}</strong> (a total of{' '}
            <strong>${(budget.totalOperating / 1_000_000).toFixed(0)}M</strong>), break
            it into spending categories, and compute each category's share. When you
            enter the property tax you paid, we multiply your bill by each category's
            share to show how your specific dollars are allocated.
          </p>

          <h2 className="mt-8">Data source</h2>
          <p>
            All figures come from the{' '}
            <a href={budget.sourceUrl} target="_blank" rel="noopener noreferrer">
              {budget.sourceLabel}
            </a>{' '}
            published by the City of Moncton. The City publishes a triennial budget
            document covering three fiscal years; we use the {budget.fiscalYear} column.
          </p>
          <p>
            Categories on this site follow the City of Moncton's actual administrative
            departments as published in the budget document: Protective Services,
            Operations Services, Finance Services, Community Services, Codiac Transpo,
            Grants, Sustainable Growth &amp; Development Services, Corporate Services,
            Legal &amp; City Clerk Services, and Governance &amp; Corporate Management.
            Each department's subcategories are <em>expense types</em> (wages, contracts,
            fiscal cost, capital transfers, etc.) as the budget document publishes them
            — the document doesn't break each department down by sub-function
            (e.g. police vs fire), so neither do we.
          </p>
          <p>
            One subcategory worth flagging: under Protective Services, the line{' '}
            <em>&ldquo;Codiac Regional Policing Authority (RCMP)&rdquo;</em>{' '}
            (${(41120703 / 1_000_000).toFixed(1)}M in 2026) is the City's contribution
            to the tri-municipal policing authority that contracts the RCMP for Moncton,
            Dieppe, and Riverview. The budget document labels this line as
            &ldquo;CRPA&rdquo;; we've renamed it for clarity.
          </p>

          {budget.dataStatusNote && (
            <div className="notice notice-info mt-6">
              <p>
                <strong>Data status:</strong> {budget.dataStatusNote}
              </p>
            </div>
          )}

          <h2 className="mt-8">How property tax works in Moncton</h2>
          <p>
            Property tax in New Brunswick is billed and collected by{' '}
            <a href="https://www.gnb.ca/en/topic/family-home-community/housing-property/property-tax/how-property-tax-works.html"
               target="_blank" rel="noopener noreferrer">
              the provincial government
            </a>, which then remits the municipal portion to the City of Moncton in
            twelve monthly payments. The 2026 municipal residential rate is{' '}
            <strong>${budget.taxRatePer100.toFixed(4)} per $100 of assessed value</strong>.
          </p>
          <p>
            For <strong>owner-occupied primary residences</strong>, the provincial
            portion of the bill is zeroed out by the Residential Property Tax Credit on
            the first half-hectare. That means the entire amount you see on your bill is
            the municipal portion &mdash; a clean 1-to-1 input for this tool.
          </p>
          <p>
            <strong>Non-owner-occupied and non-residential properties</strong> also pay a
            provincial portion (currently $0.5617 per $100). That portion is{' '}
            <em>not</em> reflected in this breakdown. If your property is rented,
            commercial, or a secondary residence, only enter the municipal portion of
            your bill.
          </p>

          <h2 className="mt-8">What's <em>not</em> included</h2>
          <ul style={{ paddingLeft: '1.5rem', listStyle: 'disc' }}>
            <li>
              The City's separate <strong>water &amp; wastewater utility budget</strong>{' '}
              (~$47.8M in 2026) &mdash; funded by user fees, not property tax.
            </li>
            <li>
              The full <strong>capital budget</strong> (~$92M in 2026) &mdash; partly
              funded by debt and provincial/federal grants. What you do see here is the{' '}
              <em>Transfer to Capital Reserve</em> line, which is the portion of capital
              funded by operating (property-tax) dollars.
            </li>
            <li>
              Provincial taxes and credits, school taxes, federal taxes, or anything
              outside the City of Moncton's own operating budget.
            </li>
          </ul>

          <h2 className="mt-8">Updates &amp; corrections</h2>
          <p>
            We re-transcribe the budget table each time the City approves a new annual
            budget (typically November). The data on this site was last updated on{' '}
            <strong>{budget.lastUpdated}</strong>.
          </p>
          <p>
            Found an error? This site is open to corrections &mdash; see the{' '}
            <a href="/about">About</a> page for contact info.
          </p>
        </div>
      </section>
    </>
  );
}
