"use client";

import { usePathname } from "next/navigation";
import LogoM from "../Icons/LogoM";
import Dashboard from "../Icons/Dashboard";
import Cinema from "../Icons/Cinema";
import Hall from "../Icons/Hall";
import MovieLine from "../Icons/MovieLine";
import DateTime from "../Icons/DateTime";
import TimeLight from "../Icons/TimeLight";
import CinemaWatch from "../Icons/CinemaWatch";
import Banner from "../Icons/Banner";
import CouponLight from "../Icons/CouponLight";
import SignOutSquareLight from "../Icons/SignOutSquareLight";
import Link from "next/link";

function AdminSidebar() {
  const pathname = usePathname();

  const tabs = [
    { title: "dashboard", url: "/admin/dashboard", icon: <Dashboard width={24} height={24} /> },
    { title: "cinemas", url: "/admin/cinema", icon: <Cinema width={24} height={24} /> },
    { title: "hall", url: "/admin/hall", icon: <Hall width={24} height={24} /> },
    { title: "movies", url: "/admin/movie", icon: <MovieLine width={24} height={24} /> },
    { title: "time slot", url: "/admin/timeslot", icon: <DateTime width={24} height={24} /> },
    { title: "showtimes", url: "/admin/showtime", icon: <TimeLight width={24} height={24} /> },
    { title: "trailers", url: "/admin/trailer", icon: <CinemaWatch width={24} height={24} /> },
    { title: "banner", url: "/admin/banner", icon: <Banner width={24} height={24} /> },
    { title: "coupon", url: "/admin/coupon", icon: <CouponLight width={24} height={24} /> },
  ];

  return (
    <div className="h-dvh bg-gray-gc1b flex flex-col justify-between py-[50px] px-10">
      <div className="flex flex-col gap-[30px]">
        <div className="flex">
          <div className="mt-1 pr-2.5 border-r">
            <LogoM />
          </div>
          <h2 className="font-bold text-[44px] text-white-wfff pl-2.5">Admin</h2>
        </div>

        <div className="flex flex-col gap-2">
          {tabs.map((tab) => {
            const isActive =
              pathname === tab.url ||
              pathname.startsWith(`${tab.url}/`);

            return (
              <Link key={tab.title} href={tab.url}>
                <button
                  className={`flex gap-3 py-3 px-4 w-full text-left rounded-sm transition-colors cursor-pointer ${
                    isActive ? "bg-gray-g63f" : "hover:bg-gray-g63f/50"
                  }`}
                >
                  <span
                    className={`${
                      isActive ? "text-white-wfff" : "text-gray-gedd"
                    }`}
                  >
                    {tab.icon}
                  </span>
                  <span
                    className={`font-bold ${
                      isActive ? "text-white-wfff" : "text-gray-gedd"
                    }`}
                  >
                    {tab.title.charAt(0).toUpperCase() + tab.title.slice(1)}
                  </span>
                </button>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Logout */}
      <button className="flex gap-3 py-3 px-4 mt-2 cursor-pointer">
        <SignOutSquareLight />
        <p className="font-bold text-gray-gedd">Logout</p>
      </button>
    </div>
  );
}

export default AdminSidebar;
