
import AdminSidebar from "@/components/ui/adminsidebar";
import AdminHallWidget from "@/components/Widgets/AdminHallWidget";

export default function Dashboard() {
  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 bg-white-wfff">
        <AdminHallWidget />
      </div>
    </div>
  );
}
