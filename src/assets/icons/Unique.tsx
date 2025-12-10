import type { SVGProps } from "react";

export const Unique = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width={props.width ?? "44"}
      height={props.height ?? "52"}
      viewBox="0 0 44 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M14.125 28.5H29.875M14.125 38.5H22M1 6V46C1 47.3261 1.55312 48.5979 2.53769 49.5355C3.52226 50.4732 4.85761 51 6.25 51H37.75C39.1424 51 40.4777 50.4732 41.4623 49.5355C42.4469 48.5979 43 47.3261 43 46V16.855C42.9999 16.1889 42.8601 15.5295 42.5887 14.9156C42.3173 14.3017 41.9199 13.7456 41.4198 13.28L29.7648 2.425C28.7839 1.51164 27.4668 1.00016 26.095 1H6.25C4.85761 1 3.52226 1.52678 2.53769 2.46447C1.55312 3.40215 1 4.67392 1 6Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M27.25 1V11C27.25 12.3261 27.8031 13.5979 28.7877 14.5355C29.7723 15.4732 31.1076 16 32.5 16H43"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
};
