

import AdminSidebar from "@/components/ui/adminsidebar"; 
import AdminTimeSlotsWidget from "@/components/Widgets/AdminTimeSlotsWidget";

export default function Dashboard() {
 const [isShowCreateModal, setIsShowCreateModal] = useState(false);

 const timeSlotColumns = [
  { key: 'timeSlotName', label: <span className="text-white-wfff text-fm-16">Time Slot Name</span>, align: 'left' as const },
  { key: 'startTime', label: <span className="text-white-wfff text-fm-16">Start Time</span>, align: 'left' as const },
  { key: 'endTime', label: <span className="text-white-wfff text-fm-16">End Time</span>, align: 'left' as const },
  { key: 'hallUsedIn', label: <span className="text-white-wfff text-fm-16">Hall Used In</span>, align: 'left' as const }
  
]

const timeSlotActions = [
  {
    onView: () => console.log('View Cinema 1'),
    onEdit: () => console.log('Edit Cinema 1'),
    onDelete: () => console.log('Delete Cinema 1'),
  },
]

  return (

    <div className="flex">
    <AdminSidebar />
    <div className="flex-1 bg-white-wfff">
      <AdminTimeSlotsWidget />
    </div>

    {/* <div>
                <TableCard
                    columns={timeSlotColumns}
                    actions={timeSlotColumns}
                    data={}
                    headerPaddingClass="px-[30px] py-5"
                    actionsHeaderPaddingClass="px-[30px] py-5"
                />
                <div className="mx-[70px] mt-4 text-gray-g3b0 text-fr-14">
                    Showing {cinemaData.length > 0 ? 1 : 0} to {Math.min(5, cinemaData.length)} of {cinemaData.length} results
                </div>
            </div>

            <AdminCreateNewTimeSlotForm
                isShowModal={isShowCreateModal}
                onClose={() => setIsShowCreateModal(false)}
            /> */}
  </div>
);
}
