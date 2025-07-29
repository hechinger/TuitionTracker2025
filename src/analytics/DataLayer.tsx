/* eslint-disable @next/next/no-before-interactive-script-outside-document */
"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";
import get from "lodash/get";

export const getDataLayer = () => {
  return get(window, "dataLayer", []) as (unknown)[];
};

export default function DataLayer(props: {
  dataLayerKey: string;
  dataLayer?: Record<string, unknown>;
}) {
  const {
    dataLayerKey,
    dataLayer,
  } = props;

  const ref = useRef<string>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (ref.current === dataLayerKey) return;

    ref.current = dataLayerKey;

    getDataLayer().push({ ...dataLayer });
    return () => {
      getDataLayer().push(function(this: { reset: () => void; }) {
        this.reset();
      });
    };
  }, [dataLayerKey]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Script id="data-layer" strategy="beforeInteractive">
      {`
         window.dataLayer = window.dataLayer || [];
      `}
    </Script>
  );
}
