import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import ArrowDown from "../Icons/ArrowDown";
import Link from "next/link";
import { UserDataResponse } from "@/types/user";
import UserDuotone from "../Icons/UserDuotone";

interface AvatarDisplayProps {
  data?: UserDataResponse | null;
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
        <div className={"w-12 h-12 rounded-full overflow-hidden"}>
          {data?.avatar_url ? (
            <Image
              src={data.avatar_url}
              alt="avatar"
              className="object-cover object-center w-full h-full"
              width={48}
              height={48}
            />
          ) : (
            <UserDuotone width={48} height={48} />
          )}
        </div>
        <div className="flex flex-nowrap items-center gap-x-1.5 text-white">
          <span className=" max-w-[10ch] overflow-hidden whitespace-nowrap text-ellipsis">
            {data?.username}
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
          <Link href="/profiles/booking-history">
            <button className={btnProfileStyle}>
              {/* <UserBooking history /> */}
              Booking history
            </button>
          </Link>

          <Link href="/profiles/my-coupon">
            <button className={btnProfileStyle}>My Coupons</button>
          </Link>

          <Link href="/profiles/profile">
            <button className={btnProfileStyle}>
              {/* <UserIcon /> */}
              Profile
            </button>
          </Link>

          <Link href="/profiles/reset-password">
            <button className={btnProfileStyle}>
              {/* <ResetPasswordIcon /> */}
              Reset password
            </button>
          </Link>

          <Link href="/">
            <button onClick={onLogOut} className={btnProfileStyle}>
              {/* <SignOutIcon /> */}
              Log out
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};
