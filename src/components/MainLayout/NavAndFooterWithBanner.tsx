import React, { ReactNode } from "react";
import FooterWidget from "../Widgets/FooterWidget";
import NavbarWithBannerWidget from "../Widgets/NavbarWithBannerWidget";

const NavAndFooterWithBanner = ({ children }: { children: ReactNode }) => {
  return (
    <div className="bg-blue-b flex flex-col min-h-[100dvh]">
      <NavbarWithBannerWidget />
      <div className="flex-1">{children}</div>
      <FooterWidget />
    </div>
  );
};

export default NavAndFooterWithBanner;
