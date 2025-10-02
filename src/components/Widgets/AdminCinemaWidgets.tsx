import AddRoundLight from "../Icons/AddRoundLight"
import { Button } from "../ui/button"

function createData(
    name: string,
    address: string,
    phone: string,
    halls: number,
    actions: { onView: () => void, onEdit: () => void, onDelete: () => void }
) {
    return {
        name,
        address,
        phone,
        halls,
        actions
    }
}



export default function AdminCinemaWidgets() {
    const cinemaList = [
        createData(
            "Ratchayothin",
            "55/55 xxxxxxx, xxxxxxx",
            "090-000-0000",
            14,
            {
                onView: () => (""),
                onEdit: () => (""),
                onDelete: () => ("")
            }
        ),

    ];

    return (
        <div className="flex flex-col gap-10">
            <div className="flex items-center justify-between mt-20 mx-[70px]">
                <h1 className="text-gray-g63f text-f-56 font-bold">Cinema Branch</h1>
                <Button className="btn-base blue-normal text-fm-16 font-bold px-4 py-3 gap-2.5"><AddRoundLight width={24} height={40} color={"#FFFFFF"} />Add Cinema</Button>
            </div>
            <div className="mx-[70px]">
                <table className="w-full border border-blue-bbee">
                    <thead>
                        <tr className="bg-blue-bbee ">
                            <th className="text-white-wfff px-5 py-7.5 text-fm-16 font-bold text-left ">Name</th>
                            <th className="text-white-wfff px-5 py-7.5 text-fm-16 font-bold text-left">Address</th>
                            <th className="text-white-wfff px-5 py-7.5 text-fm-16 font-bold text-left">Phone Number</th>
                            <th className="text-white-wfff px-5 py-7.5 text-fm-16 font-bold text-center">Halls</th>
                            <th className="text-white-wfff px-5 py-7.5 text-fm-16 font-bold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cinemaList.map((cinema, index) => (
                            <tr key={index} className="px-17.5">
                                <td className="text-blue-bbee px-4.75 py-7.5 text-fr-16  text-left">{cinema.name}</td>
                                <td className="text-blue-bbee px-4.75 py-7.5 text-fr-14  text-left">{cinema.address}</td>
                                <td className="text-blue-bbee px-4.75 py-7.5 text-fr-14  text-left">{cinema.phone}</td>
                                <td className="text-blue-bbee px-4.75 py-7.5 text-fr-14  text-center">{cinema.halls}</td>
                                <td className="text-blue-bbee px-4.75 py-7.5 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            className=" hover:bg-gray-gedd rounded"
                                            onClick={cinema.actions.onView}
                                            title="View Details"
                                        >
                                            👁️
                                        </button>
                                        <button
                                            className=" hover:bg-gray-gedd rounded"
                                            onClick={cinema.actions.onEdit}
                                            title="Edit"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            className=" hover:bg-gray-gedd rounded"
                                            onClick={cinema.actions.onDelete}
                                            title="Delete"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )

}