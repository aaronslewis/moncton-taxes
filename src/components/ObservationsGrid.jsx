import { computeObservations } from '../lib/observations.js';

export default function ObservationsGrid({ dataset }) {
  const observations = computeObservations(dataset);

  return (
    <div className="observations-grid">
      {observations.map((o) => (
        <article key={o.id} className="observation-card">
          <p className="observation-eyebrow">{o.title}</p>
          <h3 className="observation-headline">{o.headline}</h3>
          <p className="observation-body">{o.body}</p>
        </article>
      ))}
    </div>
  );
}
