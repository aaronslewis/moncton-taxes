import { useMemo, useState } from 'react';
import TaxInput from '../components/TaxInput.jsx';
import BreakdownList from '../components/BreakdownList.jsx';
import ObservationsGrid from '../components/ObservationsGrid.jsx';
import { computeBreakdown } from '../lib/breakdown.js';
import budget from '../data/budget-2026.json';

export default function Home() {
  const [taxPaid, setTaxPaid] = useState(0);

  const categories = useMemo(
    () => computeBreakdown(taxPaid, budget),
    [taxPaid]
  );

  const hasInput = taxPaid > 0;
  const showBanner = !!budget.bannerNote;

  return (
    <>
      <header className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>
              Where do <span className="accent">my Moncton taxes</span> go?
            </h1>
            <p className="hero-body">
              Enter the property tax you paid the City of Moncton, and see exactly how it
              was split across police, fire, roads, parks, debt, and everything else in
              the {budget.fiscalYear} operating budget.
            </p>
          </div>
        </div>
      </header>

      <div className="container">
        <TaxInput value={taxPaid} onChange={setTaxPaid} />
      </div>

      <section className="page-section">
        <div className="container">
          {showBanner && (
            <div className="notice notice-info mb-6">
              <p>
                <strong>Heads up:</strong> {budget.bannerNote}{' '}
                See <a href="/methodology">Methodology</a> for details.
              </p>
            </div>
          )}

          <div className="section-heading">
            <h2>{hasInput ? 'Your breakdown' : `The ${budget.fiscalYear} operating budget`}</h2>
            <div className="section-divider" />
          </div>

          <BreakdownList
            categories={categories}
            taxPaid={taxPaid}
            fiscalYear={budget.fiscalYear}
          />

          <p className="text-muted text-sm mt-6">
            Source: <a href={budget.sourceUrl} target="_blank" rel="noopener noreferrer">{budget.sourceLabel}</a>.
            Owner-occupied residential bills only — non-owner-occupied and non-residential
            properties also pay a provincial portion not covered here. Tap any category to
            see its line-item subcategories.
          </p>
        </div>
      </section>

      <section className="page-section page-section-tinted">
        <div className="container">
          <div className="section-heading">
            <h2>What stands out</h2>
            <div className="section-divider" />
          </div>
          <p className="section-lede">
            A few patterns worth noticing in the {budget.fiscalYear} numbers — pulled
            directly from the budget data above.
          </p>
          <ObservationsGrid dataset={budget} />
        </div>
      </section>
    </>
  );
}
