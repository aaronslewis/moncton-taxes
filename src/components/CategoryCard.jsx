import { useState } from 'react';
import { formatCurrency, formatPercent } from '../lib/breakdown.js';
import FeedbackPrompts from './FeedbackPrompts.jsx';
import CouncilorEmailButton from './CouncilorEmailButton.jsx';

function YoYBadge({ yoyPct }) {
  if (!Number.isFinite(yoyPct) || Math.abs(yoyPct) < 0.001) {
    return <span className="yoy yoy-flat">No change vs prior year</span>;
  }
  const up = yoyPct > 0;
  const label = `${up ? '▲' : '▼'} ${up ? '+' : '−'}${Math.abs(yoyPct * 100).toFixed(1)}% vs prior year`;
  return <span className={`yoy ${up ? 'yoy-up' : 'yoy-down'}`}>{label}</span>;
}

export default function CategoryCard({ category, taxPaid }) {
  const [expanded, setExpanded] = useState(false);
  const hasUserAmount = taxPaid > 0;
  const dollars = hasUserAmount ? category.userAmount : category.amount;
  const decimals = hasUserAmount ? 2 : 0;

  return (
    <article
      className={`category-card${expanded ? ' expanded' : ''}`}
      style={{ '--cat-color': category.color }}
    >
      <button
        type="button"
        className="category-card-header"
        onClick={() => setExpanded(prev => !prev)}
        aria-expanded={expanded}
        aria-controls={`subitems-${category.id}`}
      >
        <div className="category-card-body">
          <h3 className="category-name">{category.name}</h3>
          <p className="category-description">{category.description}</p>
        </div>
        <div className="category-amount">
          <div className="category-amount-dollars tabular">
            {formatCurrency(dollars, { decimals })}
          </div>
          <div className="category-amount-pct tabular">
            {formatPercent(category.share)}
          </div>
        </div>
        <svg className="expand-chevron" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M5 7.5l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="category-bar" aria-hidden="true">
        <div className="category-bar-fill" style={{ width: `${(category.share * 100).toFixed(2)}%` }} />
      </div>

      <div className="category-card-meta">
        <YoYBadge yoyPct={category.yoyPct} />
        {!hasUserAmount && (
          <span className="text-muted">
            ${(category.amount / 1_000_000).toFixed(1)}M of total operating budget
          </span>
        )}
      </div>

      {expanded && (
        <div className="subitems" id={`subitems-${category.id}`}>
          {category.subItems && category.subItems.length > 0 && (
            <>
              <h4>Spending by expense type</h4>
              <p className="subitems-note">
                These are <em>kinds of expense</em>, not sub-functions.{' '}
                <em>Wages &amp; Benefits</em> and <em>Contracts</em>, for example,
                cover <strong>all</strong> of the responsibilities listed above &mdash;
                the City's budget doesn't publish a separate
                &ldquo;wages for roads vs wages for snow&rdquo; split, just the
                department total broken down by kind of expense.
              </p>
              {category.subItems.map((s) => (
                <div className="subitem" key={s.name}>
                  <span className="subitem-name">{s.name}</span>
                  <span>
                    <span className="subitem-amount tabular">
                      {hasUserAmount
                        ? formatCurrency(s.userAmount, { decimals: 2 })
                        : formatCurrency(s.amount, { decimals: 0 })}
                    </span>
                    <span className="subitem-pct">
                      {formatPercent(s.share, 0)}
                    </span>
                  </span>
                </div>
              ))}
            </>
          )}
          {category.footnote && (
            <p className="category-footnote">{category.footnote}</p>
          )}
        </div>
      )}

      {expanded && (
        <div className="feedback-block">
          <p className="feedback-block-heading">Share your perspective</p>
          <FeedbackPrompts
            variant="category"
            categoryId={category.id}
            categoryName={category.name}
          />
          <CouncilorEmailButton categoryName={category.name} />
        </div>
      )}
    </article>
  );
}
