import React from "react";

interface PlayProps {
  width?: string | number;
  height?: string | number;
  color?: string;
}

const Play: React.FC<PlayProps> = ({
  width = "24",
  height = "24",
  color = "white",
}) => {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<mask id="mask0_9697_27681" style={{maskType: "luminance"}} maskUnits="userSpaceOnUse" x="1" y="1" width="22" height="22">
<path d="M12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
<path d="M10 12V8.53601L13 10.268L16 12L13 13.732L10 15.464V12Z" fill="black" stroke="black" strokeWidth="2" strokeLinejoin="round"/>
</mask>
<g mask="url(#mask0_9697_27681)">
<path d="M0 0H24V24H0V0Z" fill="currentColor"/>
</g>
</svg>
  );
};

export default Play;
