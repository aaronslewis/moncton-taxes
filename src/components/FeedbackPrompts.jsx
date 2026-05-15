import { useState } from 'react';

const FORM_NAME_CATEGORY = 'category-feedback';
const FORM_NAME_BIG_PICTURE = 'big-picture-feedback';

function encode(data) {
  return Object.keys(data)
    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(data[k] ?? ''))
    .join('&');
}

export default function FeedbackPrompts({ variant, categoryId, categoryName }) {
  const isCategory = variant === 'category';
  const formName = isCategory ? FORM_NAME_CATEGORY : FORM_NAME_BIG_PICTURE;

  const [surprised, setSurprised] = useState('');
  const [direction, setDirection] = useState('');
  const [why, setWhy] = useState('');
  const [bigPicture, setBigPicture] = useState('');
  const [botField, setBotField] = useState('');
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (botField) {
      // Honeypot tripped — silently "succeed" so bots don't learn.
      setStatus('success');
      return;
    }

    setStatus('submitting');
    setErrorMsg('');

    const payload = isCategory
      ? {
          'form-name': formName,
          'bot-field': '',
          category: categoryName || categoryId || '',
          categoryId: categoryId || '',
          surprised,
          direction,
          why,
        }
      : {
          'form-name': formName,
          'bot-field': '',
          bigPicture,
        };

    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message || 'Submission failed');
    }
  }

  if (status === 'success') {
    return (
      <div className="feedback-success" role="status">
        <strong>Thanks — submission received.</strong>
        <p className="text-sm text-muted">
          We publish a regular summary of what we hear on the{' '}
          <a href="/voices">Voices</a> page. Individual messages are never published.
        </p>
      </div>
    );
  }

  return (
    <form
      className="feedback-form"
      name={formName}
      method="POST"
      data-netlify="true"
      data-netlify-honeypot="bot-field"
      onSubmit={handleSubmit}
      noValidate
    >
      <input type="hidden" name="form-name" value={formName} />
      <p style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true">
        <label>
          Don't fill this out if you're human:{' '}
          <input
            name="bot-field"
            value={botField}
            onChange={(e) => setBotField(e.target.value)}
            tabIndex="-1"
            autoComplete="off"
          />
        </label>
      </p>

      {isCategory ? (
        <>
          <input type="hidden" name="category" value={categoryName || ''} />
          <input type="hidden" name="categoryId" value={categoryId || ''} />

          <div className="form-group">
            <label className="form-label" htmlFor={`surprised-${categoryId}`}>
              What surprised you about this category?
            </label>
            <textarea
              id={`surprised-${categoryId}`}
              name="surprised"
              className="form-input"
              rows={2}
              maxLength={1000}
              value={surprised}
              onChange={(e) => setSurprised(e.target.value)}
              placeholder="Optional — a sentence or two."
            />
          </div>

          <fieldset className="form-group feedback-radio-group">
            <legend className="form-label">Would you spend more, less, or the same here?</legend>
            <div className="feedback-radio-row">
              {[
                ['more', 'More'],
                ['same', 'Same'],
                ['less', 'Less'],
                ['not-sure', 'Not sure'],
              ].map(([value, label]) => (
                <label key={value} className="feedback-radio">
                  <input
                    type="radio"
                    name="direction"
                    value={value}
                    checked={direction === value}
                    onChange={(e) => setDirection(e.target.value)}
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="form-group">
            <label className="form-label" htmlFor={`why-${categoryId}`}>
              Why?
            </label>
            <textarea
              id={`why-${categoryId}`}
              name="why"
              className="form-input"
              rows={2}
              maxLength={1000}
              value={why}
              onChange={(e) => setWhy(e.target.value)}
              placeholder="Optional — what's driving your view."
            />
          </div>
        </>
      ) : (
        <div className="form-group">
          <label className="sr-only" htmlFor="big-picture-input">
            What is one thing you would change about the municipal budget?
          </label>
          <textarea
            id="big-picture-input"
            name="bigPicture"
            className="form-input"
            rows={3}
            maxLength={1500}
            value={bigPicture}
            onChange={(e) => setBigPicture(e.target.value)}
            placeholder="One sentence is fine."
            required
          />
        </div>
      )}

      <p className="feedback-privacy text-sm text-muted">
        Submissions are anonymous. We publish a regular summary of what we hear
        on the <a href="/voices">Voices</a> page — individual messages are never
        published.
      </p>

      {status === 'error' && (
        <p className="feedback-error text-sm" role="alert">
          Couldn't submit ({errorMsg}). Please try again in a moment.
        </p>
      )}

      <div className="feedback-actions">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={status === 'submitting'}
        >
          {status === 'submitting' ? 'Sending…' : 'Share feedback'}
        </button>
      </div>
    </form>
  );
}
