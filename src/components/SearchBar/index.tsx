"use client";
import { useRouter } from "next/navigation";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { useSearchState } from "@/hooks/useSearchState";
import WhereInput from "./WhereInput";
import MoreOptions from "./MoreOptions";
import styles from "./styles.module.scss";

export default function SearchBar(props: {
  autoload?: boolean;
} = {
  autoload: false,
}) {
  const router = useRouter();

  const { search, updateSearch, searchQueryString } = useSearchState({
    autoload: props.autoload,
  });

  //    <div>
  //      {Object.entries(schoolType).map(([type, value]) => (
  //        <label key={type}>
  //          {type}
  //          <input
  //            type="checkbox"
  //            checked={value}
  //            onChange={(e) => setSchoolType((old) => ({
  //              ...old,
  //              [type]: e.target.checked,
  //            }))}
  //          />
  //        </label>
  //      ))}
  //    </div>

  return (
    <div className={styles.searchBarContainer}>
      <WhereInput
        value={search.where}
        onChange={(value: string) => updateSearch("where", value)}
      />

      <MoreOptions
        search={search}
        updateSearch={updateSearch}
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
    </div>
  );
}
