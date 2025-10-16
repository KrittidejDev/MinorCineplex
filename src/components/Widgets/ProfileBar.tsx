import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import UserDuotone from "../Icons/UserDuotone";
import NotebookLight from "../Icons/NotebookLight";
import CouponLight from "../Icons/CouponLight";
import RefreshLight from "../Icons/RefreshLight";

const ProfileBar = () => {
  const router = useRouter();
  const pathname = router.pathname;

  const navigationItems = [
    {
      icon: <NotebookLight />,
      label: "Booking history",
      href: "/profiles/booking-history",
    },
    { icon: <CouponLight />, label: "My coupons", href: "/profiles/my-coupon" },
    { icon: <UserDuotone />, label: "Profile", href: "/profiles/profile" },
    {
      icon: <RefreshLight />,
      label: "Reset password",
      href: "/profiles/reset-password",
    },
  ];

  return (
    <div className="flex flex-col bg-[#070C1B] p-2 md:p-4 rounded-[8px] w-full">
      <nav
        className="
          flex flex-row md:flex-col 
          overflow-auto md:overflow-visible 
          whitespace-nowrap md:whitespace-normal
          w-full md:w-auto gap-2
          scrollbar-hide
        "
      >
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center justify-center md:justify-start
                px-4 md:px-6 py-2 md:py-3 rounded-[6px] transition-colors cursor-pointer gap-2
                flex-shrink-0
                ${
                  isActive
                    ? "bg-[#21263F] text-white"
                    : "text-slate-300 hover:bg-[#21263F] hover:text-white"
                }`}
            >
              {item.icon}
              <span className="text-sm md:text-base">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default ProfileBar;
