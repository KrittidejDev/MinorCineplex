import React, { useEffect, useState } from "react";
import NavAndFooterWithBanner from "@/components/MainLayout/NavAndFooterWithBanner";
import NowShowingComingSoon from "@/components/Widgets/NowShowingComingSoonWidget";
import CinemaLocation from "@/components/Widgets/CinemaLocation";
import Coupon from "@/components/Widgets/CouponCardWidget";
import LocationPermissionModal from "@/components/Modals/LocationPermissionModal";
import { useLocationPermission } from "@/lib/hooks/useLocationPermission";
import { useNearbyCinemas } from "@/lib/hooks/useNearbyCinemas";
import dynamic from "next/dynamic";

const CurtainIntro = dynamic(() => import("@/components/Widgets/CurtainIntro"), { ssr: false });

export default function Home() {
  const [filter, setFilter] = useState<string>("1");
  const [dataCinemas, setDataCinemas] = useState<any[]>([]);
  const [showCurtain, setShowCurtain] = useState(false);
  const {
    location,
    showModal,
    openModal,
    closeModal,
    allowSession,
    allowOnce,
    neverAllow,
  } = useLocationPermission();

  const { cinemas, loading, refetch } = useNearbyCinemas(location, filter);

  useEffect(() => {
    const lastShown = localStorage.getItem("curtain_last_shown");
    const now = Date.now();
    const fiveMinutes = 1000 * 60 * 5;
    if (!lastShown || now - parseInt(lastShown, 5) > fiveMinutes) {
      setShowCurtain(true);
      localStorage.setItem("curtain_last_shown", now.toString());
    }
  }, []);

  useEffect(() => {
    setDataCinemas(cinemas);
  }, [cinemas]);

  const handleFilter = (value: string) => {
    setFilter(value);
    if (value === "2" && !location) {
      openModal();
      return;
    }
    refetch(value);
  };

  return (
    <NavAndFooterWithBanner>
      {showCurtain && (
        <CurtainIntro
          durationMs={2000}
          showLogo={true}
          onComplete={() => setShowCurtain(false)}
        />
      )}
      <div className="flex-1 max-w-[1200px]">
        <NowShowingComingSoon />
        <Coupon />
        <CinemaLocation data={dataCinemas} filterCinema={handleFilter} />
      </div>

      <LocationPermissionModal
        isOpen={showModal}
        onAllowSession={allowSession}
        onAllowOnce={allowOnce}
        onNeverAllow={neverAllow}
        onClose={closeModal}
      />
    </NavAndFooterWithBanner>
  );
}
