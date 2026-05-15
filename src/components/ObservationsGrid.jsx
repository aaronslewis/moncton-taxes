import { computeObservations } from '../lib/observations.js';

export default function ObservationsGrid({ observations, dataset }) {
  const items = observations ?? (dataset ? computeObservations(dataset) : []);

  return (
    <div className="observations-grid">
      {items.map((o) => (
        <article key={o.id} className="observation-card">
          <p className="observation-eyebrow">{o.title}</p>
          <h3 className="observation-headline">{o.headline}</h3>
          <p className="observation-body">{o.body}</p>
        </article>
      ))}
    </div>
  );
}
