/* eslint-disable @next/next/no-before-interactive-script-outside-document */
"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";
import get from "lodash/get";
import { getValue } from "@/hooks/useStorageContext";

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

  const dataLayerKeyRef = useRef<string>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (dataLayerKeyRef.current === dataLayerKey) return;

    dataLayerKeyRef.current = dataLayerKey;

    const referrer = getValue<string>("pageReferrer")
      || window.document.referrer
      || window.location.href;

    const e = {
      event: "ttpv",
      pageReferrer: referrer,
      ...dataLayer,
    };
    getDataLayer().push(e);
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
