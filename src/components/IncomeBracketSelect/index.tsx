"use client";

import clsx from "clsx";
import { useIncomeBracket } from "@/hooks/useIncomeBracket";
import type { IncomeBracketKey } from "@/types";
import styles from "./styles.module.scss";

export default function IncomeBracketSelect(props: {
  className?: string;
}) {
  const incomeBracket = useIncomeBracket();

  return (
    <select
      value={incomeBracket.bracket || ""}
      className={clsx(styles.select, props.className)}
      onChange={(e) => {
        incomeBracket.setIncomeBracket(
          (e.target.value) as IncomeBracketKey || undefined,
        );
      }}
    >
      <option value="">Any income</option>
      <option value="0_30000">&lt;$30K income</option>
      <option value="30001_48000">$30K-$48K income</option>
      <option value="48001_75000">$48K-$75K income</option>
      <option value="75001_110000">$75K-$110K income</option>
      <option value="110001">&gt;$110K income</option>
    </select>
  );
}
