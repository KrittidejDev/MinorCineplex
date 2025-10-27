import React, { useState, useRef, ChangeEvent } from "react";
import UserDuotone from "../Icons/UserDuotone";
import Image from "next/image";

interface ImageUploadButtonProps {
  onFileSelect: (file: File) => void;
  avatar_url: string | null;
}


const ImageUploadButton: React.FC<ImageUploadButtonProps> = ({
  onFileSelect,
  avatar_url,
}) => {
const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      onFileSelect(file);

      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClick = (): void => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex items-center justify-center ">
      <div className="relative flex flex-row items-end gap-5 ">
        <div
          onClick={handleClick}
          className="w-32 h-32 rounded-full overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {selectedImage ? (
            <div className="relative w-full h-full">
              <Image
                src={selectedImage}
                alt="Profile"
                fill
                sizes="100px"
                className="object-cover rounded"
              />
            </div>
          ) : avatar_url ? (
            <div className="relative w-full h-full">
              <Image
                src={avatar_url}
                alt="Profile"
                sizes="100px"
                fill
                className="object-cover rounded"
              />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#565F7E]">
              <UserDuotone width={50} height={50} color="#8B93B0" />            
            </div>
          )}
        </div>
        <div
          className="hover:underline cursor-pointer border rounded-sm px-4 py-2 border-white text-white transition-all duration-200 hover:bg-gray-g63f hover:text-white"
          onClick={handleClick}
        >
          Upload picture
        </div>
      </div>
    </div>
  );
};

export default ImageUploadButton;
