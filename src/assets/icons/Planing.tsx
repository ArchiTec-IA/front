import { type SVGProps } from "react";

export function PlaningIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={props.width ?? "13"}
      height={props.height ?? "8"}
      viewBox="0 0 13 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M7.875 0V0.875H10.7564L7 4.63138L5.12181 2.75319C5.03977 2.67117 4.92851 2.62509 4.8125 2.62509C4.69649 2.62509 4.58523 2.67117 4.50319 2.75319L0 7.25638L0.618625 7.875L4.8125 3.68112L6.69069 5.55931C6.77273 5.64133 6.88399 5.68741 7 5.68741C7.11601 5.68741 7.22727 5.64133 7.30931 5.55931L11.375 1.49362V4.375H12.25V0H7.875Z"
        fill="currentColor"
      />
    </svg>
  );
}
