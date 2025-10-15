import React from "react";

interface PinFillProps {
  width?: string | number;
  height?: string | number;
  color?: string;
}

const LocationPopupIcon: React.FC<PinFillProps> = ({
  width = "28",
  height = "28",
  color = "#C6C6CC",
}) => {
  return (
    <svg
      color={color}
      width={width}
      height={height}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_9156_24482)">
        <path
          d="M13.9999 2.33325C9.48492 2.33325 5.83325 5.98492 5.83325 10.4999C5.83325 16.6249 13.9999 25.6666 13.9999 25.6666C13.9999 25.6666 22.1666 16.6249 22.1666 10.4999C22.1666 5.98492 18.5149 2.33325 13.9999 2.33325ZM8.16659 10.4999C8.16659 7.27992 10.7799 4.66659 13.9999 4.66659C17.2199 4.66659 19.8333 7.27992 19.8333 10.4999C19.8333 13.8599 16.4733 18.8883 13.9999 22.0266C11.5733 18.9116 8.16659 13.8249 8.16659 10.4999Z"
          fill="currentColor"
        />
        <path
          d="M13.9999 13.4166C15.6107 13.4166 16.9166 12.1107 16.9166 10.4999C16.9166 8.88909 15.6107 7.58325 13.9999 7.58325C12.3891 7.58325 11.0833 8.88909 11.0833 10.4999C11.0833 12.1107 12.3891 13.4166 13.9999 13.4166Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_9156_24482">
          <rect width="28" height="28" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default LocationPopupIcon;
