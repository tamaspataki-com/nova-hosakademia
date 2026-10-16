import { TOOLS as RAW } from './authored.js';

// The five strategy tools. All are open from the start; a tool is a reminder of a strategy, never a reward gate.
const EXPLAIN = {
  goggles: 'Megkeresem a választ a szövegben.',
  glove: 'Sorrendbe teszem az eseményeket.',
  shield: 'Kiemelem a legfontosabb gondolatot.',
  crystal: 'Megértem az ismeretlen szavakat.',
  compass: 'Segítséget választok, amikor elakadok.'
};

export const TOOLS = RAW.map((t) => ({ ...t, explain: EXPLAIN[t.id] }));

// The routine taught across all adventures.
export const ROUTINE = [
  { icon: 'pan_tool', label: 'Megállok', text: 'Egy rövid részre figyelek.' },
  { icon: 'psychology', label: 'Átgondolom', text: 'Mi történt? Mi volt fontos?' },
  { icon: 'record_voice_over', label: 'Elmondom', text: 'Megfogalmazom a saját szavaimmal.' },
  { icon: 'fact_check', label: 'Ellenőrzöm', text: 'Visszanézek vagy újra meghallgatom.' }
];
