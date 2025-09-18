import React from "react";

interface TabProps {
  text?: string;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

const Tab: React.FC<TabProps> = ({
  text = "Inactive Label",
  isActive = false,
  onClick,
  className = "",
}) => {
  return (
    <button
      className={`
        relative
        transition-all duration-200
        ${isActive 
          ? "text-white-wfff" 
          : "text-gray-g3b0 hover:text-white-wfff"
        }
        ${onClick ? "cursor-pointer" : ""}
        ${className}
      `}
      onClick={onClick}
    >
      <span className="text-f-24 font-bold">
        {text}
      </span>
      {/* Underline */}
      <div 
        className={`
          absolute bottom-0 left-0 h-0.5 w-full
          transition-all duration-200
          ${isActive ? "bg-white-wfff" : "bg-transparent hover:bg-white-wfff"}
        `}
      />
    </button>
  );
};

export default Tab;
