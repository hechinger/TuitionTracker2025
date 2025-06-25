import { useState, useEffect } from "react";
import { useCopyToClipboard } from "usehooks-ts";
import type { SavedSchools } from "@/types";

export function useCopySavedSchoolsLink(opts: {
  savedSchools: SavedSchools;
}) {
  const [page, setPage] = useState<string>();

  const [copyState, setCopyState] = useState<string>("ready");
  const [, copy] = useCopyToClipboard();

  useEffect(() => {
    setPage(window.location.href);
  }, []);

  const schoolIds = opts.savedSchools.schools;
  const q = new URLSearchParams({
    "saved-schools": JSON.stringify(schoolIds),
  });
  const copyLink = page && `${page}?${q}`;

  let timer: NodeJS.Timeout | undefined = undefined;

  const handleCopy = async () => {
    if (!copyLink) return;
    try {
      await copy(copyLink);
      setCopyState("copied");
    } catch(error) {
      setCopyState("error");
      console.error(error);
    }

    timer = setTimeout(() => setCopyState("ready"), 3000);
  };

  useEffect(() => {
    return () => clearTimeout(timer);
  }, [timer]);

  const messages = {
    ready: "Copy link to saved schools",
    copied: "Copied to clipboard",
    error: "Failed to copy",
  } as Record<string, string>;
  return {
    message: messages[copyState],
    copy: handleCopy,
  };
}
