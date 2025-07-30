/* eslint-disable @next/next/no-before-interactive-script-outside-document */
import Script from "next/script";

export default function GooglePublisherTag() {
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
            googletag.defineSlot('/6160094/tuition-tracker-top-001', [728, 90], 'div-gpt-ad-1732288624207-0-desktop').addService(googletag.pubads());
            googletag.defineSlot('/6160094/tuition-tracker-top-001', [300, 250], 'div-gpt-ad-1732288624207-0-mobile').addService(googletag.pubads());
            googletag.pubads().enableSingleRequest();
            googletag.enableServices();
          });
        `}
      </Script>
    </>
  );
}
