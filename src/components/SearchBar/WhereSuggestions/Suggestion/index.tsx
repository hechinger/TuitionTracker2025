"use client";

import { ArrowRightIcon, GraduationCapIcon, MapPinIcon } from "@phosphor-icons/react";
import { Link } from "@/i18n/navigation";
import type { Suggestion } from "../../useSuggestions";
import styles from "./styles.module.scss";

const mainIcons = {
  state: <MapPinIcon />,
  school: <GraduationCapIcon />,
};

const followIcons = {
  state: null,
  school: <ArrowRightIcon />,
};

/**
 * Renders an individual suggestion in the set of suggestions under the "where"
 * input when a user searches for something. States add to the search
 * conditions, while schools link directly to the school page.
 * 
 * @param props.suggestion
 *   The suggestion to render, as returned by the `useSuggestions` hook, can be
 *   either a state or a school
 * @param props.onSelectState
 *   Function to call if the user selects a state
 */
export default function Suggestion(props: {
  suggestion: Suggestion;
  onSelectState: (state: string) => void;
}) {
  return (
    <div className={styles.suggestion}>
      {mainIcons[props.suggestion.type]}
      <span>
        {props.suggestion.type === "school" && (
          <Link href={props.suggestion.value}>
            {props.suggestion.label}
          </Link>
        )}

        {props.suggestion.type === "state" && (
          <button
            type="button"
            className={styles.button}
            onClick={() => props.onSelectState(props.suggestion.value)}
          >
            {props.suggestion.label}
          </button>
        )}
      </span>
      {followIcons[props.suggestion.type]}
    </div>
  );
}
