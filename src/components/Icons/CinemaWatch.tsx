import React from "react";

interface CinemaWatchProps {
  width?: string | number;
  height?: string | number;
  color?: string;
}

const CinemaWatch: React.FC<CinemaWatchProps> = ({
  width = "24",
  height = "24",
  color = "white",
}) => {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6.86667 19H2.46667C2.07768 19 1.70463 18.7893 1.42958 18.4142C1.15452 18.0391 1 17.5304 1 17V6C1 5.46957 1.15452 4.96086 1.42958 4.58579C1.70463 4.21071 2.07768 4 2.46667 4H6.86667M14.9333 4H21.5333C21.9223 4 22.2954 4.21071 22.5704 4.58579C22.8455 4.96086 23 5.46957 23 6V17C23 17.5304 22.8455 18.0391 22.5704 18.4142C22.2954 18.7893 21.9223 19 21.5333 19H14.9333" stroke={color} strokeLinecap="round" strokeLinejoin="round"/>
<path d="M9.75 8.25V15.75L15.75 12L9.75 8.25Z" stroke={color} strokeLinecap="round" strokeLinejoin="round"/>
</svg>
  );
};

export default CinemaWatch;
