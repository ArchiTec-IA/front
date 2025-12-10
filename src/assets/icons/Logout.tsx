import type { SVGProps } from "react";

export function LogoutIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={props.width ?? "17"}
      height={props.height ?? "15"}
      viewBox="0 0 17 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12.6389 11L15.75 8M15.75 8L12.6389 5M15.75 8H4.86111M9.52778 11V11.75C9.52778 12.3467 9.28195 12.919 8.84436 13.341C8.40678 13.7629 7.81328 14 7.19444 14H4.08333C3.46449 14 2.871 13.7629 2.43342 13.341C1.99583 12.919 1.75 12.3467 1.75 11.75V4.25C1.75 3.65326 1.99583 3.08097 2.43342 2.65901C2.871 2.23705 3.46449 2 4.08333 2H7.19444C7.81328 2 8.40678 2.23705 8.84436 2.65901C9.28195 3.08097 9.52778 3.65326 9.52778 4.25V5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
