import AddRoundLight from "../Icons/AddRoundLight"
import { Button } from "../ui/button"
import TableCard from "../Cards/TableCard"
import CreateNewCinemaCard from "../Forms/CreateNewCinemaCard"
import { useState } from "react"

export default function AdminCinemaWidgets() {
    const [isShowCreateModal, setIsShowCreateModal] = useState(false)
    
    
    const cinemaColumns = [
        { key: 'name', label: 'Name', align: 'left' as const },
        { key: 'address', label: 'Address', align: 'left' as const },
        { key: 'phone', label: 'Phone Number', align: 'left' as const },
        { key: 'halls', label: 'Halls', align: 'center' as const }
        
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
            <div className="flex items-center justify-between mt-20 px-17.5">
                <h1 className="text-gray-g63f text-f-56 font-bold ">Cinema Branch</h1>
                <Button
                    className="btn-base blue-normal text-fm-16 font-bold px-4 py-3 gap-2.5"
                    onClick={() => setIsShowCreateModal(true)}
                >
                    <AddRoundLight width={24} height={24} color={"#FFFFFF"} />
                    Add Cinema
                </Button>
            </div>
            <div className="mx-[70px]">
                <TableCard
                    columns={cinemaColumns}
                    actions={cinemaActions}
                    data={cinemaData}
                />
            </div>

            {/* Create New Cinema Modal */}
            <CreateNewCinemaCard
                isShowModal={isShowCreateModal}
                onClose={() => setIsShowCreateModal(false)}
            />
        </div>
    )
}