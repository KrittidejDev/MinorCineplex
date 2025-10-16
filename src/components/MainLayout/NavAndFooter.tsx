import React, { ReactNode } from "react";
import FooterWidget from "../Widgets/FooterWidget";
import NavBarWidget from "../Widgets/NavBarWidget";

const NavAndFooter = ({ children }: { children: ReactNode }) => {
  return (
    <div className="bg-blue-b flex flex-col min-h-[100dvh]">
      <NavBarWidget />
      <div className="flex flex-col items-center flex-1 w-full ">{children}</div>
      <FooterWidget />
    </div>
  );
};

export default NavAndFooter;
