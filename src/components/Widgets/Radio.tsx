import React from "react";

// Radio component interface
interface RadioProps {
  name: string;
  value: string;
  label: string;
  checked?: boolean;
  disabled?: boolean;
  onChange?: (value: string) => void;
  className?: string;
}

const Radio: React.FC<RadioProps> = ({
  name,
  value,
  label,
  checked = false,
  disabled = false,
  onChange,
  className = ""
}) => {
  const handleChange = () => {
    if (!disabled && onChange) {
      onChange(value);
    }
  };

  // Base styles for radio container
  const containerStyles = `
    inline-flex justify-start items-center gap-2
    ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:opacity-80"}
    ${className}
  `;

  // Radio button styles based on state
  const getRadioStyles = () => {
    if (disabled) {
      return `
        w-5 h-5 relative rounded-[30px] 
        border border-gray-gf7e
      `;
    }
    
    if (checked) {
      return `
        w-5 h-5 relative rounded-3xl 
        outline outline-[3px] outline-offset-[-3px] outline-blue-bbee
      `;
    }
    
    return `
      w-5 h-5 relative rounded-[30px] 
      border border-gray-g3b0
    `;
  };

  // Label styles based on state
  const getLabelStyles = () => {
    if (disabled) {
      return `
        justify-start text-gray-gf7e text-base font-normal 
      `;
    }
    
    if (checked) {
      return `
        justify-start text-white-wfff text-base font-normal 
      `;
    }
    
    return `
      justify-start text-gray-gedd text-base font-normal 
    `;
  };

  return (
    <div className={containerStyles} onClick={handleChange}>
      <div className={getRadioStyles()}>
        {checked && (
          <div className="w-2.5 h-2.5 left-[5px] top-[5px] absolute bg-blue-bbee rounded-full"></div>
        )}
      </div>
      <div className={getLabelStyles()}>
        {label}
      </div>
    </div>
  );
};

export default Radio;
