import type { SVGProps } from "react";

export function QuioLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={props.width || "15"}
      height={props.height || "20"}
      viewBox="0 0 15 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <ellipse
        cx="7"
        cy="7.53333"
        rx="6"
        ry="6.53333"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M3.39999 16.8C4.57777 16.5111 7.93333 17.1333 8.8 17.8C9.66666 18.4667 12.1333 18.7067 14 18.6"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}
