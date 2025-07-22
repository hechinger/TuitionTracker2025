"use client";

import clsx from "clsx";
import { useDrop } from "react-dnd";
import { dndRef } from "@/utils/dndRef";
import { formatDollars } from "@/utils/formatDollars";
import { formatSchoolControl, formatDegreeLevel } from "@/utils/formatSchoolInfo";
import { useIncomeBracket } from "@/hooks/useIncomeBracket";
import SchoolImage from "@/components/SchoolImage";
import type { SchoolIndex } from "@/types";
import styles from "./styles.module.scss";

const bracketLabels = {
  average: "any income",
  "0_30000": "income <$30K",
  "30001_48000": "income $30K-$48K",
  "48001_75000": "income $48K-$75K",
  "75001_110000": "income $75K-$110K",
  "110001": "income >$110K",
} as const;

export default function Slot(props: {
  school: SchoolIndex | undefined;
  setSlot: (id: string) => void;
}) {
  const { bracket: incomeBracket = "average" } = useIncomeBracket();

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
          Click or drag a school here to compare
        </div>
      )}

      {props.school && (
        <div className={styles.school}>
          <SchoolImage
            school={props.school}
            withFallback
          />

          <div className={styles.info}>
            <div className={styles.name}>
              {props.school.name}
            </div>

            <div className={styles.fact}>
              <div className={styles.label}>
                Type
              </div>

              <div className={styles.value}>
                {formatSchoolControl(props.school.schoolControl)}, {formatDegreeLevel(props.school.degreeLevel)}
              </div>
            </div>

            <div className={styles.fact}>
              <div className={styles.label}>
                Sticker price
              </div>

              <div className={styles.value}>
                {formatDollars(props.school.stickerPrice.price)}
              </div>
            </div>

            <div className={styles.fact}>
              <div className={styles.label}>
                Average net price
              </div>

              <div className={styles.value}>
                <span>
                  {formatDollars(props.school.netPricesByBracket[incomeBracket])}
                </span>
                {' '}
                <span>
                  for {bracketLabels[incomeBracket]}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
