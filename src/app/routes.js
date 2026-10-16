import { DINO } from '../content/dino.js';

// Addresses for screens, so a screen can be opened from a link or bookmark:
//   #/kaland/dino-muddy-footprints-01   the dinosaur adventure (short form: #/dino)
//   #/vilag/dinosaurs                   a world        #/felfedezes   Felfedezés
//   #/mai-kaland   #/sajat-vilagom/tools   #/piheno   #/szuloi-ter (still asks for the PIN)
// Progress is stored on the device and is not touched by following a link.
export const DINO_LINK = `#/kaland/${DINO.id}`;

export function toHash(r) {
  switch (r.name) {
    case 'adventure':
      return `#/kaland/${r.id}`;
    case 'world':
      return `#/vilag/${r.id}`;
    case 'explore':
      return '#/felfedezes';
    case 'today':
      return '#/mai-kaland';
    case 'myworld':
      return `#/sajat-vilagom${r.tab ? `/${r.tab}` : ''}`;
    case 'tool':
      return `#/eszkoz/${r.id}`;
    case 'rest':
      return '#/piheno';
    case 'parent':
      return '#/szuloi-ter';
    default:
      return '';
  }
}

export function fromHash(hash) {
  const [, a, b] = (hash || '').split('/');
  switch (a) {
    case 'dino':
      return { name: 'adventure', id: DINO.id };
    case 'kaland':
      return b ? { name: 'adventure', id: b } : null;
    case 'vilag':
      return b ? { name: 'world', id: b } : null;
    case 'felfedezes':
      return { name: 'explore' };
    case 'mai-kaland':
      return { name: 'today' };
    case 'sajat-vilagom':
      return { name: 'myworld', tab: b || undefined };
    case 'eszkoz':
      return b ? { name: 'tool', id: b } : null;
    case 'piheno':
      return { name: 'rest' };
    case 'szuloi-ter':
      return { name: 'parent' };
    default:
      return null;
  }
}
