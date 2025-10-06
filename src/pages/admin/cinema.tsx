import AdminSidebar from "@/components/ui/adminsidebar";
import AdminCinemaWidgets from "@/components/Widgets/AdminCinemaWidgets";

export default function Dashboard() {


  return (

    <div className="flex">
      <AdminSidebar />
      <div className="flex-1  bg-white-wfff">
        <AdminCinemaWidgets />
      </div>
    </div>

  );
}
