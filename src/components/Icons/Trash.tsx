import React from "react";

interface TrashProps {
  width?: string | number;
  height?: string | number;
  color?: string;
}

const Trash: React.FC<TrashProps> = ({
  width = "24",
  height = "24",
  color = "white",
}) => {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6 8H7.33333H18" stroke={color} strokeLinecap="round" strokeLinejoin="round"/>
<path d="M17 8V17.6C17 17.9713 16.8495 18.3274 16.5816 18.5899C16.3137 18.8525 15.9503 19 15.5714 19H8.42857C8.04969 19 7.68633 18.8525 7.41842 18.5899C7.15051 18.3274 7 17.9713 7 17.6V8M9.14286 7.8V6.4C9.14286 6.0287 9.29337 5.6726 9.56128 5.41005C9.82919 5.1475 10.1925 5 10.5714 5H13.4286C13.8075 5 14.1708 5.1475 14.4387 5.41005C14.7066 5.6726 14.8571 6.0287 14.8571 6.4V7.8" stroke={color} strokeLinecap="round" strokeLinejoin="round"/>
<path d="M11 11V16" stroke={color} strokeLinecap="round" strokeLinejoin="round"/>
<path d="M13 11V16" stroke={color} strokeLinecap="round" strokeLinejoin="round"/>
</svg>
  );
};

export default Trash;
