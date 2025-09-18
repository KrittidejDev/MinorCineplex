import React, { ReactNode } from "react";
import FooterWidget from "../Widgets/FooterWidget";
import NavBarWidget from "../Widgets/NavBarWidget";

const NavAndFooter = ({ children }: { children: ReactNode }) => {
  return (
    <div className="bg-blue-b flex flex-col min-h-[100dvh]">
      <NavBarWidget />
      <div className="flex-1">{children}</div>
      <FooterWidget />
    </div>
  );
};

export default NavAndFooter;
