"use client";

import { useGtag } from "@/hooks/useGtag";
import hechLogo from "./Hechinger_logo_blk.png";
import cmLogo from "./CalMatters_logo.png";

export default function Header() {
  const gtag = useGtag();

  return (
    <header
      id="header"
      role="banner"
      className="no-select"
    >
      <div id="goc-logos">
        <div data-role="logo-one">
          <a
            href="https://calmatters.org"
            onClick={() => gtag("event", "engagement", {
              event_category: "A Game of College",
              event_action: "Button Click",
              event_label: "Header-CM",
            })}
          >
            <img
              className="logo"
              src={cmLogo.src}
              alt="ClaMatters logo"
            />
          </a>			
        </div>
        <div data-role="logo-two">
          <a
            href="https://hechingerreport.org/"
            onClick={() => gtag("event", "engagement", {
              event_category: "A Game of College",
              event_action: "Button Click",
              event_label: "Header-Hech",
            })}
          >
            <img
              className="logo"
              src={hechLogo.src}
              alt="The Hechinger Report logo"
            />
          </a>			
        </div>
      </div>
    </header>
  );
}
