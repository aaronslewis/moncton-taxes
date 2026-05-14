function findCategory(dataset, id) {
  return dataset.categories.find((c) => c.id === id);
}

function findSubItem(category, predicate) {
  return (category?.subItems || []).find(predicate);
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
  const finance = findCategory(dataset, 'finance-services');
  const community = findCategory(dataset, 'community-services');
  const transit = findCategory(dataset, 'codiac-transpo');
  const sustainable = findCategory(dataset, 'sustainable-growth-and-development');
  const governance = findCategory(dataset, 'governance-corp-management');
  const legal = findCategory(dataset, 'legal-and-city-clerk');

  const rcmp = findSubItem(protective, (s) => /RCMP/i.test(s.name));
  const financeFiscal = findSubItem(finance, (s) => s.name === 'Fiscal Cost');
  const fireWater = findSubItem(protective, (s) => s.name === 'Water Costs');

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
  const govPlusLegal = governance.amount + legal.amount;

  return [
    {
      id: 'rcmp-share',
      title: "POLICING'S BIGGEST SLICE",
      headline: `${fmtM(rcmp.amount)} to the RCMP`,
      body:
        `Just the Codiac RCMP contract — not counting Fire, bylaw, or emergency prep — is ` +
        `${fmtPct1(rcmp.amount / total)} of the operating budget. That single line is bigger than ` +
        `the City's ${smallestN} smallest departments combined (${fmtM(smallestSum)}).`,
    },
    {
      id: 'police-growth',
      title: 'FASTEST-GROWING DEPARTMENT',
      headline: `+${(protectiveGrowth * 100).toFixed(1)}% on Protective Services`,
      body:
        `While the City's total operating budget rose ${fmtPct1(overallGrowth)} year-over-year, ` +
        `Protective Services jumped from ${fmtM(protective.prev)} to ${fmtM(protective.amount)} — ` +
        `roughly ${(protectiveGrowth / overallGrowth).toFixed(1)}× the overall rate of growth.`,
    },
    {
      id: 'debt-vs-transit',
      title: 'PAYING FOR THE PAST',
      headline: `${fmtM(financeFiscal.amount)} in debt servicing`,
      body:
        `Finance Services pays ${fmtM(financeFiscal.amount)} just to service the City's existing ` +
        `debt — more than the entire Codiac Transpo operating budget (${fmtM(transit.amount)}).`,
    },
    {
      id: 'bang-for-buck',
      title: 'BANG FOR YOUR BUCK',
      headline: `${fmtM(community.amount)} for everything fun`,
      body:
        `Parks programming, arenas, pools, the Coliseum, Magnetic Hill Zoo, Resurgo Place, and ` +
        `the Moncton Public Library together cost ${fmtM(community.amount)} — about ` +
        `${fmtPct0(communityToRcmpRatio)} of the Codiac RCMP contract on its own.`,
    },
    {
      id: 'fire-hydrant-water',
      title: 'WATER FOR THE FIRE TRUCKS',
      headline: `${fmtM(fireWater.amount)} to fill the hydrants`,
      body:
        `One line inside Protective Services — labeled simply "Water Costs" — has the City paying ` +
        `its own water utility about ${fmtM(fireWater.amount)} a year for fire-hydrant and tanker ` +
        `supply. That single item is bigger than the Mayor/Council/CAO and Legal & City Clerk's ` +
        `office budgets combined (${fmtM(govPlusLegal)}).`,
    },
    {
      id: 'only-cut',
      title: 'THE ONLY DEPARTMENT CUT',
      headline: `${sustainableGrowth < 0 ? '−' : '+'}${Math.abs(sustainableGrowth * 100).toFixed(1)}% for Sustainable Growth`,
      body:
        `Despite Moncton being one of Canada's fastest-growing cities, Sustainable Growth & ` +
        `Development is the one department with a notable reduction — down from ` +
        `${fmtM(sustainable.prev)} to ${fmtM(sustainable.amount)}.`,
    },
  ];
}
