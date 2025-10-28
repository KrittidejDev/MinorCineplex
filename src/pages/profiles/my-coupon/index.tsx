import React, { useEffect, useState, useCallback } from "react";
import NavBarWidget from "@/components/Widgets/NavBarWidget";
import ProfileBar from "@/components/Widgets/ProfileBar";
import CouponCard from "@/components/Cards/CouponCard";
import { CouponCardData } from "@/types/coupon";
import { userService } from "@/config/userServices";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

const ProfileMyCoupons = () => {
  const { t } = useTranslation("common"); // ใช้ i18n
  const [coupons, setCoupons] = useState<CouponCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCollectedCoupons = useCallback(
    async (isMounted: { current: boolean }) => {
      try {
        if (isMounted.current) setLoading(true);
        const res = (await userService.GET_COUPON_COLLECTED()) as {
          coupons: CouponCardData[];
        };
        if (isMounted.current) setCoupons(res.coupons);
      } catch (err) {
        console.error(err);
        if (isMounted.current) setError(t("Cannot load coupons")); // แปลภาษา
      } finally {
        if (isMounted.current) setLoading(false);
      }
    },
    [t]
  );

  useEffect(() => {
    const isMounted = { current: true };
    fetchCollectedCoupons(isMounted).catch(console.error);
    return () => {
      isMounted.current = false;
    };
  }, [fetchCollectedCoupons]);

  if (loading) return <p className="text-center py-10">{t("Loading...")}...</p>;
  if (error) return <p className="text-center py-10">{error}</p>;

  return (
    <div className="w-full bg-blue-b flex flex-col">
      <NavBarWidget />
      <div className="w-full flex flex-col md:flex-row items-start gap-4 sm:gap-6 md:gap-12 top-21 transition-all duration-500 ease-in-out py-10 pl-4 lg:pl-20 md:py-15 xl:pl-56">
        {/* ProfileBar */}
        <div className="w-full md:min-w-[225px] md:max-w-[250px]">
          <ProfileBar />
        </div>

        {/* Content */}
        <div className="flex flex-col px-4 gap-6 md:gap-12 justify-start items-start w-full">
          <div className="text-f-24 md:text-f-28 lg:text-f-36">
            My Coupons
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 w-full gap-x-4 lg:gap-y-10 max-w-[795px]">
            {coupons.map((coupon) => (
              <div className="w-full max-w-[380px] py-4" key={coupon.id}>
                <CouponCard coupon={coupon} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export default ProfileMyCoupons;
