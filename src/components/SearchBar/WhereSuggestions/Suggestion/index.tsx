import Link from "next/link";
import { ArrowRightIcon, GraduationCapIcon, MapPinIcon } from "@phosphor-icons/react";
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
