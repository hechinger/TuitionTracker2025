import PageTopOverlap from "@/components/PageTopOverlap";
import SearchBar from "@/components/SearchBar";
import SearchResults from "@/components/SearchResults";

export default function Search() {
  return (
    <>
      <PageTopOverlap>
        <SearchBar autoload />
      </PageTopOverlap>
      <SearchResults />
    </>
  );
}
