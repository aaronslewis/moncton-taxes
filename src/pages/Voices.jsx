import voices from '../data/voices.json';
import FeedbackPrompts from '../components/FeedbackPrompts.jsx';

function formatWeekOf(iso) {
  try {
    const d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return iso;
  }
}

export default function Voices() {
  const weeks = Array.isArray(voices.weeks) ? voices.weeks : [];
  const hasThemes = weeks.length > 0;

  return (
    <>
      <header className="page-header">
        <div className="container">
          <h1>Voices</h1>
          <p>
            What Moncton residents are saying about their city's budget — summarized
            weekly from anonymous submissions.
          </p>
        </div>
      </header>

      <section className="page-section">
        <div className="container" style={{ maxWidth: 820 }}>
          <p className="text-muted">
            Individual submissions are never published. Each week, common themes
            across submissions are summarized here so anyone — including councillors —
            can see what residents are paying attention to. This is the public output
            of the feedback forms on the <a href="/">home page</a> and on each
            category card.
          </p>

          {hasThemes ? (
            <div className="voices-weeks mt-8">
              {weeks.map((week) => (
                <section key={week.weekOf} className="voices-week">
                  <h2 className="voices-week-heading">
                    Week of {formatWeekOf(week.weekOf)}
                  </h2>
                  <ul className="voices-theme-list">
                    {(week.themes || []).map((t, i) => (
                      <li key={i} className="voices-theme">
                        {t.category && (
                          <p className="voices-theme-eyebrow">{t.category}</p>
                        )}
                        <p className="voices-theme-body">{t.theme}</p>
                        {Number.isFinite(t.sampleSize) && (
                          <p className="text-sm text-muted">
                            Drawn from {t.sampleSize} submission{t.sampleSize === 1 ? '' : 's'}.
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          ) : (
            <div className="notice notice-info mt-8">
              <p>
                <strong>Nothing published yet.</strong> Themes will appear here once
                enough residents have weighed in to summarize honestly. The feedback
                forms are open now — share your perspective on the{' '}
                <a href="/">home page</a> or on any category card.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="page-section page-section-tinted">
        <div className="container" style={{ maxWidth: 760 }}>
          <div className="section-heading">
            <h2>Add your voice</h2>
            <div className="section-divider" />
          </div>
          <FeedbackPrompts variant="big-picture" />
        </div>
      </section>
    </>
  );
}
