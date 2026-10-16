// Template helper: `sc-for` treated non-arrays as empty lists.
export const list = (x) => (Array.isArray(x) ? x : []);
