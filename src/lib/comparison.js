import { SHARED_TAXONOMY } from './taxonomy.js';

export function formatShare(fraction, decimals = 1) {
  if (fraction == null || !Number.isFinite(fraction)) return '—';
  return `${(fraction * 100).toFixed(decimals)}%`;
}

export function buildComparisonMatrix(cities) {
  const rows = SHARED_TAXONOMY.map((bucket) => {
    const byCity = {};
    for (const city of cities) {
      const entry = (city.buckets || []).find((b) => b.taxonomyId === bucket.id);
      byCity[city.cityId] = entry
        ? {
            share: entry.share,
            amount: entry.amount,
            nativeDepartments: entry.nativeDepartments || [],
          }
        : null;
    }
    return {
      taxonomyId: bucket.id,
      name: bucket.name,
      color: bucket.color,
      description: bucket.description,
      footnote: bucket.footnote,
      byCity,
    };
  });

  if (typeof window !== 'undefined' && import.meta.env?.DEV) {
    for (const city of cities) {
      const sum = (city.buckets || [])
        .map((b) => b.share || 0)
        .reduce((a, b) => a + b, 0);
      if (Math.abs(sum - 1) > 0.005 && city.dataStatus !== 'placeholder' && city.dataStatus !== 'summary-only') {
        // eslint-disable-next-line no-console
        console.warn(
          `[comparison] ${city.cityId} bucket shares sum to ${(sum * 100).toFixed(2)}% (expected 100% ±0.5)`,
        );
      }
    }
  }

  return { taxonomy: SHARED_TAXONOMY, rows };
}
