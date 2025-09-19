import React from "react";

interface MenuLinkProps {
  icon: React.ComponentType<{
    width?: string | number;
    height?: string | number;
    color?: string;
  }>;
  text: string;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

const MenuLink: React.FC<MenuLinkProps> = ({
  icon: IconComponent,
  text,
  isActive = false,
  onClick,
  className = "",
}) => {
  return (
    <button
      className={`
        flex items-center gap-3 px-4 py-3 rounded-sm
        transition-all duration-200
        ${isActive 
          ? "bg-gray-g63f" 
          : "bg-gray-gc1b hover:bg-gray-g63f"
        }
        ${onClick ? "cursor-pointer" : ""}
        ${className}
      `}
      onClick={onClick}
    >
      <IconComponent
        width={20}
        height={20}
        color="#E0E0E0"
      />
      <span className="text-[#E0E0E0] text-fm-16">
        {text}
      </span>
    </button>
  );
};

export default MenuLink;
