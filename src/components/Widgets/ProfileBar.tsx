import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const ProfileBar = () => {
  const router = useRouter();
  const pathname = router.pathname; // path ปัจจุบัน เช่น "/profiles/profile"

  const navigationItems = [
    { label: "Booking history", href: "/profiles/bookingHistory" },
    { label: "My coupons", href: "/profiles/myCoupon" },
    { label: "Profile", href: "/profiles/profile" },
    { label: "Reset password", href: "/profiles/resetPassword" },
    { label: "Log out", href: "/" },
  ];

  return (
    <div className="w-64 h-screen bg-gray-100 p-4 border-r border-gray-300">
      <nav className="space-y-2">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`block w-full px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                isActive
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 hover:bg-blue-100 hover:text-gray-900"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default ProfileBar;
