import Link from "next/link";
import React, { useEffect, useState, useCallback } from "react";
import { AvatarDisplay } from "../Displays/NavAvatarDisplay";
import LogoM from "../Icons/LogoM";
import Hamburger from "../Icons/Hamburger";
import { signOut, useSession } from "next-auth/react";
import { userService } from "@/config/userServices";
import { UserDataResponse } from "@/types/user";

interface response {
  status: number;
  docs: UserDataResponse;
}

const NavBarWidget = () => {
  const { data: session, status } = useSession();
  const id = session?.user?.id;
  const [userData, setUserData] = useState<UserDataResponse | null>(null);

  // ใช้ useCallback เพื่อให้ fetchMe เป็น dependency ของ useEffect
  const fetchMe = useCallback(async () => {
    if (!id) return;
    try {
      const res = (await userService.GET_MY_PROFILE(id)) as response;
      console.log("My Profile:", res);
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

  return (
    <div className="w-full py-4 px-4 md:px-20 flex items-center justify-between bg-black/20 z-10">
      <Link href={"/"} className="w-7 h-8 sm:w-[42px] sm:h-[48px]">
        <LogoM className="w-full h-full" />
      </Link>
      <div className="hidden md:flex">
        {status === "authenticated" ? (
          <AvatarDisplay
            onLogOut={signOut}
            data={userData as UserDataResponse}
          />
        ) : (
          <div>
            <Link href={"/auth/login"}>
              <button className="btn-base py-3! hover:underline">Login</button>
            </Link>
            <Link href={"/auth/signup"}>
              <button className="btn-base white-outline-normal py-3!">
                Register
              </button>
            </Link>
          </div>
        )}
      </div>
      <div className="flex md:hidden">
        <Hamburger />
      </div>
    </div>
  );
};

export default NavBarWidget;
