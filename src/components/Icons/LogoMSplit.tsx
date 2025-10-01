import React from "react";

interface LogoMSplitProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  side?: "left" | "right";
}

const LogoMSplit: React.FC<LogoMSplitProps> = ({
  width = "42",
  height = "48",
  className,
  side = "left",
}) => {
  // แบ่ง logo เป็น 2 ส่วน - ซ้ายและขวา
  const leftPart = (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 42 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: "visible" }}
    >
      <defs>
        <clipPath id="clipLeft">
          <rect x="0" y="0" width="21" height="48" />
        </clipPath>
        <linearGradient
          id="paint0_linear_9148_12737"
          x1="21"
          y1="9.58618"
          x2="21"
          y2="46.2758"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#343897" />
          <stop offset="1" stopColor="#4E7BEE" />
        </linearGradient>
      </defs>
      
      {/* ส่วนซ้ายของ M */}
      <g clipPath="url(#clipLeft)">
        <path
          d="M30.5405 46.2758V22.3316H30.054L24.5946 46.2758H17.1351L11.6757 22.3316H11.1892V46.2758H2V9.58618H16L20.8648 31.0773H21.2973L26.054 9.58618H40V46.2758H30.5405Z"
          fill="url(#paint0_linear_9148_12737)"
        />
        <path
          d="M20.9981 1.72412L26.1047 9.58618H15.8915L20.9981 1.72412Z"
          fill="#4E7BEE"
        />
      </g>
    </svg>
  );

  const rightPart = (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 42 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: "visible" }}
    >
      <defs>
        <clipPath id="clipRight">
          <rect x="21" y="0" width="21" height="48" />
        </clipPath>
        <linearGradient
          id="paint0_linear_9148_12737"
          x1="21"
          y1="9.58618"
          x2="21"
          y2="46.2758"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#343897" />
          <stop offset="1" stopColor="#4E7BEE" />
        </linearGradient>
      </defs>
      
      {/* ส่วนขวาของ M */}
      <g clipPath="url(#clipRight)">
        <path
          d="M30.5405 46.2758V22.3316H30.054L24.5946 46.2758H17.1351L11.6757 22.3316H11.1892V46.2758H2V9.58618H16L20.8648 31.0773H21.2973L26.054 9.58618H40V46.2758H30.5405Z"
          fill="url(#paint0_linear_9148_12737)"
        />
        <path
          d="M20.9981 1.72412L26.1047 9.58618H15.8915L20.9981 1.72412Z"
          fill="#4E7BEE"
        />
      </g>
    </svg>
  );

  return side === "left" ? leftPart : rightPart;
};

export default LogoMSplit;
