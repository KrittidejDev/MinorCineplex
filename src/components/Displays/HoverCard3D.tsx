import { Tilt3DOptions, use3DTilt } from "@/lib/hooks/use3DTilt";
import React, { CSSProperties } from "react";

interface HoverCard3DProps {
  children: React.ReactNode;
  className?: string;
  options?: Tilt3DOptions;
  style?: CSSProperties;
}

export const HoverCard3D: React.FC<HoverCard3DProps> = ({
  children,
  className = "",
  options = {},
  style = {},
}) => {
  const tilt = use3DTilt(options);

  return (
    <div
      ref={tilt.ref}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      style={{
        ...tilt.style,
        transformStyle: "preserve-3d",
        ...style,
      }}
      className={className}
    >
      {children}
    </div>
  );
};
