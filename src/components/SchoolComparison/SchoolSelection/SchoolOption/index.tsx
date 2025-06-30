"use client";

import { useDrag } from "react-dnd";
import { dndRef } from "@/utils/dndRef";
import type { SchoolIndex } from "@/types";
import styles from "./styles.module.scss";

export default function SchoolOption(props: {
  school: SchoolIndex;
  clickSelect: (id: string) => void;
}) {
  const [, drag] = useDrag(() => ({
    type: 'SchoolOption',
    item: {
      id: props.school.id,
    },
  }), [props.school.id]);

  return (
    <div ref={dndRef(drag)}>
      <div
        className={styles.card}
        onClick={() => props.clickSelect(props.school.id)}
      >
        <img
          src={props.school.image}
          alt={props.school.name}
        />
        <div className={styles.info}>
          <div className={styles.name}>
            {props.school.name}
          </div>
        </div>
      </div>
    </div>
  );
}
