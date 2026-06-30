/* eslint-disable @next/next/no-before-interactive-script-outside-document */
"use client";

import Script from "next/script";
import { ADS_ENABLED } from "./config";

export default function GooglePublisherTag() {
  if (!ADS_ENABLED) {
    return null;
  }

  return (
    <>
      <Script
        id="google-publisher-tag"
        async
        src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"
      />
      <Script id="google-publisher-tag-config" strategy="beforeInteractive">
        {`
          window.googletag = window.googletag || {cmd: []};
          googletag.cmd.push(function() {
            googletag.pubads().set("page_url", "https://www.tuitiontracker.org");
            googletag.pubads().enableSingleRequest();
            googletag.enableServices();
          });
        `}
      </Script>
    </>
  );
}
