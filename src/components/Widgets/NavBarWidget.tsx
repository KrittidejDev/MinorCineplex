import Link from "next/link";
import React from "react";
import { AvatarDisplay } from "../Displays/NavAvatarDisplay";
import LogoM from "../Icons/LogoM";
import Hamburger from "../Icons/Hamburger";

const NavBarWidget = () => {
  return (
    <div className="w-full py-4 px-20 flex items-center justify-between bg-black/20 z-10">
      <Link href={"/"} className="w-7 h-8 sm:w-[42px] sm:h-[48px]">
        <LogoM className="w-full h-full" />
      </Link>
      <div className="hidden md:flex">
        <AvatarDisplay />
      </div>
      <div className="flex md:hidden">
        <Hamburger />
      </div>
    </div>
  );
};

export default NavBarWidget;
