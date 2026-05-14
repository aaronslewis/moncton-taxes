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
            Categories follow the standard <abbr title="Public Sector Accounting Board">PSAB</abbr>{' '}
            municipal expense classifications used in Moncton's budget book: Protective
            Services, Transportation, Recreation &amp; Cultural, General Government,
            Environmental Health, Environmental Development, Public Health, and Fiscal
            Services. We've separated Fiscal Services into <em>Debt Servicing</em> and{' '}
            <em>Transfer to Capital Reserve</em> so you can see the difference between
            paying off past borrowing and funding future infrastructure.
          </p>

          {budget.dataStatus === 'placeholder' && (
            <div className="notice notice-info mt-6">
              <p>
                <strong>Current data status: placeholder.</strong> {budget.dataStatusNote}
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
