export const TARIKERE_PURASABHA_ID = '69a9303f2e0f1228f681877b';
export const AJJAMPURA_PATANA_ID   = '69a9305c2e0f1228f681877d';
export const MAX_MEMBERS = 6;

export const AREA_CARDS = [
  { taluk: 'tarikere',  areaType: 'purasabha',      label: 'ತರೀಕೆರೆ ಪುರಸಭೆ',           color: 'from-violet-200 to-purple-200', icon: '🏛️', patanaId: TARIKERE_PURASABHA_ID,  shadow: 'shadow-violet-200' },
  { taluk: 'tarikere',  areaType: 'gramapanchayath', label: 'ತರೀಕೆರೆ ತಾಲ್ಲೂಕು',         color: 'from-green-200 to-emerald-200', icon: '🌿', patanaId: null,              shadow: 'shadow-green-200' },
  { taluk: 'ajjampura', areaType: 'patana',          label: 'ಅಜ್ಜಂಪುರ ಪಟ್ಟಣ ಪಂಚಾಯಿತಿ', color: 'from-orange-500 to-amber-600',  icon: '🏘️', patanaId: AJJAMPURA_PATANA_ID,  shadow: 'shadow-orange-200' },
  { taluk: 'ajjampura', areaType: 'gramapanchayath', label: 'ಅಜ್ಜಂಪುರ ತಾಲ್ಲೂಕು',       color: 'from-blue-500 to-cyan-600',     icon: '🌾', patanaId: null,              shadow: 'shadow-blue-200' },
] as const;

export type AreaCard = typeof AREA_CARDS[number];

export const inp = 'w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white hover:border-gray-300 transition';
export const lbl = 'text-xs font-semibold text-gray-500 block mb-1';