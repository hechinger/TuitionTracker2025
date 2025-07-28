/* eslint-disable @next/next/no-before-interactive-script-outside-document */
"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";
import get from "lodash/get";

export default function DataLayer(props: {
  dataLayerKey: string;
  dataLayer?: unknown;
}) {
  const {
    dataLayerKey,
    dataLayer,
  } = props;

  const ref = useRef<string>(null);

  useEffect(() => {
    if (ref.current === dataLayerKey) return;

    ref.current = dataLayerKey;

    const datalayer = () => get(window, "dataLayer", []) as (unknown)[];
    datalayer().push(dataLayer);
    return () => {
      datalayer().push(function(this: { reset: () => void; }) {
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
