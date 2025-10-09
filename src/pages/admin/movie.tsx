import AdminSidebar from "@/components/ui/adminsidebar";
import AdminMovieWidget from "@/components/Widgets/AdminMovieWidget";

export default function Dashboard() {
  return (
    <div className="bg-white-wfff">
      <div className="flex">
        <AdminSidebar />
        <div className="w-full mt-20 mx-[70px]">
          <AdminMovieWidget />
        </div>
      </div>
    </div>
  );
}
