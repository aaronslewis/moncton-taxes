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

function formatTaxRate(city) {
  if (city.taxRate == null || city.taxRateBase == null) return null;
  const effectivePct = (city.taxRate * 100) / city.taxRateBase;
  const native =
    city.taxRateBase === 100
      ? `$${city.taxRate.toFixed(4)}/$100`
      : `${city.taxRate.toFixed(4)} mills`;
  return { effective: `${effectivePct.toFixed(2)}%`, native };
}

export default function CityStatsRow({ cities }) {
  const anyMetro = cities.some((c) => c.populationMetro);
  const usedLabels = [
    ...new Set(cities.map((c) => c.populationMetroLabel).filter(Boolean)),
  ];
  const anyPer100 = cities.some((c) => c.taxRateBase === 100);
  const anyPer1000 = cities.some((c) => c.taxRateBase === 1000);

  return (
    <>
      <div className="city-stats-row">
        {cities.map((city) => {
          const region = city.province || city.country;
          const isMoncton = city.cityId === MONCTON_ID;
          const total = formatTotal(city);
          const rate = formatTaxRate(city);

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
                {rate && (
                  <div className="city-stat-row" title={city.taxRateNote || ''}>
                    <dt>Tax</dt>
                    <dd className="tabular">
                      {rate.effective}
                      <span className="city-stat-secondary"> · {rate.native}</span>
                    </dd>
                  </div>
                )}
              </dl>
            </article>
          );
        })}
      </div>
      {(anyMetro || anyPer100 || anyPer1000) && (
        <p className="city-stats-legend text-muted text-sm">
          {anyMetro && (
            <>
              <strong>{usedLabels.join(' / ')}</strong> ={' '}
              {usedLabels.includes('CMA') && 'Census Metropolitan Area'}
              {usedLabels.includes('CMA') && usedLabels.includes('CA') && ' · '}
              {usedLabels.includes('CA') && 'Census Agglomeration (Statistics Canada definitions for the broader city region)'}
              {!usedLabels.includes('CA') && usedLabels.includes('CMA') && ' (Statistics Canada’s definition of the broader city region)'}
              .
            </>
          )}
          {anyMetro && (anyPer100 || anyPer1000) && ' '}
          {(anyPer100 || anyPer1000) && (
            <>
              Tax rates show effective % of assessed value, with each province’s native
              format alongside: NB publishes rates per&nbsp;$100;{' '}
              {anyPer1000 && 'BC and AB publish mills (dollars per&nbsp;$1,000)'}.
              Municipal portion only — provincial / education levies are extra.
            </>
          )}
        </p>
      )}
    </>
  );
}
