import { navbarMenuCustomer } from "@/lib/data/navbarMenu";
import { UserDataResponse } from "@/types/user";
import Link from "next/link";
import router from "next/router";
import { useTranslation } from "next-i18next";


interface NavbarMenuProps {
  data: UserDataResponse;
  onLogOut: () => void;
  className?: string;
}

const NavbarMenu = ({ data, onLogOut, className }: NavbarMenuProps) => {
  const { t } = useTranslation("common");

  const _handleClickAdmin = () => {
    router.push("/admin/dashboard");
  };
  const btnProfileStyle =
    "flex items-center gap-x-2.5 py-3 text-white px-4 w-full cursor-pointer hover:shadow-lg text-left text-b1 hover:scale-105 transition";
  return (
    <div
      className={`flex flex-col p-2 w-62 bg-gray-g63f rounded-lg shadow-lg overflow-hidden mx-4 ${className}`}
    >
      {data?.role === "ADMIN" && (
        <button className={btnProfileStyle} onClick={_handleClickAdmin}>
          {/* <AdminBook /> */}
          {t("Dashboard")}
        </button>
      )}
      {navbarMenuCustomer.map((item) => (
        <Link href={item.href} key={item.label}>
          <button className={btnProfileStyle}>
            {t(item.label)}
          </button>
        </Link>
      ))}
      <Link href="/">
        <button onClick={onLogOut} className={btnProfileStyle}>
          {/* <SignOutIcon /> */}
          {t("Logout")}
        </button>
      </Link>
    </div>
  );
};
export default NavbarMenu;
