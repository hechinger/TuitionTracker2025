import PageTopOverlap from "@/components/PageTopOverlap";
import SearchBar from "@/components/SearchBar";
import SchoolComparison from "@/components/SchoolComparison";

export default function SavedSchools() {
  return (
    <>
      <PageTopOverlap>
        <SearchBar withNav />
      </PageTopOverlap>
      <SchoolComparison />
    </>
  );
}
