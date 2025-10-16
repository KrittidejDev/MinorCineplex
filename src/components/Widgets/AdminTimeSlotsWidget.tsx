import AddRoundLight from "../Icons/AddRoundLight"
import { Button } from "../ui/button"
import TableCard from "../Cards/TableCard"
import { useState } from "react"
import AdminCreateNewTimeSlotForm from "../Forms/AdminCreateNewTimeSlotForm"

export default function AdminTimeSlotsWidget() {
    const [isShowCreateModal, setIsShowCreateModal] = useState(false);

 const timeSlotColumns = [
  { key: 'timeSlotName', label: <span className="text-white-wfff text-fm-16">Time Slot Name</span>, align: 'left' as const },
  { key: 'startTime', label: <span className="text-white-wfff text-fm-16">Start Time</span>, align: 'left' as const },
  { key: 'endTime', label: <span className="text-white-wfff text-fm-16">End Time</span>, align: 'left' as const },
  { key: 'hallUsedIn', label: <span className="text-white-wfff text-fm-16">Hall Used In</span>, align: 'left' as const }
  
]
const timeSlotData = [
  {
    timeSlotName: 'Time Slot 1',
    startTime: '10:00',
    endTime: '12:00',
    hallUsedIn: 'Hall 1',
  },
]
const timeSlotActions = [
  {
    onView: () => console.log('View Cinema 1'),
    onEdit: () => console.log('Edit Cinema 1'),
    onDelete: () => console.log('Delete Cinema 1'),
  },
]
    return (
        <div className="flex flex-col gap-10">
            <div className="flex justify-between items-center px-15 mt-20">
                <h1 className="text-f-56 text-gray-g63f">Time Slots</h1>
                <Button
                    className="btn-base blue-normal text-fm-16 font-bold gap-2.5 h-12 w-[135px] rounded-[4px]"
                    
                >
                    <AddRoundLight width={24} height={40}  />
                    Add Time Slot
                </Button>
            </div>
            <div>
                <TableCard
                    columns={timeSlotColumns}
                    actions={timeSlotActions}
                    data={timeSlotData}
                    headerPaddingClass="px-[30px] py-5"
                    actionsHeaderPaddingClass="px-[30px] py-5"
                />
                <div className="mx-[70px] mt-4 text-gray-g3b0 text-fr-14">
                    Showing {timeSlotData.length > 0 ? 1 : 0} to {Math.min(5, timeSlotData.length)} of {timeSlotData.length} results
                </div>
            </div>

            <AdminCreateNewTimeSlotForm
                isShowModal={isShowCreateModal}
                onClose={() => setIsShowCreateModal(false)}
            />
        </div>
    )
}