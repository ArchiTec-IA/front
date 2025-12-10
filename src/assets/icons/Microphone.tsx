import type { SVGProps } from "react";

export const Microphone = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width={props.width ?? "16"}
      height={props.height ?? "20"}
      viewBox="0 0 16 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M10.75 3.75C10.75 2.09315 9.40685 0.75 7.75 0.75C6.09315 0.75 4.75 2.09315 4.75 3.75V8.75C4.75 10.4069 6.09315 11.75 7.75 11.75C9.40685 11.75 10.75 10.4069 10.75 8.75V3.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.75 8.75C14.75 9.66925 14.5689 10.5795 14.2172 11.4288C13.8654 12.2781 13.3498 13.0497 12.6997 13.6997C12.0497 14.3498 11.2781 14.8654 10.4288 15.2172C9.57951 15.5689 8.66925 15.75 7.75 15.75M7.75 15.75C6.83075 15.75 5.92049 15.5689 5.07122 15.2172C4.22194 14.8654 3.45026 14.3498 2.80025 13.6997C2.15024 13.0497 1.63463 12.2781 1.28284 11.4288C0.93106 10.5795 0.75 9.66925 0.75 8.75M7.75 15.75V18.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
