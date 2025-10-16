

import AdminSidebar from "@/components/ui/adminsidebar"; 
import AdminTimeSlotsWidget from "@/components/Widgets/AdminTimeSlotsWidget";

export default function Dashboard() {
  return (

    <div className="flex">
    <AdminSidebar />
    <div className="flex-1 bg-white-wfff">
      <AdminTimeSlotsWidget />
    </div>
  </div>
);
}
