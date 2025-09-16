import React from "react";
import { Input } from "../ui/input";
import cx from "classnames";

const InputTextFeild = ({
  placeholder,
  value,
  onChange,
  errors,
  disabled,
  label,
  require,
  type,
  ...props
}) => {
  return (
    <div className="flex flex-col flex-1 relative">
      {label && (
        <div className="text-b1 text-brown-16b!">
          {label} {require && <span className="text-red">*</span>}
        </div>
      )}
      <Input
        {...props}
        type={type}
        placeholder={placeholder}
        value={value ?? ""}
        onChange={onChange}
        disabled={disabled}
        className={cx(
          "bg-white! border rounded-md px-3 py-2",
          errors
            ? "border-red! text-red! placeholder-red!"
            : "border-gray-300 text-black placeholder-gray-400"
        )}
      />
      {errors && <span className="text-b2 text-red-500! mt-1">{errors}</span>}
    </div>
  );
};

export default InputTextFeild;
