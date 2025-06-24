import type { Suggestion } from "../useSuggestions";
import SuggestionEntry from "./Suggestion";
import styles from "./styles.module.scss";

export default function WhereSuggestions(props: {
  suggestions: Suggestion[];
}) {
  if (props.suggestions.length < 1) return null;
  return (
    <div className={styles.suggestions}>
      {props.suggestions.map((suggestion) => (
        <SuggestionEntry
          key={suggestion.value}
          suggestion={suggestion}
        />
      ))}
    </div>
  );
}
