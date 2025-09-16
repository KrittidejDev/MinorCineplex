import React from "react";
import { Textarea } from "../ui/textarea";
import cx from "classnames";

const InputTextArea = ({
  placeholder,
  value,
  onChange,
  errors,
  disabled,
  label,
  require,
  maxLength,
  height = "144px",
  ...props
}) => {
  return (
    <div className="flex flex-col flex-1 relative max-w-full">
      {label && (
        <div className="text-b1 text-brown-16b!">
          {label} {require && <span className="text-red">*</span>}
        </div>
      )}
      <Textarea
        {...props}
        maxLength={maxLength}
        placeholder={placeholder}
        value={value ?? ""}
        onChange={onChange}
        disabled={disabled}
        style={{ height }}
        className={cx(
          `bg-white! border rounded-md px-3 py-2  `,
          errors
            ? "border-red! text-red! placeholder-red!"
            : "border-gray-300 text-black placeholder-gray-400"
        )}
      />
      {errors && <span className="text-b2 text-red-500! mt-1">{errors}</span>}
    </div>
  );
};

export default InputTextArea;
