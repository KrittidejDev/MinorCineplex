import { useState } from "react";

import LogoM from "../Icons/LogoM";

function AdminSidebar() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const tabs = [
    "dashboard",
    "cinemas",
    "hall",
    "movies",
    "time slot",
    "showtimes",
    "trailers",
    "banner",
    "coupon",
  ];

  return (
    <>
      <div className="h-full bg-gray-gc1b flex flex-col py-[50px] px-[72px]">
        <div className="flex">
          <div className="mt-1 pr-2.5 border-r">
            <LogoM />
          </div>
          <h2 className="font-bold text-[44px] text-white-wfff pl-2.5">
            Admin
          </h2>
        </div>

        <div className="flex flex-col gap-2 mt-[30px]">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-4 cursor-pointer ${activeTab === tab ? "bg-gray-g63f rounded-sm" : ""}`}
            >
              <p className={`font-bold ${activeTab === tab ? "text-white-wfff" : "text-gray-gedd"}`}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </p>
            </button>
          ))}
        </div>

        <button className="py-3 px-4 mt-2 cursor-pointer">
          <p className="font-bold text-gray-gedd">Logout</p>
        </button>
      </div>
    </>
  );
}

export default AdminSidebar;
