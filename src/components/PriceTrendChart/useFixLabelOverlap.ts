import { useRef, useEffect } from "react";

export function useFixLabelOverlap<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) return;

    const labels = Array.from(ref.current.querySelectorAll("[data-overlap]")) as HTMLElement[];
    labels.sort((a, b) => {
      const aVal = +(a.dataset.overlap || 0);
      const bVal = +(b.dataset.overlap || 0);
      return bVal - aVal;
    });

    const getBounds = (node: HTMLElement | null) => {
      if (!node) return undefined; 
      const bounds = node.getBoundingClientRect();
      const adjustment = +(node.dataset.adjustment || 0);
      const top = bounds.top - adjustment;
      const bottom = top + bounds.height;
      return {
        top,
        bottom,
        adjustment,
      };
    };

    labels.reduce((deltas, label, i, ls) => {
      // We always leave the top label where it is
      if (i === 0) return [0];

      const lastBounds = getBounds(ls[i - 1])!;
      const bounds = getBounds(label)!;

      // Figure out how much space is between the last label and this one
      const topGap = bounds.top - (lastBounds.bottom + lastBounds.adjustment);

      // By default we'll move this label down enough to be out of the way
      let adjustment = Math.max(0, -1 * topGap);

      const nextBounds = getBounds(ls[i + 1]);
      if (nextBounds && topGap > 0) {
        // If there's a label after this one that overlaps and we have space
        // above this label, we'll move this one up as much as we can
        const bottomOverlap = Math.max(0, bounds.bottom - nextBounds.top);
        adjustment -= Math.max(0, Math.min(topGap, bottomOverlap));
      }

      // Make the adjustment
      label.dataset.adjustment = `${adjustment}`;
      label.style.translate = `0px ${adjustment}px`;

      return [...deltas, adjustment];
    }, [] as number[]);
  });

  return ref;
}
