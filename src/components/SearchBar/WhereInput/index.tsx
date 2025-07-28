"use client";

import { useId } from "react";
import us from "us";
import styles from "./styles.module.scss";

/**
 * The "where" input in the search bar.
 * 
 * @param props.value
 *   The current input value the user typed in
 * @param props.states
 *   The set of currently selected states (selected when the user clicks
 *   on a state in the dropdown)
 * @param props.onChange
 *   Function to call when the user types into the input
 * @param props.onRemoveState
 *   Function to call when the user de-selects a state
 * @param props.onFocus
 *   Function to call when the user clicks into the "where" input
 */
export default function WhereInput(props: {
  value: string;
  states: string[];
  onChange: (value: string) => void;
  onRemoveState: (state: string) => void;
  onFocus: () => void;
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
          {props.states.length > 0 && (
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
          )}

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
