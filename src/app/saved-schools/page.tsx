import PageTopOverlap from "@/components/PageTopOverlap";
import SearchBar from "@/components/SearchBar";
import SchoolComparison from "@/components/SchoolComparison";
import Recirculation from "@/components/Recirculation";

export default function SavedSchools() {
  return (
    <>
      <PageTopOverlap>
        <SearchBar withNav />
      </PageTopOverlap>
      <SchoolComparison />
      <Recirculation />
    </>
  );
}
