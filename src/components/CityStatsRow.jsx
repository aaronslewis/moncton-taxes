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

export default function CityStatsRow({ cities }) {
  return (
    <div className="city-stats-row">
      {cities.map((city) => {
        const region = city.province || city.country;
        const isMoncton = city.cityId === MONCTON_ID;
        const total = formatTotal(city);

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
            </dl>
          </article>
        );
      })}
    </div>
  );
}
