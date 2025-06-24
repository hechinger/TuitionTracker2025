"use client";

import clsx from "clsx";
import { useDrop } from "react-dnd";
import { dndRef } from "@/utils/dndRef";
import { formatDollars } from "@/utils/formatDollars";
import type { SchoolIndex } from "@/types";
import styles from "./styles.module.scss";

export default function Slot(props: {
  school: SchoolIndex | undefined;
  setSlot: (id: string) => void;
}) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'SchoolOption',
    drop: (item: { id: string }) => {
      props.setSlot(item.id);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }), [props.setSlot]);

  return (
    <div
      ref={dndRef(drop)}
      className={clsx(styles.slot, {
        [styles.empty]: !props.school,
        [styles.isOver]: isOver,
      })}
    >
      {!props.school && (
        <div>
          Drag a school here to compare
        </div>
      )}

      {props.school && (
        <div className={styles.school}>
          <img
            src={props.school.image}
            alt={props.school.name}
          />

          <div className={styles.info}>
            <div className={styles.name}>
              {props.school.name}
            </div>
            <div className={styles.price}>
              <span className={styles.number}>
                {formatDollars(props.school.stickerPrice.price)}
              </span>
              <span>
                sticker price
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
