import React from "react";

interface UploadFileProps {
  width?: string | number;
  height?: string | number;
  color?: string;
}

const UploadFile: React.FC<UploadFileProps> = ({
  width = "24",
  height = "24",
  color = "white",
}) => {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11 19H13V14.825L14.6 16.425L16 15L12 11L8 15L9.425 16.4L11 14.825V19ZM6 22C5.45 22 4.97933 21.8043 4.588 21.413C4.19667 21.0217 4.00067 20.5507 4 20V4C4 3.45 4.196 2.97933 4.588 2.588C4.98 2.19667 5.45067 2.00067 6 2H14L20 8V20C20 20.55 19.8043 21.021 19.413 21.413C19.0217 21.805 18.5507 22.0007 18 22H6ZM13 9H18L13 4V9Z" fill={color}/>
</svg>
  );
};

export default UploadFile;
