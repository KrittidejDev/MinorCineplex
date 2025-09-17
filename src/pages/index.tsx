import { useEffect } from "react";
import { toast } from "react-toastify";
import NavAndFooterWithBanner from "@/components/MainLayout/NavAndFooterWithBanner";
import NowShowingComingSoon from "@/components/Widgets/NowShowingComingSoonWidget";

export default function Home() {
  const testToast = () => {
    toast.success("Hello Techup");
  };

  useEffect(() => {
    testToast();
  }, []);

  return (
    <NavAndFooterWithBanner>
      <div className="flex-1 max-w-[1200px]">
        {/* section 1 */}
        <NowShowingComingSoon />
        {/* section 2 */}
        
      </div>
    </NavAndFooterWithBanner>
  );
}
