import AdminCouponWidgets from '@/components/Widgets/AdminCouponWidgets'
import AdminSidebar from '@/components/ui/adminsidebar'

export default function Dashboard() {
  return (
    <div className="bg-white-wfff">
      <div className="flex">
        <AdminSidebar />
        <div className="w-full mt-20 mx-[70px]">
          <AdminCouponWidgets />
        </div>
      </div>
    </div>
  )
}
