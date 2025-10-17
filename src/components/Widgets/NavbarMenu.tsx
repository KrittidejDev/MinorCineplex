import { navbarMenuCustomer } from "@/lib/data/navbarMenu";
import { UserDataResponse } from "@/types/user";
import Link from "next/link";
import router from "next/router";


interface NavbarMenuProps {
  data: UserDataResponse;
  onLogOut: () => void;
  className?: string;
}

const NavbarMenu = ({ data, onLogOut, className }: NavbarMenuProps) => {

  const _handleClickAdmin = () => {
    router.push("/admin/dashboard");
  };
  const btnProfileStyle =
    "flex items-center gap-x-2.5 py-3 px-4 w-full cursor-pointer hover:shadow-lg text-left text-b1 hover:scale-105 transition cursor-pointer";
  return (
    <div
      className={`absolute flex flex-col w-62 bg-gray-g63f top-18 right-0 rounded-lg shadow-lg overflow-hidden mx-4 ${className}`}
    >
      {data?.role === "ADMIN" && (
        <button className={btnProfileStyle} onClick={_handleClickAdmin}>
          {/* <AdminBook /> */}
          Dashboard
        </button>
      )}
      {navbarMenuCustomer.map((item) => (
        <Link href={item.href} key={item.label}>
          <button className={btnProfileStyle}>
            {item.label}
          </button>
        </Link>
      ))}
      <Link href="/">
        <button onClick={onLogOut} className={btnProfileStyle}>
          {/* <SignOutIcon /> */}
          Log out
        </button>
      </Link>
    </div>
  );
};
export default NavbarMenu;
