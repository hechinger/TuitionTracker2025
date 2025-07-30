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
            googletag.defineSlot('/6160094/tuition-tracker-top-001', [[300, 250], [728, 90]], 'div-gpt-ad-1732288624207-0').addService(googletag.pubads()).defineSizeMapping(googletag.sizeMapping().addSize([740, 600], [[728, 90]]).addSize([300, 250], [[300, 250]]).build());
            googletag.pubads().enableSingleRequest();
            googletag.enableServices();
          });
        `}
      </Script>
    </>
  );
}
