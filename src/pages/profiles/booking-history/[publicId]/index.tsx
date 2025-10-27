import CancelSuccess from "@/components/Widgets/CancelSuccess";
import NavBarWidget from "@/components/Widgets/NavBarWidget";

const CancelSuccessPage = () => {
  return (
    <div>
      <NavBarWidget />
      <div className="w-full mt-40 flex items-center justify-center">
        <CancelSuccess />
      </div>
    </div>
  );
};
export default CancelSuccessPage;
