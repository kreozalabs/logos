import * as React from "react";
import type { SVGProps } from "react";
export const Logo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 100 100"
    {...props}
  >
    <path fill="currentColor" d="m50 0 43.3 25v50L50 100 6.7 75V25z" />
    <path
      fill="#fff"
      d="M28 25h12v50H28zM72 25 42 50h14l16-14zM72 75 42 50h14l16 14z"
    />
  </svg>
);
