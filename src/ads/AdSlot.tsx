"use client";

import { useId, useEffect } from "react";
import { googletag } from "./googletag";
import styles from "./adSlot.module.scss";

/**
 * The ad unit and the supported sizes need to be configured in the
 * Google Ad Manager web interface.
 */
const adUnit = '/6160094/tuition-tracker-top-001';
const size = [
  [300, 250],
  [728, 90],
] as googletag.MultiSize

export default function AdSlot() {
  const id = `ad-slot-${useId()}`;

  useEffect(() => {
    const gt = googletag();
    let slot: googletag.Slot | null;

    // Register the slot with GPT when the component is loaded.
    gt.cmd.push(() => {
      slot = gt.defineSlot(adUnit, size, id);

      // This instructs GPT which ad sizes to use at which screen sizes.
      // Note that this should line up with the CSS of the ad slot.
      const sizeMapping = gt
        .sizeMapping()
        .addSize([740, 600], [size[1]])
        .addSize([300, 250], [size[0]])
        .build();

      if (slot) {
        slot.addService(gt.pubads());

        if (sizeMapping) {
          slot.defineSizeMapping(sizeMapping);
        }

        gt.display(slot);
      }
    });

    // Clean up the slot when the component is unloaded.
    return () => {
      gt.cmd.push(() => {
        if (slot) {
          gt.destroySlots([slot]);
        }
      });
    };
  }, [id]);

  // Create the ad slot container.
  return (
    <div className={styles.adSlot}>
      <span className={styles.adLabel}>
        Advertisement
      </span>
      <div
        id={id}
        className={styles.adContainer}
      />
    </div>
  );
}
