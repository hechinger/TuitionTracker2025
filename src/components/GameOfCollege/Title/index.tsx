"use client";

import { useGtag } from "@/hooks/useGtag";

const url = "https://www.tuitiontracker.org/game-of-college";
const shareText = `A Game of College: Can you get into college and finish a degree without taking on too much debt? via @hechingerreport ${url}`;

const twitterParams = new URLSearchParams({
  text: shareText,
});
const redditParams = new URLSearchParams({
  url,
  title: shareText,
});
const facebookParams = new URLSearchParams({
  u: url,
  src: "sdkpreparse",
});

export default function Title() {
  const gtag = useGtag();

  return (
    <section id="goc-title-container">
      <div data-role="title">
        <div data-role="social">
          <a
            onClick={() => gtag("event", "engagement", {
              "event_category": "A Game of College",
              "event_label": "shared twitter",
            })}
            target="_blank"
            data-role="twitter"
            href={`https://twitter.com/intent/tweet?${twitterParams}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
            >
              <path
                className="st0"
                d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80C448 53.5 426.5 32 400 32zM351.1 190.8c0.2 2.8 0.2 5.7 0.2 8.5 0 86.7-66 186.6-186.6 186.6 -37.2 0-71.7-10.8-100.7-29.4 5.3 0.6 10.4 0.8 15.8 0.8 30.7 0 58.9-10.4 81.4-28 -28.8-0.6-53-19.5-61.3-45.5 10.1 1.5 19.2 1.5 29.6-1.2 -30-6.1-52.5-32.5-52.5-64.4v-0.8c8.7 4.9 18.9 7.9 29.6 8.3 -18.3-12.2-29.2-32.7-29.2-54.6 0-12.2 3.2-23.4 8.9-33.1 32.3 39.8 80.8 65.8 135.2 68.6 -9.3-44.5 24-80.6 64-80.6 18.9 0 35.9 7.9 47.9 20.7 14.8-2.8 29-8.3 41.6-15.8 -4.9 15.2-15.2 28-28.8 36.1 13.2-1.4 26-5.1 37.8-10.2C375.1 169.9 363.9 181.5 351.1 190.8z"
              />
            </svg>
          </a>
          <a
            onClick={() => gtag("event", "engagement", {
              "event_category": "A Game of College",
              "event_label": "shared reddit",
            })}
            target="_blank"
            data-role="reddit"
            href={`http://www.reddit.com/submit?${redditParams}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
            >
              <path
                className="st0"
                d="M283.2 345.5c2.7 2.7 2.7 6.8 0 9.2 -24.5 24.5-93.8 24.6-118.4 0 -2.7-2.4-2.7-6.5 0-9.2 2.4-2.4 6.5-2.4 8.9 0 18.7 19.2 81 19.6 100.5 0C276.6 343.2 280.8 343.2 283.2 345.5zM191.9 291.7c0-14.9-11.9-26.8-26.5-26.8 -14.9 0-26.8 11.9-26.8 26.8 0 14.6 11.9 26.5 26.8 26.5C180 318.2 191.9 306.3 191.9 291.7zM282.6 264.9c-14.6 0-26.5 11.9-26.5 26.8 0 14.6 11.9 26.5 26.5 26.5 14.9 0 26.8-11.9 26.8-26.5C309.4 276.8 297.5 264.9 282.6 264.9zM448 80v352c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V80c0-26.5 21.5-48 48-48h352C426.5 32 448 53.5 448 80zM348.3 220.6c-10.1 0-19 4.2-25.6 10.7 -24.1-16.7-56.5-27.4-92.5-28.6l18.7-84.2 59.5 13.4c0 14.6 11.9 26.5 26.5 26.5 14.9 0 26.8-12.2 26.8-26.8s-11.9-26.8-26.8-26.8c-10.4 0-19.3 6.2-23.8 14.9l-65.7-14.6c-3.3-0.9-6.5 1.5-7.4 4.8l-20.5 92.8c-35.7 1.5-67.8 12.2-91.9 28.9 -6.5-6.8-15.8-11-25.9-11 -37.5 0-49.8 50.4-15.5 67.5 -1.2 5.4-1.8 11-1.8 16.7 0 56.5 63.7 102.3 141.9 102.3 78.5 0 142.2-45.8 142.2-102.3 0-5.7-0.6-11.6-2.1-17C398 270.6 385.6 220.6 348.3 220.6L348.3 220.6z"
              />
            </svg>
          </a>
          <a
            onClick={() => gtag("event", "engagement", {
              "event_category": "A Game of College",
              "event_label": "shared facebook",
            })}
            target="_blank"
            data-role="facebook"
            href={`https://www.facebook.com/sharer.php?${facebookParams}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
            >
              <path
                className="st0"
                d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h137.3V327.7h-63V256h63v-54.6c0-62.2 37-96.5 93.7-96.5 27.1 0 55.5 4.8 55.5 4.8v61h-31.3c-30.8 0-40.4 19.1-40.4 38.7V256h68.8l-11 71.7h-57.8V480H400c26.5 0 48-21.5 48-48V80C448 53.5 426.5 32 400 32z"
              />
            </svg>
          </a>
        </div>

        <h1>A Game of College</h1>

        <h4>
          Can you get into college, finish a bachelor’s degree and avoid taking on too much debt? Play along and find out.
        </h4>

        <div className="goc-button">
          Click/Tap to Continue
        </div>

        <div data-role="credits">
          <p>
            Reporting by Delece Smith-Barrow, Felicia Mello and Jon Marcus. Illustrations by Josh Kramer. Design and development by John Osborn D’Agostino.
          </p>
        </div>
      </div>
    </section>
  );
}
