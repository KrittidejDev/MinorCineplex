import Link from "next/link";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { AvatarDisplay } from "../Displays/NavAvatarDisplay";
import LogoM from "../Icons/LogoM";
import Hamburger from "../Icons/Hamburger";
import { useSession, signOut } from "next-auth/react";
import { userService } from "@/config/userServices";
import { UserDataResponse } from "@/types/user";
import NavbarMenu from "./NavbarMenu";
import LanguageSwitcher from "./LanguageSwitcher";

interface response {
  status: number;
  docs: UserDataResponse;
}

const NavBarWidget = () => {
  const { data: session, status } = useSession();
  const id = session?.user?.id;
  const [userData, setUserData] = useState<UserDataResponse | null>(null);

  const fetchMe = useCallback(async () => {
    if (!id) return;
    try {
      const res = (await userService.GET_MY_PROFILE(id)) as response;
      if (res.status === 200) {
        setUserData(res.docs);
      }
    } catch (err) {
      console.error("Fetch profile error:", err);
    }
  }, [id]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchMe();
    }
  }, [status, fetchMe]);

  const [_isOpen, _setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        _setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const _handleOpen = () => {
    _setIsOpen((prev) => !prev);
  };
  return (
    <div
      ref={containerRef}
      className="w-full py-4 px-4 md:px-20 flex items-center justify-between bg-black/20 z-10 "
    >
      <Link
        href={"/"}
        className="w-7 h-8 sm:w-[42px] sm:h-[48px] cursor-pointer"
      >
        <LogoM className="w-full h-full" />
      </Link>
      <div className="hidden md:flex cursor-pointer">
        {status === "authenticated" ? (
          <>
            <AvatarDisplay
              data={userData as UserDataResponse}
              _isOpen={_isOpen}
              _handleOpen={_handleOpen}
            />
            <LanguageSwitcher />
          </>
        ) : (
          <div>
            <Link href={"/auth/login"}>
              <button className="btn-base py-3! hover:underline ">Login</button>
            </Link>
            <Link href={"/auth/signup"}>
              <button className="btn-base white-outline-normal py-3!">
                Register
              </button>
            </Link>
          </div>
        )}
      </div>
      <div className="flex md:hidden cursor-pointer">
        <Hamburger onClick={_handleOpen} />
      </div>
      {_isOpen && (
        <NavbarMenu
          className="z-50 "
          data={userData as UserDataResponse}
          onLogOut={signOut}
        />
      )}
    </div>
  );
};

export default NavBarWidget;
