import React from "react";

interface BannerProps {
  width?: string | number;
  height?: string | number;
  color?: string;
}

const SuccessBooking: React.FC<BannerProps> = ({
  width = "80",
  height = "80",
  color = "white",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width={width} height={height} rx="40" fill="#00A372" />
      <path
        d="M26 44L33.2331 49.4248C33.6618 49.7463 34.2677 49.6728 34.607 49.2581L52 28"
        stroke={color}
        stroke-width="6"
        stroke-linecap="round"
      />
    </svg>
  );
};

export default SuccessBooking;
