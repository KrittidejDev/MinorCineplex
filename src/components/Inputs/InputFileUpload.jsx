import React, { useState } from "react";
import { clsx } from "clsx";
import AdminProfile from "../Icons/AdminProfile";
import { useEffect } from "react";
import Image from "../Icons/Image";

const InputFileUpload = ({
  initialPreview,
  onChange,
  disabled,
  label,
  require,
  isArticle,
  ...props
}) => {
  const [preview, setPreview] = useState(initialPreview);

  useEffect(() => {
    setPreview(initialPreview);
  }, [initialPreview]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);

      if (onChange) onChange(file);
    }
  };

  return (
    <div
      className={`flex gap-x-7 relative ${
        isArticle ? "items-end " : "items-center"
      }`}
    >
      <div>
        {isArticle && (
          <div className="text-b1 text-brown-16b! mb-4">Thumbnail image</div>
        )}
        {preview ? (
          <img
            src={preview}
            alt="preview"
            className={` object-cover  border shadow-md overflow-hidden ${
              isArticle
                ? "w-[480px] h-[260px] rounded-2xl"
                : "size-[120px] rounded-full"
            }`}
          />
        ) : (
          <div
            className={` flex items-center justify-center object-cover border shadow-md overflow-hidden ${
              isArticle
                ? "w-[480px] h-[260px] rounded-2xl"
                : "size-[120px] rounded-full"
            }`}
          >
            {isArticle ? (
              <Image width="60" height="60" />
            ) : (
              <AdminProfile width="60" height="60" />
            )}
          </div>
        )}
      </div>

      <input
        {...props}
        type="file"
        accept="image/*"
        id="file-upload"
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled}
      />

      <label
        htmlFor="file-upload"
        className={clsx(
          "cursor-pointer px-10 py-3 rounded-4xl bg-white font-medium text-brown-31e border border-brown-16b hover:bg-brown-16b hover:text-white transition",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        {label || "Upload Image"}{" "}
        {require && <span className="text-red">*</span>}
      </label>
    </div>
  );
};

export default InputFileUpload;
