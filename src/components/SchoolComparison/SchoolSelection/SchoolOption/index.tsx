"use client";

import { useDrag } from "react-dnd";
import { ChartPieIcon } from "@phosphor-icons/react";
import { dndRef } from "@/utils/dndRef";
import SchoolCard from "@/components/SchoolCard";
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
    <div
      ref={dndRef(drag)}
      className={styles.school}
    >
      <SchoolCard
        school={props.school}
      />
      <button
        type="button"
        onClick={() => props.clickSelect(props.school.id)}
        className={styles.compareButton}
      >
        <ChartPieIcon weight="duotone" size={20} />
        <span>
          Compare
        </span>
      </button>
    </div>
  );
}
