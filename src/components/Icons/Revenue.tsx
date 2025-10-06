import React from "react";

interface RevenueProps {
  width?: string | number;
  height?: string | number;
  color?: string;
}

const Revenue: React.FC<RevenueProps> = ({
  width = "24",
  height = "24",
  color = "white",
}) => {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0 6C0 4.34531 1.34531 3 3 3H21C22.6547 3 24 4.34531 24 6V18C24 19.6547 22.6547 21 21 21H3C1.34531 21 0 19.6547 0 18V6ZM4.5 14.625C4.5 15.2484 5.00156 15.75 5.625 15.75H12.375C12.9984 15.75 13.5 15.2484 13.5 14.625C13.5 14.0016 12.9984 13.5 12.375 13.5H5.625C5.00156 13.5 4.5 14.0016 4.5 14.625ZM5.625 8.25C5.00156 8.25 4.5 8.75156 4.5 9.375C4.5 9.99844 5.00156 10.5 5.625 10.5H18.375C18.9984 10.5 19.5 9.99844 19.5 9.375C19.5 8.75156 18.9984 8.25 18.375 8.25H5.625Z" fill={color}/>
</svg>
  );
};

export default Revenue;
