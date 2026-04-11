import { useId, type SVGProps } from "react";

export function LogoWordmarkLight({ className, ...props }: SVGProps<SVGSVGElement>) {
  const maskId = useId();

  return (
    <svg
      viewBox="0 0 180 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <defs>
        <mask id={maskId}>
          <rect width="180" height="40" fill="white" />
          <g transform="translate(0, 0) scale(0.4)">
            {/* Negative Space K - inverted colors for dark bg */}
            <rect x="28" y="25" width="12" height="50" fill="black" />
            <path d="M72 25L42 50H56L72 36V25Z" fill="black" />
            <path d="M72 75L42 50H56L72 64V75Z" fill="black" />
          </g>
        </mask>
      </defs>

      <g transform="translate(0, 0) scale(0.4)">
        <path
          d="M50 0L93.3 25V75L50 100L6.7 75V25L50 0Z"
          fill="currentColor"
          mask={`url(#${maskId})`}
        />
      </g>
      
      <text
        x="48"
        y="28"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize="22"
        fontWeight="600"
        fill="currentColor"
        letterSpacing="-0.5"
      >
        REOZA
      </text>
    </svg>
  );
}
