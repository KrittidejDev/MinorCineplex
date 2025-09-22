import React, { useState, useRef, ChangeEvent } from 'react'
import { User, Camera } from 'lucide-react'
import UserDuotone from '../Icons/UserDuotone'

const ImageUploadButton: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e: ProgressEvent<FileReader>) => {
        setSelectedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleClick = (): void => {
    fileInputRef.current?.click()
  }

  return (
    <div className="flex items-center justify-center ">
      <div className="relative flex flex-row items-end gap-5 ">
        <div
          onClick={handleClick}
          className="w-32 h-32 rounded-full bg-gray-500 overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {selectedImage ? (
            <img
              src={selectedImage}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#565F7E]">
              <UserDuotone width={50} height={50} color="#8B93B0" />
            </div>
          )}
        </div>
        <div className="hover:underline cursor-pointer" onClick={handleClick}>
          Upload
        </div>
      </div>
    </div>
  )
}

export default ImageUploadButton
