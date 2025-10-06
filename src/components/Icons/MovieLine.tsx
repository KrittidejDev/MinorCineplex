import React from "react";

interface MovieLineProps {
  width?: string | number;
  height?: string | number;
  color?: string;
}

const MovieLine: React.FC<MovieLineProps> = ({
  width = "24",
  height = "24",
  color = "white",
}) => {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M15 9L17 3M7 9L9 3M1 9H23M3.4 3H20.6C20.9152 3 21.2273 3.06208 21.5184 3.18269C21.8096 3.3033 22.0742 3.48008 22.2971 3.70294C22.5199 3.9258 22.6967 4.19038 22.8173 4.48156C22.9379 4.77274 23 5.08483 23 5.4V18.6C23 19.2365 22.7471 19.847 22.2971 20.2971C21.847 20.7471 21.2365 21 20.6 21H3.4C2.76348 21 2.15303 20.7471 1.70294 20.2971C1.25286 19.847 1 19.2365 1 18.6V5.4C1 5.08483 1.06208 4.77274 1.18269 4.48156C1.3033 4.19038 1.48008 3.9258 1.70294 3.70294C2.15303 3.25286 2.76348 3 3.4 3Z" stroke={color} strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
  );
};

export default MovieLine;
