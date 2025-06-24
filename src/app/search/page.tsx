import SearchBar from "@/components/SearchBar";
import SearchResults from "@/components/SearchResults";

export default function Search() {
  return (
    <div>
      <SearchBar autoload />
      <SearchResults />
    </div>
  );
}
