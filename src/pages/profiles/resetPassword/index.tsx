import React from "react";
import NavBarWidget from "@/components/Widgets/NavBarWidget";
import ProfileBar from "@/components/Widgets/ProfileBar";
import ResetPassword from "@/components/Forms/ResetPassword";
const index = () => {
  return (
    <div className="bg-blue-b flex flex-col min-h-[100dvh]">
      <NavBarWidget />
      <div className="flex-1 top-21 transition-all duration-500 ease-in-out py-10 md:pl-20 md:py-15 xl:pl-56">
        <div className="w-full max-w-[1129px] flex flex-col md:flex-row h-full gap-4 md:gap-12">
          {/* ProfileBar */}
          <div className="w-full md:min-w-[240px] md:max-w-[257px]">
            <ProfileBar />
          </div>
          {/* Content - Full Width Container */}
          <div className="flex items-center px-4 justify-center md:justify-start md:items-start w-full max-w-[380px] md:min-w-[380px]">
            <ResetPassword align="left" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default index;
