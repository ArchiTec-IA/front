import type { SVGProps } from "react";

export const Quio = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width={props.width ?? "294"}
      height={props.height ?? "135"}
      viewBox="0 0 294 135"
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
      <path
        d="M120 34V92C125.667 101.333 143.4 113.3 169 86.5V34V92C169.167 95.3333 171.1 103.5 177.5 109.5"
        stroke="currentColor"
        strokeWidth="10"
      />
      <path d="M200.5 32.5V108.5" stroke="currentColor" strokeWidth="10" />
      <circle
        cx="202"
        cy="9"
        r="8.5"
        fill="currentColor"
        stroke="currentColor"
      />
      <ellipse
        cx="256"
        cy="70"
        rx="33"
        ry="37"
        stroke="currentColor"
        strokeWidth="10"
      />
    </svg>
  );
};
