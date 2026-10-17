import { createContext, useContext, useEffect, useRef } from 'react';

// One polite live region per adventure step, owned by the step player. Feedback, hints and guided explanations are
// announced through it exactly once (their visible notes carry no live role of their own, so nothing is read twice).
// Content that is already on screen when a step is entered (e.g. restored after a refresh) is never announced.
export const AnnounceContext = createContext(() => {});
export const useAnnounce = () => useContext(AnnounceContext);

// Announce the text of a node once, when it appears.
export function useAnnounceOnMount(ref, deps = []) {
  const announce = useAnnounce();
  useEffect(() => {
    const node = ref.current?.cloneNode(true);
    node?.querySelectorAll('[aria-hidden="true"]').forEach((n) => n.remove()); // icon names are not words
    const text = node?.textContent?.replace(/\s+/g, ' ').trim();
    if (text) announce(text);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

// Announce `text` whenever it changes to a new non-empty value (not on the first render).
export function useAnnounceChange(text) {
  const announce = useAnnounce();
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (text) announce(text);
  }, [text, announce]);
}
