"use client";

import { useIncomeBracket } from "@/hooks/useIncomeBracket";
import type { IncomeBracketKey } from "@/types";

export default function IncomeBracketSelect() {
  const incomeBracket = useIncomeBracket();

  return (
    <select
      value={incomeBracket.bracket || ""}
      onChange={(e) => {
        incomeBracket.setIncomeBracket(
          (e.target.value) as IncomeBracketKey || undefined,
        );
      }}
    >
      <option value="">Any income</option>
      <option value="0_30000">income $0-$30K</option>
      <option value="30001_48000">income $30K-$48K</option>
      <option value="48001_75000">income $48K-$75K</option>
      <option value="75001_110000">income $75K-$110K</option>
      <option value="110001">income &gt;$110K</option>
    </select>
  );
}
