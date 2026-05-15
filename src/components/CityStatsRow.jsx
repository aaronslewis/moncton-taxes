const MONCTON_ID = 'moncton';

function formatTotal(city) {
  if (!city.totalOperating) return null;
  const amount = city.totalOperating;
  const currencySymbol = city.currency === 'CAD' || city.currency === 'USD' ? '$' : '';
  const suffix = city.currency && city.currency !== 'CAD' ? ` ${city.currency}` : '';
  const compact =
    amount >= 1_000_000_000
      ? `${(amount / 1_000_000_000).toFixed(1)}B`
      : amount >= 1_000_000
        ? `${(amount / 1_000_000).toFixed(0)}M`
        : `${(amount / 1_000).toFixed(0)}K`;
  return `${currencySymbol}${compact}${suffix}`;
}

function formatPop(n) {
  return n.toLocaleString('en-CA');
}

function effectiveRatePct(city) {
  if (city.taxRate == null || city.taxRateBase == null) return null;
  return (city.taxRate * 100) / city.taxRateBase;
}

function nativeRateLabel(city) {
  if (city.taxRate == null || city.taxRateBase == null) return null;
  return city.taxRateBase === 100
    ? `$${city.taxRate.toFixed(4)} per $100`
    : `${city.taxRate.toFixed(4)} mills (per $1,000)`;
}

function formatHomeValue(value) {
  if (!value) return null;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `~$${Math.round(value / 1000)}K`;
  return `$${value.toLocaleString('en-CA')}`;
}

function typicalBill(city) {
  const pct = effectiveRatePct(city);
  if (pct == null || !city.typicalHomeValue) return null;
  const amount = (city.typicalHomeValue * pct) / 100;
  // Round to nearest $50
  const rounded = Math.round(amount / 50) * 50;
  return `~$${rounded.toLocaleString('en-CA')}/yr`;
}

export default function CityStatsRow({ cities }) {
  const anyMetro = cities.some((c) => c.populationMetro);
  const usedLabels = [
    ...new Set(cities.map((c) => c.populationMetroLabel).filter(Boolean)),
  ];
  const anyPer100 = cities.some((c) => c.taxRateBase === 100);
  const anyPer1000 = cities.some((c) => c.taxRateBase === 1000);
  const anyHome = cities.some((c) => c.typicalHomeValue);

  return (
    <>
      <div className="city-stats-row">
        {cities.map((city) => {
          const region = city.province || city.country;
          const isMoncton = city.cityId === MONCTON_ID;
          const total = formatTotal(city);
          const ratePct = effectiveRatePct(city);
          const rateTooltip = nativeRateLabel(city);
          const home = formatHomeValue(city.typicalHomeValue);
          const bill = typicalBill(city);

          return (
            <article
              key={city.cityId}
              className={`city-stat-card${isMoncton ? ' city-stat-card-moncton' : ''}`}
            >
              <h3 className="city-stat-title">
                {city.displayName}
                {region && <span className="city-stat-region">, {region}</span>}
              </h3>
              <dl className="city-stat-list">
                <div className="city-stat-row">
                  <dt>Pop.</dt>
                  <dd className="tabular">
                    {formatPop(city.population)}
                    {city.populationMetro && (
                      <span className="city-stat-secondary">
                        {' · '}{city.populationMetroLabel || 'Metro'} {formatPop(city.populationMetro)}
                      </span>
                    )}
                  </dd>
                </div>
                <div className="city-stat-row">
                  <dt>Budget</dt>
                  <dd className="tabular">
                    {total}
                    <span className="city-stat-secondary"> · FY{city.fiscalYear}</span>
                  </dd>
                </div>
                {ratePct != null && (
                  <div
                    className="city-stat-row"
                    title={`Published as ${rateTooltip}${city.taxRateNote ? ' · ' + city.taxRateNote : ''}`}
                  >
                    <dt>Tax</dt>
                    <dd className="tabular">{ratePct.toFixed(2)}%</dd>
                  </div>
                )}
                {home && (
                  <div
                    className="city-stat-row"
                    title={city.typicalHomeValueNote || ''}
                  >
                    <dt>Typical</dt>
                    <dd className="tabular">
                      {home} home
                      {bill && (
                        <span className="city-stat-secondary"> · {bill}</span>
                      )}
                    </dd>
                  </div>
                )}
              </dl>
            </article>
          );
        })}
      </div>

      {(anyMetro || anyPer100 || anyPer1000 || anyHome) && (
        <details className="city-stats-legend">
          <summary>About these figures</summary>
          <div className="city-stats-legend-body">
            {anyMetro && (
              <p>
                <strong>{usedLabels.join(' and ')}</strong> ={' '}
                {usedLabels.includes('CMA') && 'Census Metropolitan Area'}
                {usedLabels.includes('CMA') && usedLabels.includes('CA') && ' / '}
                {usedLabels.includes('CA') && 'Census Agglomeration'}
                {' '}— Statistics Canada definitions for the broader urban region
                including surrounding municipalities and rural areas economically integrated
                with the core. CA is the smaller version used for cities below the CMA
                population threshold.
              </p>
            )}
            {(anyPer100 || anyPer1000) && (
              <p>
                <strong>Tax rate</strong> shown as effective % of assessed value (municipal
                portion only — provincial / education / regional levies are extra). New
                Brunswick publishes rates per&nbsp;$100 of assessment;
                {anyPer1000 && ' BC and AB publish mills (dollars per&nbsp;$1,000), which we’ve converted to a % for direct comparison'}
                . Hover the Tax row on any card to see the rate in the city’s native format.
              </p>
            )}
            {anyHome && (
              <p>
                <strong>Typical home / bill</strong> uses a representative assessed value
                for each city, multiplied by the effective municipal rate. These are
                indicative figures — same-home tax bills vary widely depending on assessment
                history, freeze protections (NB has a 2026 spike-protection freeze that
                excludes new buyers), and provincial/school levies that aren't in the
                municipal portion. Hover the Typical row to see each city's value note.
              </p>
            )}
          </div>
        </details>
      )}
    </>
  );
}
