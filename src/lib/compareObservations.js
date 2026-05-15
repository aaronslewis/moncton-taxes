const MONCTON_ID = 'moncton';

function effectiveRatePct(city) {
  if (city.taxRate == null || !city.taxRateBase) return null;
  return (city.taxRate * 100) / city.taxRateBase;
}

function typicalBill(city) {
  const pct = effectiveRatePct(city);
  if (pct == null || !city.typicalHomeValue) return null;
  return (city.typicalHomeValue * pct) / 100;
}

function bucketShare(city, taxonomyId) {
  return city.buckets?.find((b) => b.taxonomyId === taxonomyId)?.share ?? null;
}

const fmtPct1 = (n) => `${(n * 100).toFixed(1)}%`;
const fmtDollar0 = (n) =>
  `$${Math.round(n).toLocaleString('en-CA')}`;

export function computeCompareObservations(cities) {
  const visible = cities.filter(
    (c) => !c.hidden && c.dataStatus !== 'placeholder',
  );
  if (visible.length < 2) return [];

  const moncton = visible.find((c) => c.cityId === MONCTON_ID);
  const observations = [];

  // 1. Rate vs bill paradox — the most counterintuitive comparison story
  const ratesAndBills = visible
    .map((c) => ({
      city: c,
      ratePct: effectiveRatePct(c),
      bill: typicalBill(c),
    }))
    .filter((r) => r.ratePct != null && r.bill != null);
  if (ratesAndBills.length >= 3) {
    const sortedByRate = [...ratesAndBills].sort((a, b) => a.ratePct - b.ratePct);
    const lowestRate = sortedByRate[0];
    const highestRate = sortedByRate[sortedByRate.length - 1];
    const rateRatio = highestRate.ratePct / lowestRate.ratePct;
    const billRatio = highestRate.bill / lowestRate.bill;

    observations.push({
      id: 'rate-vs-bill',
      title: 'HEADLINE RATE LIES',
      headline: `${rateRatio.toFixed(1)}× rate spread, ${billRatio.toFixed(1)}× bill spread`,
      body:
        `${lowestRate.city.displayName}'s ${lowestRate.ratePct.toFixed(2)}% effective rate looks ` +
        `dramatically lower than ${highestRate.city.displayName}'s ${highestRate.ratePct.toFixed(2)}%, ` +
        `but the typical bills are much closer — ${fmtDollar0(lowestRate.bill)} vs. ` +
        `${fmtDollar0(highestRate.bill)}. Higher BC and AB property values compress the rate but ` +
        `expand the base, so what residents actually pay isn't 4× different.`,
    });
  }

  // 2. Public safety convergence — striking pattern across policing models
  const psShares = visible
    .map((c) => ({ city: c, share: bucketShare(c, 'public-safety') ?? 0 }))
    .filter((s) => s.share > 0);
  if (psShares.length >= 3) {
    const min = psShares.reduce((a, b) => (a.share < b.share ? a : b));
    const max = psShares.reduce((a, b) => (a.share > b.share ? a : b));
    const spread = max.share - min.share;
    if (spread < 0.06) {
      const avgShare = psShares.reduce((s, c) => s + c.share, 0) / psShares.length;
      observations.push({
        id: 'public-safety-convergence',
        title: "EVERYONE'S BIGGEST LINE",
        headline: `~${Math.round(avgShare * 100)}% on public safety, across the board`,
        body:
          `All ${psShares.length} cities allocate between ${fmtPct1(min.share)} and ` +
          `${fmtPct1(max.share)} of their operating budget to police, fire, and emergency ` +
          `services — whether they contract the RCMP (Moncton, Nanaimo) or run their own force ` +
          `(Saint John, Fredericton, Lethbridge). The policing model doesn't seem to change the share.`,
      });
    }
  }

  // 3. Parks & rec outlier — find the highest spender, compare to Moncton
  const prcShares = visible.map((c) => ({
    city: c,
    share: bucketShare(c, 'parks-recreation-culture') ?? 0,
  }));
  const maxPRC = prcShares.reduce((a, b) => (a.share > b.share ? a : b), { share: 0 });
  const monctonPRC = prcShares.find((s) => s.city.cityId === MONCTON_ID)?.share ?? 0;
  if (
    moncton &&
    maxPRC.city &&
    maxPRC.city.cityId !== MONCTON_ID &&
    monctonPRC > 0 &&
    maxPRC.share > monctonPRC * 1.5
  ) {
    observations.push({
      id: 'parks-rec-outlier',
      title: `${maxPRC.city.displayName.toUpperCase()} LIKES TO PLAY`,
      headline: `${fmtPct1(maxPRC.share)} on parks, rec & culture`,
      body:
        `${maxPRC.city.displayName} allocates ${fmtPct1(maxPRC.share)} of its operating budget to ` +
        `parks, libraries, recreation, and culture — about ` +
        `${(maxPRC.share / monctonPRC).toFixed(1)}× Moncton's ${fmtPct1(monctonPRC)}. ` +
        `It's the largest non-public-safety line in their budget and reflects a substantial ` +
        `publicly-funded culture and rec portfolio.`,
    });
  }

  // 4. Per-capita variance
  const perCapita = visible
    .filter((c) => c.population > 0 && c.totalOperating > 0)
    .map((c) => ({
      city: c,
      perCapita: c.totalOperating / c.population,
    }));
  if (perCapita.length >= 3) {
    const sorted = [...perCapita].sort((a, b) => b.perCapita - a.perCapita);
    const highest = sorted[0];
    const lowest = sorted[sorted.length - 1];
    const monctonPC = perCapita.find((p) => p.city.cityId === MONCTON_ID);
    const pctMore = Math.round(((highest.perCapita / lowest.perCapita) - 1) * 100);
    observations.push({
      id: 'per-capita',
      title: 'PER PERSON, COMPARED',
      headline: `${highest.city.displayName}: ${fmtDollar0(highest.perCapita)} per resident`,
      body:
        `Total operating spending divided by population shows real variation. ` +
        `${highest.city.displayName} tops the comparison at ${fmtDollar0(highest.perCapita)} per ` +
        `person — about ${pctMore}% more than ${lowest.city.displayName}'s ` +
        `${fmtDollar0(lowest.perCapita)}.` +
        (monctonPC
          ? ` Moncton sits at ${fmtDollar0(monctonPC.perCapita)} per resident.`
          : ''),
    });
  }

  // 5. Water utility consistency — only fires if every city is at ~0%
  const waterShares = visible.map((c) => bucketShare(c, 'water-wastewater') ?? 0);
  const maxWater = Math.max(...waterShares);
  if (maxWater < 0.01) {
    observations.push({
      id: 'water-utility',
      title: 'NOT IN YOUR PROPERTY TAX',
      headline: 'Water funded separately in every city',
      body:
        `All ${visible.length} cities run water and wastewater as separate user-fee utilities — ` +
        `paid on the water bill, not through property tax. The Water & Wastewater row reads ` +
        `0% in every column above. It's a quietly consistent pattern across cities of very ` +
        `different sizes and provinces.`,
    });
  }

  return observations;
}
