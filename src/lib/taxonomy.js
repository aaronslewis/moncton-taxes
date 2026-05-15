export const SHARED_TAXONOMY = [
  {
    id: 'public-safety',
    name: 'Public Safety',
    color: '#DC2626',
    description: 'Police, fire, bylaw enforcement, and emergency preparedness.',
  },
  {
    id: 'transportation',
    name: 'Roads, Transit & Active Transport',
    color: '#2563EB',
    description: 'Roads, snow and ice control, sidewalks, traffic signals, transit, and fleet.',
  },
  {
    id: 'water-wastewater',
    name: 'Water & Wastewater',
    color: '#0891B2',
    description: 'Potable water, sewer, and stormwater services.',
    footnote: 'Some cities fund water from a separate utility (paid via your water bill, not property tax) and others fund it from general operating. Each city’s treatment is shown in the underlying departments.',
  },
  {
    id: 'parks-recreation-culture',
    name: 'Parks, Recreation & Culture',
    color: '#059669',
    description: 'Parks, arenas, pools, libraries, museums, events, and recreation programming.',
  },
  {
    id: 'planning-growth',
    name: 'Planning, Growth & Economic Dev',
    color: '#CA8A04',
    description: 'Urban planning, building inspection, economic development, tourism, and heritage.',
  },
  {
    id: 'general-government',
    name: 'General Government & Admin',
    color: '#7C3AED',
    description: 'Mayor and council, CAO, legal, clerk, HR, IT, finance operations, and corporate services.',
  },
  {
    id: 'debt-fiscal',
    name: 'Debt Servicing & Fiscal',
    color: '#475569',
    description: 'Interest, principal payments, capital-from-operating, and reserve deposits.',
  },
  {
    id: 'other-grants',
    name: 'Grants & Other',
    color: '#65A30D',
    description: 'Operating grants to outside organizations, contingency, and residual items.',
  },
];

export function getBucket(id) {
  return SHARED_TAXONOMY.find((b) => b.id === id);
}
