const STATUS_BADGES = {
  'transcribed-official':    { label: 'Transcribed from official budget', tone: 'green' },
  'transcribed-2024-2026-budget': { label: 'Transcribed from official budget', tone: 'green' },
  'partial-transcription':   { label: 'Verified total · partial breakdown', tone: 'amber' },
  'provisional':             { label: 'Provisional',  tone: 'amber' },
  'summary-only':            { label: 'Summary only', tone: 'amber' },
  'placeholder':             { label: 'Placeholder',  tone: 'red'   },
};

function StatusBadge({ status }) {
  const badge = STATUS_BADGES[status] || { label: status || 'Unknown', tone: 'amber' };
  return <span className={`provenance-badge provenance-badge-${badge.tone}`}>{badge.label}</span>;
}

export default function CityProvenanceCard({ city }) {
  return (
    <article className="provenance-card">
      <div className="provenance-card-header">
        <h3 className="provenance-card-title">
          {city.displayName}
          {city.province && <span className="provenance-card-region">, {city.province}</span>}
          {!city.province && city.country && <span className="provenance-card-region">, {city.country}</span>}
        </h3>
        <StatusBadge status={city.dataStatus} />
      </div>
      <p className="provenance-card-meta tabular">
        Fiscal year {city.fiscalYear} · pop. {city.population?.toLocaleString('en-CA')}
        {city.currency && city.currency !== 'CAD' && <> · {city.currency}</>}
      </p>
      {city.dataStatusNote && (
        <p className="provenance-card-note">{city.dataStatusNote}</p>
      )}
      {city.sourceUrl && (
        <p className="provenance-card-source">
          Source:{' '}
          <a href={city.sourceUrl} target="_blank" rel="noopener noreferrer">
            {city.sourceLabel || city.sourceUrl}
          </a>
        </p>
      )}
    </article>
  );
}
