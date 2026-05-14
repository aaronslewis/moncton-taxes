export function formatCurrency(amount, opts = {}) {
  const { decimals = 0, compact = false } = opts;
  if (compact && Math.abs(amount) >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (compact && Math.abs(amount) >= 1_000) {
    return `$${(amount / 1_000).toFixed(1)}K`;
  }
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
}

export function formatPercent(fraction, decimals = 1) {
  return `${(fraction * 100).toFixed(decimals)}%`;
}

export function computeBreakdown(taxPaid, dataset) {
  const total = dataset.totalOperating;
  const totalPrev = dataset.totalOperatingPrev;
  const safeTax = Number.isFinite(taxPaid) && taxPaid > 0 ? taxPaid : 0;

  return dataset.categories
    .map((cat) => {
      const share = cat.amount / total;
      const sharePrev = totalPrev > 0 ? cat.prev / totalPrev : 0;
      const yoyAbs = cat.amount - cat.prev;
      const yoyPct = cat.prev > 0 ? yoyAbs / cat.prev : 0;
      const userAmount = safeTax * share;

      const subItems = (cat.subItems || []).map((s) => {
        const subShareOfCategory = cat.amount > 0 ? s.amount / cat.amount : 0;
        return {
          ...s,
          share: subShareOfCategory,
          userAmount: userAmount * subShareOfCategory,
        };
      });

      return {
        ...cat,
        share,
        sharePrev,
        yoyAbs,
        yoyPct,
        userAmount,
        subItems,
      };
    })
    .sort((a, b) => b.amount - a.amount);
}
