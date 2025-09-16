import React from "react";
import { Input } from "../ui/input";
import { IoSearchOutline } from "react-icons/io5";
import { useState } from "react";
import { useEffect } from "react";

const InputSearch = ({
  placeholder,
  handleSearch,
  iconLeft,
  value,
  delay = 500,
}) => {
  const [_value, _setValue] = useState(value);

  const _handleChange = (e) => {
    _setValue(e.target.value);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      handleSearch?.(_value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [_value, delay, handleSearch]);

  return (
    <div className="flex flex-1 relative">
      <Input
        type={"text"}
        placeholder={placeholder}
        value={_value}
        onChange={_handleChange}
        className={`bg-white! ${iconLeft && "pl-8"}`}
      />
      <IoSearchOutline
        className={`absolute top-2.5 ${iconLeft ? "left-2.5" : "right-2.5 "}`}
        color="#75716B"
      />
    </div>
  );
};

export default InputSearch;
