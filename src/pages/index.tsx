import React, { useState } from "react";
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
  const [showCurtain, setShowCurtain] = useState(true);
  const {
    location,
    permissionDenied,
    showModal,
    closeModal,
    allowSession,
    allowOnce,
    neverAllow,
  } = useLocationPermission();

  // const { cinemas, loading, error } = useNearbyCinemas(location);

  console.log("permissionDenied", permissionDenied);
  console.log("showModal", showModal);
  console.log("location", location);

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
        <CinemaLocation />
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
