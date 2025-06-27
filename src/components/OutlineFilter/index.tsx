"use client";

import { useId } from "react";

export default function OutlineFilter(props: {
  color?: string;
  radius?: number;
  opacity?: number;
  children?: React.ReactNode;
}) {
  const {
    color = "white",
    radius = 1,
    opacity = 1,
    children,
  } = props;

  const id = useId();
  const svgId = `outline-filter-${id}`;

  return (
    <span style={{ filter: `url(#${svgId})` }}>
      <svg
        version="1.1"
        xmlns="//www.w3.org/2000/svg"
        xmlnsXlink="//www.w3.org/1999/xlink"
        style={{
          height: 0,
          width: 0,
          position: 'absolute',
        }}
        role="presentation"
      >
        <defs>
          <filter id={svgId}>
            <feMorphology
              in="SourceAlpha"
              result="DILATED"
              operator="dilate"
              radius={radius}
            />
            <feFlood
              floodColor={color}
              floodOpacity={opacity}
              result="FLOOD"
            />
            <feComposite
              in="FLOOD"
              in2="DILATED"
              operator="in"
              result="OUTLINE"
            />
            <feMerge>
              <feMergeNode in="OUTLINE" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
      {children}
    </span>
  );
}
