import * as React from "react";
import type { SVGProps } from "react";
export const LogoWordmarkLight = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 200 40"
    {...props}
  >
    <path fill="#fafafa" d="m20 0 17.32 10v20L20 40 2.68 30V10z" />
    <path
      fill="currentColor"
      d="M11.2 10H16v20h-4.8zM28.8 10l-12 10h5.6l6.4-5.6zM28.8 30l-12-10h5.6l6.4 5.6z"
    />
    <text
      x={48}
      y={28}
      fill="#fafafa"
      fontFamily="Inter, system-ui, sans-serif"
      fontSize={22}
      fontWeight={600}
      letterSpacing={-0.5}
    >
      {"KREOZA"}
    </text>
  </svg>
);
