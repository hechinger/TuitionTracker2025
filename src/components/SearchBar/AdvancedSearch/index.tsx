"use client";

import { useId, useCallback } from "react";
import { BuildingApartmentIcon, CertificateIcon, CurrencyCircleDollarIcon, GraduationCapIcon } from "@phosphor-icons/react";
import { useIncomeBracket } from "@/hooks/useIncomeBracket";
import type { IncomeBracketKey } from "@/types";
import type { SearchOptions, UpdateSearch } from "@/hooks/useSearchState";
import PriceHistogram from "./PriceHistogram";
import styles from "./styles.module.scss";

const incomeBrackets = [
  {
    value: undefined,
    label: "Any",
  },
  {
    value: "0_30000",
    label: "$0-$30K",
  },
  {
    value: "30001_48000",
    label: "$30K-$48K",
  },
  {
    value: "48001_75000",
    label: "$48K-$75K",
  },
  {
    value: "75001_110000",
    label: "$75K-$110K",
  },
  {
    value: "110001",
    label: ">$110K",
  },
] as const;

const schoolTypes = [
  {
    value: "public",
    label: "Public",
    icon: <BuildingApartmentIcon size="48" />,
  },
  {
    value: "private",
    label: "Private",
    icon: <CertificateIcon size="48" />,
  },
  {
    value: "for-profit",
    label: "For-profit",
    icon: <CurrencyCircleDollarIcon size="48" />,
  },
] as const;

const degreeTypes = [
  {
    value: "any",
    label: "Any",
  },
  {
    value: "4-year",
    label: "Four-year",
  },
  {
    value: "2-year",
    label: "Two-year",
  },
] as const;

/**
 * 
 * @param props.search
 *   The current state of the user's search inputs
 * @param props.resetAdvanced
 *   Function that will undo all of the user's selections in the "advanced"
 *   search inputs pane
 * @param props.updateSearch
 *   Function that will update the state of the user's search
 * @param props.runSearch
 *   Function that will execute the current search
 */
export default function AdvancedSearch(props: {
  search: SearchOptions;
  resetAdvanced: () => void;
  updateSearch: UpdateSearch;
  runSearch: () => void;
}) {
  const id = useId();

  const { search, resetAdvanced, updateSearch } = props;

  const incomeBracket = useIncomeBracket();

  const updateSchoolType = useCallback((
    value: SearchOptions["schoolType"][number] | undefined,
    flag: boolean,
  ) => {
    const newValue = (flag && value) ? [value] : [];
    updateSearch("schoolType", newValue);
  }, [updateSearch]);

  return (
    <div className={styles.container}>
      <div className={styles.sections}>
        <div className={styles.costSection}>
          <h3>What it will cost</h3>

          <p className={styles.instructions}>
            Optionally select your household income to get a better price estimate.
          </p>

          <div className={styles.bracket}>
            {incomeBrackets.map((bracket) => (
              <label
                key={bracket.value || ""}
                className={styles.bracketLabel}
              >
                <input
                  type="radio"
                  name={`income-bracket-${id}`}
                  value={bracket.value || ""}
                  checked={incomeBracket.bracket === bracket.value}
                  onChange={(e) => {
                    incomeBracket.setIncomeBracket(
                      (e.target.value) as IncomeBracketKey || undefined,
                    );
                  }}
                />
                <span>{bracket.label}</span>
              </label>
            ))}
          </div>

          <div>
            <div className={styles.priceHistogram}>
              <PriceHistogram
                bracket={incomeBracket.bracket}
                minPrice={search.minPrice}
                maxPrice={search.maxPrice}
                updateMinPrice={(price: number) => updateSearch("minPrice", price)}
                updateMaxPrice={(price: number) => updateSearch("maxPrice", price)}
              />
            </div>

            <div className={styles.cost}>
              <label>
                <input
                  type="number"
                  value={search.minPrice}
                  onChange={(e) => updateSearch("minPrice", +e.target.value)}
                />
                <span>Minimum</span>
              </label>

              <label>
                <input
                  type="number"
                  value={search.maxPrice || ""}
                  onChange={(e) => updateSearch("maxPrice", +e.target.value)}
                />
                <span>Maximum</span>
              </label>
            </div>
          </div>
        </div>

        <div className={styles.schoolTypeSection}>
          <h3>School type</h3>

          <div className={styles.schoolTypes}>
            <label>
              <input
                type="radio"
                name={`school-type-${id}`}
                value=""
                className={styles.schoolTypeButton}
                checked={search.schoolType.length === 0}
                onChange={(e) => updateSchoolType(undefined, e.target.checked)}
              />
              <div className={styles.schoolTypeIcon}>
               <GraduationCapIcon size="48" />
              </div>
              <span>Any</span>
            </label>

            {schoolTypes.map((schoolType) => (
              <label
                key={schoolType.value}
              >
                <input
                  type="radio"
                  name={`school-type-${id}`}
                  value={schoolType.value}
                  className={styles.schoolTypeButton}
                  checked={search.schoolType.includes(schoolType.value)}
                  onChange={(e) => updateSchoolType(schoolType.value, e.target.checked)}
                />
                <div className={styles.schoolTypeIcon}>
                  {schoolType.icon}
                </div>
                <span>{schoolType.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className={styles.degreeTypeSection}>
          <h3>Degree type</h3>

          <div className={styles.degreeTypes}>
            {degreeTypes.map((degreeType) => (
              <label
                key={degreeType.value}
                className={styles.degreeTypeLabel}
              >
                <input
                  type="radio"
                  name={`degree-type-${id}`}
                  value={degreeType.value}
                  checked={search.degreeType === degreeType.value}
                  onChange={(e) => updateSearch("degreeType", e.target.value)}
                />
                <span>{degreeType.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className={styles.otherSection}>
          <h3>Other school attributes</h3>

          <div className={styles.other}>
            <label>
              <input
                type="checkbox"
                checked={!!search.tribalCollege}
                onChange={(e) => updateSearch("tribalCollege", e.target.checked)}
              />
              <span>Tribal college</span>
            </label>

            <label>
              <input
                type="checkbox"
                checked={!!search.hbcu}
                onChange={(e) => updateSearch("hbcu", e.target.checked)}
              />
              <span>Historically black (HBCU)</span>
            </label>
          </div>
        </div>
      </div>

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.clearButton}
          onClick={resetAdvanced}
        >
          Clear
        </button>

        <button
          type="submit"
          className={styles.searchButton}
          onClick={props.runSearch}
        >
          Search
        </button>
      </div>
    </div>
  );
}
