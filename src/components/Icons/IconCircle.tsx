import React from "react";

interface IconCircleProps {
  icon: React.ComponentType<{
    width?: string | number;
    height?: string | number;
    color?: string;
  }>;
  size?: number;
  backgroundColor?: string;
  iconColor?: string;
  iconSize?: number;
  className?: string;
  onClick?: () => void;
}

const IconCircle: React.FC<IconCircleProps> = ({
  icon: IconComponent,
  size = 52,
  backgroundColor = "bg-gray-g63f",
  iconColor = "#4E7BEE",
  iconSize = 30,
  className = "",
  onClick,
}) => {
  return (
    <div
      className={`
        flex items-center justify-center 
        rounded-full 
        ${backgroundColor}
        ${onClick ? "cursor-pointer hover:opacity-80 transition-opacity" : ""}
        ${className}
      `}
      style={{ width: size, height: size }}
      onClick={onClick}
    >
      <IconComponent
        width={iconSize}
        height={iconSize}
        color={iconColor}
      />
    </div>
  );
};

export default IconCircle;
