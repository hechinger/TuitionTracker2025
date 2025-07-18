import type { SuggestionSet } from "../useSuggestions";
import SuggestionEntry from "./Suggestion";
import styles from "./styles.module.scss";

/**
 * Renders the set of suggestions that show up under the "where" input
 * when the user searches for something.
 * 
 * @param props.suggestions
 *   The set of suggestions returned by the `useSuggestions` hook
 * @param props.onSelectState
 *   Function to call if the user clicks on a state in the suggestions
 */
export default function WhereSuggestions(props: {
  suggestions: SuggestionSet;
  onSelectState: (state: string) => void;
}) {
  const {
    suggestions: {
      states,
      schools,
    },
    onSelectState,
  } = props;

  if (states.length < 1 && schools.length < 1) return null;

  return (
    <div className={styles.suggestions}>
      {states.length > 0 && (
        <div className={styles.section}>
          <div className={styles.title}>
            States
          </div>
          <div className={styles.options}>
            {states.map((suggestion) => (
              <SuggestionEntry
                key={suggestion.value}
                suggestion={suggestion}
                onSelectState={onSelectState}
              />
            ))}
          </div>
        </div>
      )}

      {schools.length > 0 && (
        <div className={styles.section}>
          <div className={styles.title}>
            Schools
          </div>
          <div className={styles.options}>
            {schools.map((suggestion) => (
              <SuggestionEntry
                key={suggestion.value}
                suggestion={suggestion}
                onSelectState={onSelectState}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
