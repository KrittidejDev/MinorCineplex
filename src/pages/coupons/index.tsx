import React from "react";
import SpecialCoupons from "@/components/Widgets/SpecialCoupons";
import NavAndFooter from "@/components/MainLayout/NavAndFooter";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const Coupons = () => {
  return (
    <NavAndFooter>
      <SpecialCoupons />
    </NavAndFooter>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export default Coupons;
