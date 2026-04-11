import { useId, type SVGProps } from "react";

export function Logo({ className, ...props }: SVGProps<SVGSVGElement>) {
  const maskId = useId();

  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <defs>
        <mask id={maskId}>
          <rect width="100" height="100" fill="white" />
          {/* Negative Space K */}
          <rect x="28" y="25" width="12" height="50" fill="black" />
          <path d="M72 25L42 50H56L72 36V25Z" fill="black" />
          <path d="M72 75L42 50H56L72 64V75Z" fill="black" />
        </mask>
      </defs>
      
      {/* Solid Hexagon with mask */}
      <path
        d="M50 0L93.3 25V75L50 100L6.7 75V25L50 0Z"
        fill="currentColor"
        mask={`url(#${maskId})`}
      />
    </svg>
  );
}
