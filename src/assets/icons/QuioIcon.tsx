import type { SVGProps } from "react";

export function QuioIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={props.width ?? "103"}
      height={props.height ?? "135"}
      viewBox="0 0 103 135"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <ellipse
        cx="50"
        cy="54"
        rx="45"
        ry="49"
        stroke="currentColor"
        strokeWidth="10"
      />
      <path
        d="M23 116C31.8333 113.834 57 118.5 63.5 123.5C70 128.5 88.5 130.3 102.5 129.5"
        stroke="currentColor"
        strokeWidth="10"
      />
    </svg>
  );
}
