function findCategory(dataset, id) {
  return dataset.categories.find((c) => c.id === id);
}

function findSubItem(category, predicate) {
  return (category?.subItems || []).find(predicate);
}

function sumAcrossCategories(dataset, subItemPredicate) {
  return dataset.categories.reduce((total, cat) => {
    const match = findSubItem(cat, subItemPredicate);
    return total + (match ? match.amount : 0);
  }, 0);
}

function sortedByAmountAsc(dataset) {
  return [...dataset.categories].sort((a, b) => a.amount - b.amount);
}

function howManySmallestExceeds(dataset, target) {
  const sorted = sortedByAmountAsc(dataset);
  let sum = 0;
  let count = 0;
  for (const cat of sorted) {
    if (sum >= target) break;
    sum += cat.amount;
    count += 1;
  }
  return { count, sum, names: sorted.slice(0, count).map((c) => c.name) };
}

const fmtM = (n) => `$${(n / 1_000_000).toFixed(1)}M`;
const fmtPct1 = (n) => `${(n * 100).toFixed(1)}%`;
const fmtPct0 = (n) => `${Math.round(n * 100)}%`;

export function computeObservations(dataset) {
  const total = dataset.totalOperating;
  const totalPrev = dataset.totalOperatingPrev;
  const overallGrowth = totalPrev > 0 ? (total - totalPrev) / totalPrev : 0;

  const protective = findCategory(dataset, 'protective-services');
  const operations = findCategory(dataset, 'operations-services');
  const finance = findCategory(dataset, 'finance-services');
  const community = findCategory(dataset, 'community-services');
  const transit = findCategory(dataset, 'codiac-transpo');
  const sustainable = findCategory(dataset, 'sustainable-growth-and-development');

  const rcmp = findSubItem(protective, (s) => /RCMP/i.test(s.name));
  const financeFiscal = findSubItem(finance, (s) => s.name === 'Fiscal Cost');
  const wagesTotal = sumAcrossCategories(dataset, (s) => s.name === 'Wages & Benefits');

  const protectiveGrowth = protective.prev > 0
    ? (protective.amount - protective.prev) / protective.prev
    : 0;
  const sustainableGrowth = sustainable.prev > 0
    ? (sustainable.amount - sustainable.prev) / sustainable.prev
    : 0;

  const smallestExceedingRcmp = howManySmallestExceeds(dataset, rcmp.amount);
  const smallestN = smallestExceedingRcmp.count - 1;
  const smallestSum = sortedByAmountAsc(dataset)
    .slice(0, smallestN)
    .reduce((s, c) => s + c.amount, 0);

  const communityToRcmpRatio = community.amount / rcmp.amount;

  return [
    {
      id: 'rcmp-share',
      title: "POLICING'S BIGGEST SLICE",
      headline: `${fmtM(rcmp.amount)} to the RCMP`,
      body:
        `Just the Codiac RCMP contract — not counting Fire, bylaw, or emergency prep — is ` +
        `${fmtPct1(rcmp.amount / total)} of the operating budget. That single line is bigger than ` +
        `the City's ${smallestN} smallest departments combined (${fmtM(smallestSum)}).`,
      accent: protective.color,
    },
    {
      id: 'police-growth',
      title: 'FASTEST-GROWING DEPARTMENT',
      headline: `+${(protectiveGrowth * 100).toFixed(1)}% on Protective Services`,
      body:
        `While the City's total operating budget rose ${fmtPct1(overallGrowth)} year-over-year, ` +
        `Protective Services jumped from ${fmtM(protective.prev)} to ${fmtM(protective.amount)} — ` +
        `roughly ${(protectiveGrowth / overallGrowth).toFixed(1)}× the overall rate of growth.`,
      accent: protective.color,
    },
    {
      id: 'debt-vs-transit',
      title: 'PAYING FOR THE PAST',
      headline: `${fmtM(financeFiscal.amount)} in debt servicing`,
      body:
        `Finance Services pays ${fmtM(financeFiscal.amount)} just to service the City's existing ` +
        `debt — more than the entire Codiac Transpo operating budget (${fmtM(transit.amount)}).`,
      accent: finance.color,
    },
    {
      id: 'bang-for-buck',
      title: 'BANG FOR YOUR BUCK',
      headline: `${fmtM(community.amount)} for everything fun`,
      body:
        `Parks programming, arenas, pools, the Coliseum, Magnetic Hill Zoo, Resurgo Place, and ` +
        `the Moncton Public Library together cost ${fmtM(community.amount)} — about ` +
        `${fmtPct0(communityToRcmpRatio)} of the Codiac RCMP contract on its own.`,
      accent: community.color,
    },
    {
      id: 'wages-share',
      title: 'ROUGHLY $1 IN $3',
      headline: `${fmtPct0(wagesTotal / total)} of the budget is wages`,
      body:
        `Adding up Wages & Benefits across every City department comes to about ${fmtM(wagesTotal)} ` +
        `— close to a third of every property-tax dollar funds City of Moncton employees. ` +
        `(RCMP officers are paid through the separate Codiac contract, so they're not in this figure.)`,
      accent: operations.color,
    },
    {
      id: 'only-cut',
      title: 'THE ONLY DEPARTMENT CUT',
      headline: `${sustainableGrowth < 0 ? '−' : '+'}${Math.abs(sustainableGrowth * 100).toFixed(1)}% for Sustainable Growth`,
      body:
        `Despite Moncton being one of Canada's fastest-growing cities, Sustainable Growth & ` +
        `Development is the one department with a notable reduction — down from ` +
        `${fmtM(sustainable.prev)} to ${fmtM(sustainable.amount)}.`,
      accent: sustainable.color,
    },
  ];
}
