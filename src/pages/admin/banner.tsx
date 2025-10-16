import AdminSidebar from "@/components/ui/adminsidebar";
import AdminBannerWidget from "@/components/Widgets/AdminBannerWidget";

export default function Dashboard() {
  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 bg-white-wfff">
        <AdminBannerWidget />
      </div>
    </div>
  );
}