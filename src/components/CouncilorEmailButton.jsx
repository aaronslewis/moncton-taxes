import councilors from '../data/councilors.json';

function buildMailto({ email, categoryName }) {
  const subject = categoryName
    ? `Moncton budget — ${categoryName}`
    : 'Moncton budget feedback';
  const body =
    `Hello,\n\n` +
    (categoryName
      ? `I was looking at the City of Moncton's spending on ${categoryName} and wanted to share some thoughts:\n\n[your message here]\n\n`
      : `I was looking at the City of Moncton's budget and wanted to share some thoughts:\n\n[your message here]\n\n`) +
    `Source: monctontaxes.ca\n\n` +
    `Thank you,\n[your name]\n`;

  return `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export default function CouncilorEmailButton({ categoryName }) {
  const entries = councilors.councilors || [];
  if (entries.length === 0) return null;

  return (
    <details className="councilor-email">
      <summary className="btn btn-outline councilor-email-summary">
        Email your councilor about this
      </summary>
      <div className="councilor-email-panel">
        <p className="text-sm text-muted councilor-email-note">
          The site doesn't send the email — your mail app opens with a draft you
          can edit and send yourself. These are the publicly listed email addresses
          for Moncton City Council.
        </p>
        <ul className="councilor-email-list">
          {entries.map((c) => (
            <li key={c.email}>
              <a
                className="councilor-email-link"
                href={buildMailto({ email: c.email, categoryName })}
              >
                <span className="councilor-name">{c.name}</span>
                <span className="councilor-role text-sm text-muted">
                  {c.role || (c.ward ? `Ward ${c.ward}` : '')}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </details>
  );
}
