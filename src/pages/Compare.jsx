import { useMemo } from 'react';
import ComparisonMatrix from '../components/ComparisonMatrix.jsx';
import CityProvenanceCard from '../components/CityProvenanceCard.jsx';
import ContextCityCard from '../components/ContextCityCard.jsx';
import { CITIES } from '../data/cities/index.js';
import { buildComparisonMatrix } from '../lib/comparison.js';

export default function Compare() {
  const visibleCities = useMemo(
    () => CITIES.filter((c) => c.dataStatus !== 'placeholder' && !c.hidden),
    []
  );
  const contextCities = useMemo(
    () => CITIES.filter((c) => c.dataStatus === 'placeholder' || c.hidden),
    []
  );
  const { rows } = useMemo(() => buildComparisonMatrix(visibleCities), [visibleCities]);
  const normalizedCities = visibleCities.filter((c) => c.normalization?.applied);

  return (
    <>
      <header className="page-header">
        <div className="container">
          <h1>How does <span className="accent">Moncton compare?</span></h1>
          <p>
            Every municipality publishes its budget a little differently. Below, Moncton
            sits next to {visibleCities.length - 1} peer{visibleCities.length - 1 === 1 ? '' : 's'}{' '}
            — each city's spending rolled up into eight shared categories so the
            percentages line up.
          </p>
        </div>
      </header>

      <section className="page-section">
        <div className="container">
          <div className="notice notice-info mb-6">
            <p>
              <strong>How to read this:</strong> each cell shows what share of a city's
              operating budget goes to that category — a <em>fraction</em>, not absolute
              dollars. That sidesteps currency and city-size differences.
              {normalizedCities.length > 0 && (
                <> {normalizedCities.map((c) => c.displayName).join(' and ')}{' '}
                  fund{normalizedCities.length === 1 ? 's' : ''} services Canadian
                  municipalities don't (e.g. K-12 schools, eldercare, or consolidated
                  parish/utility functions); those non-comparable pieces are excluded so
                  the shares reflect the Canadian-comparable subset. See each city's
                  source card for the exclusion list.</>
              )}
              {' '}See the per-bucket detail and <a href="/methodology">Methodology</a> for the
              full mapping.
            </p>
          </div>

          <div className="section-heading">
            <h2>Side-by-side</h2>
            <div className="section-divider" />
          </div>
          <p className="section-lede">
            Tap a category row to see which native departments rolled up into it for each
            city.
          </p>

          <ComparisonMatrix cities={visibleCities} rows={rows} />
        </div>
      </section>

      <section className="page-section page-section-tinted">
        <div className="container">
          <div className="section-heading">
            <h2>Where the numbers come from</h2>
            <div className="section-divider" />
          </div>
          <p className="section-lede">
            Each city's data is transcribed from its published budget. Source links and
            data-status badges are below — if any city looks off, the source link will
            take you straight to the official document.
          </p>

          <div className="provenance-grid">
            {visibleCities.map((city) => (
              <CityProvenanceCard key={city.cityId} city={city} />
            ))}
          </div>
        </div>
      </section>

      {contextCities.length > 0 && (
        <section className="page-section">
          <div className="container">
            <div className="section-heading">
              <h2>Cities we looked at but couldn't directly compare</h2>
              <div className="section-divider" />
            </div>
            <p className="section-lede">
              These are worth knowing about even though they don't fit cleanly into the
              percentage comparison above — either their municipal scope is structurally
              different (e.g. policing handled at a higher level of government), or their
              detailed budget breakdowns aren't publicly accessible.
            </p>

            <div className="context-grid">
              {contextCities.map((city) => (
                <ContextCityCard key={city.cityId} city={city} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
