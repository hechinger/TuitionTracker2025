"use client";

import { useId, useCallback } from "react";
import { BuildingApartmentIcon, CertificateIcon, CurrencyCircleDollarIcon } from "@phosphor-icons/react";
import { useIncomeBracket } from "@/hooks/useIncomeBracket";
import type { SearchOptions, UpdateSearch } from "@/hooks/useSearchState";
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

export default function AdvancedSearch(props: {
  search: SearchOptions;
  updateSearch: UpdateSearch;
}) {
  const id = useId();

  const { search, updateSearch } = props;

  const incomeBracket = useIncomeBracket();

  const updateSchoolType = useCallback((
    value: SearchOptions["schoolType"][number],
    flag: boolean,
  ) => {
    const old = search.schoolType || [];
    const rest = old.filter((t) => t !== value);
    if (flag) {
      rest.push(value);
    }
    updateSearch("schoolType", rest);
  }, [search, updateSearch]);

  return (
    <div>
      <h2 className={styles.title}>More search options</h2>

      <div className={styles.costSection}>
        <h3>What it will cost</h3>

        <div className={styles.bracket}>
          {incomeBrackets.map((bracket) => (
            <label
              key={bracket.value}
            >
              <input
                type="radio"
                name={`income-bracket-${id}`}
                value={bracket.value || ""}
                checked={incomeBracket.bracket === bracket.value}
                onChange={(e) => incomeBracket.setIncomeBracket(e.target.value || undefined)}
              />
              <span>{bracket.label}</span>
            </label>
          ))}
        </div>

        <div className={styles.cost}>
          <label>
            Minimum
            <input
              type="number"
              value={search.minPrice}
              onChange={(e) => updateSearch("minPrice", +e.target.value)}
            />
          </label>

          <label>
            Maximum
            <input
              type="number"
              value={search.maxPrice}
              onChange={(e) => updateSearch("maxPrice", +e.target.value)}
            />
          </label>
        </div>
      </div>

      <div className={styles.schoolTypeSection}>
        <h3>School type</h3>

        <div className={styles.schoolTypes}>
          {schoolTypes.map((schoolType) => (
            <label
              key={schoolType.value}
            >
              <input
                type="checkbox"
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
              onChange={(e) => updateSearch("tribalCollege", e.target.checked)}
            />
            <span>Tribal college</span>
          </label>

          <label>
            <input
              type="checkbox"
              onChange={(e) => updateSearch("hbcu", e.target.checked)}
            />
            <span>Historically black (HBCU)</span>
          </label>
        </div>
      </div>

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.clearButton}
        >
          Clear
        </button>

        <button
          type="button"
          className={styles.searchButton}
        >
          Search
        </button>
      </div>
    </div>
  );
}
