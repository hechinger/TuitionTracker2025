"use client";

import { useId } from "react";
import type { SchoolIndex } from "@/types";
import styles from "./styles.module.scss";

export default function WhereInput(props: {
  value: string;
  onChange: (value: string) => void;
  onFocus: () => void;
  schools: SchoolIndex[];
}) {
  const id = `where-input-${useId()}`;

  return (
    <div className={styles.whereInput}>
      <label htmlFor={id}>
        <div className={styles.label}>
          Where
        </div>

        <input
          id={id}
          className={styles.input}
          value={props.value}
          type="text"
          placeholder="Find a school or pick a state"
          onChange={(e) => props.onChange(e.target.value)}
          onFocus={props.onFocus}
        />
      </label>
    </div>
  );
}
