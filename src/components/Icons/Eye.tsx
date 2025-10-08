import React from "react";

interface EyeProps {
  width?: string | number;
  height?: string | number;
  color?: string;
}

const Eye: React.FC<EyeProps> = ({
  width = "24",
  height = "24",
  color = "white",
}) => {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M3 12C3 12 6.27273 6 12 6C17.7273 6 21 12 21 12C21 12 17.7273 18 12 18C6.27273 18 3 12 3 12Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
  );
};

export default Eye;
