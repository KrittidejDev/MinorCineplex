import NavAndFooterWithBanner from "@/components/MainLayout/NavAndFooterWithBanner";
import NowShowingComingSoon from "@/components/Widgets/NowShowingComingSoonWidget";
import CinemaLocation from "@/components/Widgets/CinemaLocation";
import Coupon from "@/components/Widgets/CouponCardWidget";
import LocationPermissionModal from "@/components/Modals/LocationPermissionModal";
import { useLocationPermission } from "@/lib/hooks/useLocationPermission";
import { useNearbyCinemas } from "@/lib/hooks/useNearbyCinemas";
export default function Home() {
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
