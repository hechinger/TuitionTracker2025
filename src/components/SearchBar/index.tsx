"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { useSearchState } from "@/hooks/useSearchState";
import { useSchools } from "@/hooks/useSchools";
import { useSuggestions } from "./useSuggestions";
import WhereInput from "./WhereInput";
import MoreOptions from "./MoreOptions";
import Dropdown from "./Dropdown";
import WhereSuggestions from "./WhereSuggestions";
import AdvancedSearch from "./AdvancedSearch";
import styles from "./styles.module.scss";

export default function SearchBar(props: {
  autoload?: boolean;
} = {
  autoload: false,
}) {
  const router = useRouter();

  const [inputState, setInputState] = useState<string>();

  const { data: schools = [] } = useSchools();
  const { search, updateSearch, searchQueryString } = useSearchState({
    autoload: props.autoload,
  });

  const whereSuggestions = useSuggestions({
    value: search.where,
    schools: schools,
  });

  return (
    <div className={styles.searchBarContainer}>
      <WhereInput
        value={search.where}
        onChange={(value: string) => updateSearch("where", value)}
        onFocus={() => setInputState("where")}
        schools={schools}
      />

      <MoreOptions
        onFocus={() => setInputState("more")}
      />

      <div className={styles.searchButtonContainer}>
        <button
          type="submit"
          onClick={() => {
            router.push(`/search?${searchQueryString}`);
          }}
        >
          <MagnifyingGlassIcon size="32" />
        </button>
      </div>

      <Dropdown isOpen={!!inputState}>
        {inputState === "where" && (
          <WhereSuggestions
            suggestions={whereSuggestions}
          />
        )}

        {inputState === "more" && (
          <AdvancedSearch
            search={search}
            updateSearch={updateSearch}
          />
        )}
      </Dropdown>
    </div>
  );
}
