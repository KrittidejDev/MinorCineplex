import AddRoundLight from "../Icons/AddRoundLight"
import { Button } from "../ui/button"
import TableCard from "../Cards/TableCard"
import CreateNewCinemaCard from "../Cards/CreateNewCinemaCard"
import { useState } from "react"

export default function AdminCinemaWidgets() {
    const [isShowCreateModal, setIsShowCreateModal] = useState(false)

    return (
        <div className="flex flex-col gap-10">
            <div className="flex items-center justify-between mt-20 mx-[70px]">
                <h1 className="text-gray-g63f text-f-56 font-bold">Cinema Branch</h1>
                <Button
                    className="btn-base blue-normal text-fm-16 font-bold px-4 py-3 gap-2.5"
                    onClick={() => setIsShowCreateModal(true)}
                >
                    <AddRoundLight width={24} height={40} color={"#FFFFFF"} />
                    Add Cinema
                </Button>
            </div>
            <div className="mx-[70px]">
                <TableCard />
            </div>

            {/* Create New Cinema Modal */}
            <CreateNewCinemaCard
                isShowModal={isShowCreateModal}
                onClose={() => setIsShowCreateModal(false)}
            />
        </div>
    )
}