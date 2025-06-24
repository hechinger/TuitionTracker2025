"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import ClickAwayListener from "react-click-away-listener";
import { useSearchState } from "@/hooks/useSearchState";
import { useSchools } from "@/hooks/useSchools";
import Well from "@/components/Well";
import { useSuggestions } from "./useSuggestions";
import WhereInput from "./WhereInput";
import MoreOptions from "./MoreOptions";
import Dropdown from "./Dropdown";
import WhereSuggestions from "./WhereSuggestions";
import AdvancedSearch from "./AdvancedSearch";
import styles from "./styles.module.scss";

export default function SearchBar(props: {
  autoload?: boolean;
  highlight?: boolean;
} = {
  autoload: false,
  highlight: false,
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
    <div className={clsx(styles.wrapper, { [styles.highlight]: props.highlight })}>
      <Well>
        <ClickAwayListener onClickAway={() => setInputState(undefined)}>
          <div
            className={clsx(styles.searchBarContainer, {
              [styles.active]: !!inputState,
            })}
          >
            <div
              className={clsx({
                [styles.grayed]: inputState && inputState !== "where",
                [styles.dividerRight]: !inputState,
              })}
            >
              <WhereInput
                value={search.where}
                onChange={(value: string) => updateSearch("where", value)}
                onFocus={() => setInputState("where")}
                schools={schools}
              />
            </div>

            <div
              className={clsx({
                [styles.grayed]: inputState && inputState !== "more",
              })}
            >
              <MoreOptions
                onFocus={() => setInputState("more")}
              />
            </div>

            <div
              className={clsx(styles.searchButtonContainer, {
                [styles.grayed]: inputState && inputState !== "more",
              })}
            >
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
        </ClickAwayListener>
      </Well>
    </div>
  );
}
