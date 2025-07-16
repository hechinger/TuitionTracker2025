"use client";

import { useState } from "react";
import clsx from "clsx";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import ClickAwayListener from "react-click-away-listener";
import { Link } from "@/i18n/navigation";
import { useSearchState } from "@/hooks/useSearchState";
import { useSchools } from "@/hooks/useSchools";
import AppLogo from "@/components/AppLogo";
import { useSuggestions } from "./useSuggestions";
import WhereInput from "./WhereInput";
import MoreOptions from "./MoreOptions";
import Dropdown from "./Dropdown";
import WhereSuggestions from "./WhereSuggestions";
import AdvancedSearch from "./AdvancedSearch";
import styles from "./styles.module.scss";

export default function SearchBar(props: {
  withNav?: boolean;
  autoload?: boolean;
  highlight?: boolean;
} = {
  withNav: false,
  autoload: false,
  highlight: false,
}) {
  const [inputState, setInputState] = useState<string>();

  const { data: schools = [] } = useSchools();
  const {
    search,
    toggleState,
    resetAdvanced,
    updateSearch,
    searchQueryString,
    runSearch,
  } = useSearchState({
    autoload: props.autoload,
  });

  const whereSuggestions = useSuggestions({
    value: search.where,
    schools: schools,
  });

  const doSearch = () => {
    setInputState("");
    runSearch();
  };

  return (
    <div className={clsx(styles.wrapper, { [styles.highlight]: props.highlight })}>
      <div>
        {props.withNav && (
          <div className={styles.nav}>
            <Link href="/" className={styles.brand}>
              <AppLogo />
            </Link>
          </div>
        )}
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
                states={search.states}
                onChange={(value: string) => updateSearch("where", value)}
                onRemoveState={toggleState}
                onFocus={() => setInputState("where")}
                schools={schools}
              />
            </div>

            <div
              className={clsx(styles.moreOptions, {
                [styles.grayed]: inputState && inputState !== "more",
              })}
            >
              <MoreOptions
                search={search}
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
                onClick={doSearch}
              >
                <MagnifyingGlassIcon size="32" />
              </button>
            </div>

            <Dropdown
              isOpen={!!inputState}
              right={inputState === "more"}
            >
              {inputState === "where" && (
                <WhereSuggestions
                  suggestions={whereSuggestions}
                  onSelectState={toggleState}
                />
              )}

              {inputState === "more" && (
                <AdvancedSearch
                  schools={schools}
                  search={search}
                  resetAdvanced={resetAdvanced}
                  updateSearch={updateSearch}
                  searchQueryString={searchQueryString}
                  runSearch={doSearch}
                />
              )}
            </Dropdown>
          </div>
        </ClickAwayListener>
      </div>
    </div>
  );
}
