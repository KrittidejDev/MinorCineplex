import AdminSidebar from "@/components/ui/adminsidebar";
import AdminMovieWidget from "@/components/Widgets/AdminMovieWidget";

export default function Dashboard() {
  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 bg-white-wfff">
        <AdminMovieWidget />
      </div>
    </div>
  );
}
