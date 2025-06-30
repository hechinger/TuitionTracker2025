"use client";

import { useId } from "react";
import us from "us";
import type { SchoolIndex } from "@/types";
import styles from "./styles.module.scss";

export default function WhereInput(props: {
  value: string;
  states: string[];
  onChange: (value: string) => void;
  onRemoveState: (state: string) => void;
  onFocus: () => void;
  schools: SchoolIndex[];
}) {
  const id = `where-input-${useId()}`;
  const placeholder = (props.states.length < 1)
    ? "Find a school or pick a state"
    : "";

  return (
    <div className={styles.whereInput}>
      <label htmlFor={id}>
        <div className={styles.label}>
          Where
        </div>

        <div className={styles.inputWrapper}>
          <div className={styles.states}>
            {props.states.map((state) => (
              <button
                key={state}
                type="button"
                className={styles.state}
                onClick={() => props.onRemoveState(state)}
              >
                {us.lookup(state)?.name}
              </button>
            ))}
          </div>

          <input
            id={id}
            className={styles.input}
            value={props.value}
            type="text"
            placeholder={placeholder}
            onChange={(e) => props.onChange(e.target.value)}
            onFocus={props.onFocus}
          />
        </div>
      </label>
    </div>
  );
}
