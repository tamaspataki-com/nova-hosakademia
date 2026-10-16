import { useEffect, useState } from 'react';

// App updates. A new build is downloaded in the background and then waits ("Új verzió érhető el").
// It is applied only when someone taps "Frissítés" – never automatically, and the banner is not shown during an
// adventure, so an activity is never reloaded under the child. Progress lives in localStorage and survives the reload.
let ready = false;
let apply = null;
const subs = new Set();

export const setUpdater = (fn) => {
  apply = fn;
};
export function markUpdateReady() {
  ready = true;
  subs.forEach((f) => f(true));
}
export function applyUpdate() {
  apply?.(true);
  // Normally the new worker takes over and the page reloads by itself. If nothing has happened shortly after
  // (for example on the very first visit, before a worker controlled the page), reload explicitly.
  setTimeout(() => window.location.reload(), 1500);
}

export function useUpdateReady() {
  const [v, setV] = useState(ready);
  useEffect(() => {
    subs.add(setV);
    setV(ready);
    return () => subs.delete(setV);
  }, []);
  return v;
}
