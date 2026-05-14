import CategoryCard from './CategoryCard.jsx';
import { formatCurrency } from '../lib/breakdown.js';

export default function BreakdownList({ categories, taxPaid, fiscalYear }) {
  const hasUserAmount = taxPaid > 0;

  return (
    <div className="breakdown">
      <div className="breakdown-summary">
        <span className="breakdown-summary-label">
          {hasUserAmount
            ? `Your $${taxPaid.toLocaleString('en-CA')} bill funded`
            : `City of Moncton ${fiscalYear} operating budget`}
        </span>
        <span className="breakdown-summary-value tabular">
          {hasUserAmount
            ? `${formatCurrency(taxPaid, { decimals: 2 })} across ${categories.length} categories`
            : `${formatCurrency(categories.reduce((s, c) => s + c.amount, 0), { compact: true })}`}
        </span>
      </div>

      {categories.map((cat) => (
        <CategoryCard key={cat.id} category={cat} taxPaid={taxPaid} />
      ))}
    </div>
  );
}
