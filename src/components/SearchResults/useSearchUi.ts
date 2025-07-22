import { useRef, useState, useCallback, useEffect } from "react";

export function useSearchUi() {
  const loaded = useRef(false);

  const [sorting, setSorting] = useState("alpha");

  const ref = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const updatePage = useCallback((value: number) => {
    setPage(value);
    if (!ref.current) return;
    ref.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  useEffect(() => {
    const url = new URL(window.location.href);

    const getPage = () => {
      if (!url.searchParams.has("page")) return page;
      const p = +url.searchParams.get("page")!;
      return p - 1;
    };

    if (!loaded.current) {
      // Load from URL if this is our first time rendering
      loaded.current = true;
      setPage(getPage());
      setSorting(url.searchParams.get("sorting") || sorting);
    } else {
      // Keep the URL in sync on subsequent renders
      url.searchParams.set("page", `${page + 1}`);
      url.searchParams.set("sorting", sorting);
      window.history.pushState(null, "", url.href);
    }
  }, [sorting, page]);

  return {
    resultsRef: ref,
    sorting,
    setSorting,
    page,
    updatePage,
  };
}
