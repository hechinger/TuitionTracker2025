import { useState, useEffect } from "react";

export function useTab(tabs: string[]) {
  const [tab, setTab] = useState(0);

  useEffect(() => {
    const loadTab = () => {
      const hash = window.location.hash.replace(/^#/, "");
      const idx = tabs.findIndex((t) => t === hash);
      setTab(Math.max(0, idx));
    };

    loadTab();

    window.addEventListener("hashchange", loadTab);
    return () => window.removeEventListener("hashchange", loadTab);
  }, [tabs]);

  useEffect(() => {
    const tabName = tabs[tab];
    window.location.hash = `#${tabName}`;
  }, [tab, tabs]);

  return [tab, setTab] as const;
}
