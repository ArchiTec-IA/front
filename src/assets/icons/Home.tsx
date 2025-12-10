import { type SVGProps } from "react";

export function HomeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={props.width ?? "14"}
      height={props.height ?? "14"}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M2.91667 7H1.75L7 1.75L12.25 7H11.0833M2.91667 7V11.0833C2.91667 11.3928 3.03958 11.6895 3.25838 11.9083C3.47717 12.1271 3.77391 12.25 4.08333 12.25H9.91667C10.2261 12.25 10.5228 12.1271 10.7416 11.9083C10.9604 11.6895 11.0833 11.3928 11.0833 11.0833V7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.25 12.25V8.74999C5.25 8.44058 5.37292 8.14383 5.59171 7.92504C5.8105 7.70624 6.10725 7.58333 6.41667 7.58333H7.58333C7.89275 7.58333 8.1895 7.70624 8.40829 7.92504C8.62708 8.14383 8.75 8.44058 8.75 8.74999V12.25"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
