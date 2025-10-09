import AdminSidebar from "@/components/ui/adminsidebar";
import AdminShowtimeWidget from "@/components/Widgets/AdminShowtimeWidget";

export default function AdminShowtime() {
  return (
    <div className="bg-white-wfff">
      <div className="flex">
        <div>
        <AdminSidebar />
      </div>
      <div className="w-full px-15 py-20">
        <AdminShowtimeWidget />
      </div>
      </div>
    </div>
  );
}
