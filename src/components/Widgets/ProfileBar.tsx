import React, { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import UserDuotone from "../Icons/UserDuotone";
import NotebookLight from "../Icons/NotebookLight";
import CouponLight from "../Icons/CouponLight";
import RefreshLight from "../Icons/RefreshLight";
import { useTranslation } from "next-i18next";

const ProfileBar = () => {
  const { i18n } = useTranslation();
  const router = useRouter();
  const pathname = router.pathname;

  const texts = useMemo(() => ({
    bookingHistory: i18n.language === "th" ? "ประวัติการจอง" : "Booking history",
    myCoupons: i18n.language === "th" ? "คูปองของฉัน" : "My coupons",
    profile: i18n.language === "th" ? "ข้อมูลส่วนตัว" : "Profile",
    resetPassword: i18n.language === "th" ? "รีเซ็ตรหัสผ่าน" : "Reset password",
  }), [i18n.language]);

  const navigationItems = useMemo(() => [
    {
      icon: <NotebookLight />,
      label: texts.bookingHistory,
      href: "/profiles/booking-history",
    },
    { icon: <CouponLight />, label: texts.myCoupons, href: "/profiles/my-coupon" },
    { icon: <UserDuotone />, label: texts.profile, href: "/profiles/profile" },
    {
      icon: <RefreshLight />,
      label: texts.resetPassword,
      href: "/profiles/reset-password",
    },
  ], [texts.bookingHistory, texts.myCoupons, texts.profile, texts.resetPassword]);

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
