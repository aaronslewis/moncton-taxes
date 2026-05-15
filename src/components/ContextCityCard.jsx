const CATEGORY_CHIPS = {
  'different-policing': { label: 'Different policing model', tone: 'blue' },
  'different-scope':    { label: 'Different fiscal scope',   tone: 'purple' },
  'data-not-available': { label: 'Detailed breakdown unavailable', tone: 'grey' },
};

function CategoryChip({ category }) {
  const chip = CATEGORY_CHIPS[category];
  if (!chip) return null;
  return <span className={`context-chip context-chip-${chip.tone}`}>{chip.label}</span>;
}

function formatTotal(city) {
  if (!city.totalOperating) return null;
  const amount = city.totalOperating;
  const compact =
    amount >= 1_000_000_000
      ? `${(amount / 1_000_000_000).toFixed(1)}B`
      : amount >= 1_000_000
        ? `${(amount / 1_000_000).toFixed(0)}M`
        : `${(amount / 1_000).toFixed(0)}K`;
  return `${compact} ${city.currency || 'CAD'}`;
}

export default function ContextCityCard({ city }) {
  const region = city.province || city.country;
  const total = formatTotal(city);

  return (
    <article className="context-card">
      <div className="context-card-header">
        <h3 className="context-card-title">
          {city.displayName}
          {region && <span className="context-card-region">, {region}</span>}
        </h3>
        <CategoryChip category={city.contextCategory} />
      </div>
      <p className="context-card-meta tabular">
        Pop. {city.population?.toLocaleString('en-CA')}
        {city.fiscalYear && <> · FY{city.fiscalYear}</>}
        {total && <> · {total} total</>}
      </p>
      {city.contextNote && (
        <p className="context-card-note">{city.contextNote}</p>
      )}
      {city.sourceUrl && (
        <p className="context-card-source">
          <a href={city.sourceUrl} target="_blank" rel="noopener noreferrer">
            View source →
          </a>
        </p>
      )}
    </article>
  );
}
