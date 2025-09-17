import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import ArrowDown from "../Icons/ArrowDown";
// import UserIcon from "../Icons/UserIcon";
// import ResetPasswordIcon from "../Icons/ResetPasswordIcon";
// import SignOutIcon from "../Icons/SignOutIcon";
// import AdminBook from "../Icons/AdminBook";

interface AvatarDisplayProps {
  data?: {
    avatar?: { url?: string };
    username?: string;
    name?: string;
    role?: string;
  };
  className?: string;
  onLogOut?: () => void;
}

export const AvatarDisplay: React.FC<AvatarDisplayProps> = ({
  data,
  className,
  onLogOut,
}) => {
  const [_isOpen, _setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        _setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const _handleOpen = () => {
    _setIsOpen((prev) => !prev);
  };

  const _handleClickAdmin = () => {
    // router("/admin/article");
  };

  const btnProfileStyle =
    "flex items-center gap-x-2.5 py-3 px-4 w-full text-brown-03b! cursor-pointer hover:shadow-lg hover:bg-brown-6d1 text-left text-b1 hover:scale-105 transition";

  return (
    <div className={`${className} relative`} ref={dropdownRef}>
      <div className="flex items-center gap-x-2.5 " onClick={_handleOpen}>
        <div
          className={
            "w-12 h-12 rounded-full object-cover object-center overflow-hidden"
          }
        >
          <Image
            src={
              data?.avatar?.url ||
              //   `https://i.pravatar.cc/150?u=${data?.username}`
              `https://i.pravatar.cc/150?u=pk`
            }
            alt="avatar"
            width={48}
            height={48}
          />
        </div>
        <div className="flex flex-nowrap items-center gap-x-1.5 text-b1 text-brown-03b!">
          <span className=" max-w-[10ch] overflow-hidden whitespace-nowrap text-ellipsis">
            สุดหล่อ
          </span>
          <ArrowDown />
        </div>
      </div>
      {_isOpen && (
        <div
          className={`absolute flex flex-col w-62 bg-gray-g63f top-18 right-0 rounded-lg shadow-lg  overflow-hidden `}
          onMouseLeave={() => {
            timeoutRef.current = setTimeout(() => _setIsOpen(false), 1000);
          }}
          onMouseEnter={() => {
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }
          }}
        >
          {data?.role === "admin" && (
            <button className={btnProfileStyle} onClick={_handleClickAdmin}>
              {/* <AdminBook /> */}
              Dashboard
            </button>
          )}
          <button className={btnProfileStyle}>
            {/* <UserIcon /> */}
            Profile
          </button>
          <button className={btnProfileStyle}>
            {/* <ResetPasswordIcon /> */}
            Reset password
          </button>
          <button onClick={onLogOut} className={btnProfileStyle}>
            {/* <SignOutIcon /> */}
            Log out
          </button>
        </div>
      )}
    </div>
  );
};
