"use client";

import { useState } from "react";
import clsx from "clsx";
import { MagnifyingGlassIcon, SlidersHorizontalIcon } from "@phosphor-icons/react";
import ClickAwayListener from "react-click-away-listener";
import { Link } from "@/i18n/navigation";
import { useSearchState } from "@/hooks/useSearchState";
import { useSchools } from "@/hooks/useSchools";
import TuitionTrackerLogo from "@/components/TuitionTrackerLogo";
import { useSuggestions } from "./useSuggestions";
import WhereInput from "./WhereInput";
import MoreOptions from "./MoreOptions";
import Dropdown from "./Dropdown";
import WhereSuggestions from "./WhereSuggestions";
import AdvancedSearch from "./AdvancedSearch";
import styles from "./styles.module.scss";

/**
 * The main search bar for the site. The search bar can be rendered with or
 * without a "nav" element above it with the `withNav` prop (used on pages
 * other than the landing page), and it can be highlighted with a gray
 * background with the `highlight` prop (used on the landing page). The
 * `autoload` prop controls whether the state of the search inputs should
 * be automatically loaded from the URL when the page loads (used on the
 * search results page).
 * 
 * @param props.autoload
 *   Automatically load the search input state from the URL search params
 * @param props.withNav
 *   Turn on the "nav" element above the bar (the logo linking home)
 * @param props.highlight
 *   Add a gray background behind the search bar for emphasis
 */
export default function SearchBar(props: {
  autoload?: boolean;
  withNav?: boolean;
  highlight?: boolean;
} = {
  autoload: false,
  withNav: false,
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
    dispatcher,
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
    <div
      ref={dispatcher}
      className={clsx(styles.wrapper, { [styles.highlight]: props.highlight })}
    >
      <div>
        {props.withNav && (
          <div className={styles.nav}>
            <Link href="/" className={styles.brand}>
              <TuitionTrackerLogo />
            </Link>
          </div>
        )}
        <ClickAwayListener onClickAway={() => setInputState(undefined)}>
          <div
            className={clsx(styles.searchBarContainer, {
              [styles.active]: !!inputState,
              [styles.mobileDialog]: inputState === "more",
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
                data-search={searchQueryString}
              >
                <MagnifyingGlassIcon size="32" />
              </button>
            </div>

            <Dropdown
              isOpen={!!inputState}
              right={inputState === "more"}
              mobileDialog={inputState === "more"}
              close={() => setInputState(undefined)}
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
                  runSearch={doSearch}
                />
              )}
            </Dropdown>
          </div>
        </ClickAwayListener>

        <div className={styles.mobileMoreButton}>
          <button
            type="button"
            onClick={() => setInputState("more")}
          >
            <SlidersHorizontalIcon />
            <span>
              More search options
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
