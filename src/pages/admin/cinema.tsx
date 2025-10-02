

import AdminSidebar from "@/components/ui/adminsidebar"; 

export default function Dashboard() {
 

  return (

     <div className="flex">
      <AdminSidebar />
      <div className="flex-1 max-w-[1200px]">
        <div>
          <h1>Cinema</h1>

        </div>
      </div>
    </div>
    
  );
}
