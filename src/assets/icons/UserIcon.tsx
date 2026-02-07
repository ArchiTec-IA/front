import type { SVGProps } from "react";

export function UserIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={props.width || "456"}
      height={props.height || "456"}
      viewBox="0 0 456 456"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M228 190C269.974 190 304 155.974 304 114C304 72.0264 269.974 38 228 38C186.026 38 152 72.0264 152 114C152 155.974 186.026 190 228 190Z"
        fill="currentColor"
      />
      <path
        d="M228 399C301.454 399 361 364.974 361 323C361 281.026 301.454 247 228 247C154.546 247 95 281.026 95 323C95 364.974 154.546 399 228 399Z"
        fill="currentColor"
      />
    </svg>
  );
}
