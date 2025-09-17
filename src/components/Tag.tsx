import React from "react";

// Tag component interface
interface TagProps {
  name: string;
  className?: string;
  onClick?: () => void;
  variant?: "genre" | "language";
  fontSize?: "fr-12" | "fr-14" | "fm-12" | "fm-14" | "fr-16" | "fm-16";
}

const Tag: React.FC<TagProps> = ({ 
  name, 
  className = "", 
  onClick,
  variant = "genre",
  fontSize = "fr-14"
}) => {
  // Base styles according to the design specs
  const baseStyles = `
    inline-flex items-center justify-center
    px-3 py-1.5
    rounded
    select-none
  `;

  // Variant styles
  const variantStyles = {
    genre: `
      bg-gray-g63f
      text-gray-g3b0
    `,
    language: `
      bg-gray-g63f
      text-gray-gedd
    `
  };

  // Combine all styles
  const combinedStyles = `
    ${baseStyles}
    text-${fontSize}
    ${variantStyles[variant]}
    ${className}
  `.trim();

  return (
    <div
      className={combinedStyles}
      onClick={onClick}
    >
      {name}
    </div>
  );
};

export default Tag;
