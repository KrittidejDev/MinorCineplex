import React from "react";

interface HallProps {
  width?: string | number;
  height?: string | number;
  color?: string;
}

const Hall: React.FC<HallProps> = ({
  width = "24",
  height = "24",
  color = "white",
}) => {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clipPath="url(#clip0_9521_21291)">
<path d="M1.21191 23.0365H23.0691M6.61706 9.74911L12.1405 5.41197L17.6639 9.74911M2.77363 13.3885V23.0365M21.5073 13.3885V23.0314M1.21191 13.3885H23.0691M12.1405 5.41025V1.1554H14.2833M7.45706 13.3937H16.8239V23.0365H7.45706V13.3937ZM5.55077 9.75082H18.7302V13.3868H5.55077V9.75082Z" stroke={color} strokeLinecap="round" strokeLinejoin="round"/>
<path d="M10.4482 19.2051C10.4482 18.9956 10.4895 18.7882 10.5698 18.5946C10.65 18.4011 10.7676 18.2253 10.9158 18.0772C11.064 17.9291 11.24 17.8117 11.4336 17.7317C11.6272 17.6517 11.8347 17.6106 12.0442 17.6108C12.2538 17.6106 12.4613 17.6517 12.6549 17.7317C12.8485 17.8117 13.0245 17.9291 13.1727 18.0772C13.3209 18.2253 13.4385 18.4011 13.5187 18.5946C13.5989 18.7882 13.6402 18.9956 13.6402 19.2051V23.0366H10.4482V19.2051Z" stroke={color} strokeLinecap="round" strokeLinejoin="round"/>
</g>
<defs>
<clipPath id="clip0_9521_21291">
<rect width={width} height={height} fill={color}/>
</clipPath>
</defs>
</svg>
  );
};

export default Hall;
