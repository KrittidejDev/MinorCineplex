import AddRoundLight from "../Icons/AddRoundLight"
import { Button } from "../ui/button"
import TableCard from "../Cards/TableCard"
import CreateNewCinemaCard from "../Forms/CreateNewCinemaCard"
import { useState } from "react"

export default function AdminCinemaWidgets() {
    const [isShowCreateModal, setIsShowCreateModal] = useState(false)
    
    
    const cinemaColumns = [
        { key: 'name', label: <span className="text-white-wfff text-fm-16">Name</span>, align: 'left' as const },
        { key: 'address', label: <span className="text-white-wfff text-fm-16">Address</span>, align: 'left' as const },
        { key: 'phone', label: <span className="text-white-wfff text-fm-16">Phone Number</span>, align: 'left' as const },
        { key: 'halls', label: <span className="text-white-wfff text-fm-16">Halls</span>, align: 'center' as const }
        
    ]
    const cinemaData = [
        {
            name: "Ratchayothin",
            address: "55/55 xxxxxxx, xxxxxxx",
            phone: "090-000-0000",
            halls: 14,
            
        },
        {
            name: "Central World",
            address: "999/9 xxxxxxx, xxxxxxx",
            phone: "090-111-1111",
            halls: 12
        }
    ]
    const cinemaActions = [
        {
            onView: () => console.log("View Cinema 1"),
            onEdit: () => console.log("Edit Cinema 1"),
            onDelete: () => console.log("Delete Cinema 1")
        },
        {
            onView: () => console.log("View Cinema 2"),
            onEdit: () => console.log("Edit Cinema 2"),
            onDelete: () => console.log("Delete Cinema 2")
        }
    ]

    return (
        <div className="flex flex-col gap-10">
            <div className="flex items-center justify-between mt-20 mx-[70px]">
                <h1 className="text-gray-g63f text-f-56 font-bold">Cinema Branch</h1>
                <Button
                    className="btn-base blue-normal cursor-pointer text-fm-16 font-bold gap-2.5 h-12 w-[135px] rounded-[4px]"
                    onClick={() => setIsShowCreateModal(true)}
                >
                    <AddRoundLight width={24} height={40}  />
                    Add Cinema
                </Button>
            </div>

            <div>
                <TableCard
                    columns={cinemaColumns}
                    actions={cinemaActions}
                    data={cinemaData}
                    headerPaddingClass="px-[30px] py-5"
                    actionsHeaderPaddingClass="px-[30px] py-5"
                />
                <div className="mx-[70px] mt-4 text-gray-g3b0 text-fr-14">
                    Showing {cinemaData.length > 0 ? 1 : 0} to {Math.min(5, cinemaData.length)} of {cinemaData.length} results
                </div>
            </div>

            {/* Create New Cinema Modal */}
            <CreateNewCinemaCard
                isShowModal={isShowCreateModal}
                onClose={() => setIsShowCreateModal(false)}
            />
        </div>
    )
}