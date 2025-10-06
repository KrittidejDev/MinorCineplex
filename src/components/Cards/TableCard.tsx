import AddRoundLight from "../Icons/AddRoundLight"
import Eye from "../Icons/Eye"
import EditLight from "../Icons/EditLight"
import Trash from "../Icons/Trash"
import { Button } from "../ui/button"

interface TableColumn{
    key: string
    label: string
    align?: 'left' | 'center' | 'right'
    width?: string
}

interface TableAction{
    onView: () => void
    onEdit: () => void
    onDelete: () => void
}

interface TableCardProps {
    columns: TableColumn[]
    actions: TableAction[]
    data: any[]
}

export default function TableCard({ columns, actions, data }: TableCardProps) {
    return(
        <div className="flax flex-col gap-10">
            <div className="mx-[70px]">
                <table className="w-full border broder-blue-bbee">
                    <thead>
                        <tr className="bg-blue-bbee">
                            {columns.map((columns,index)=>(
                                <th
                                key={index}
                                className={`text-white-wfff text-fr-16 px-5 py-7.5 text-${columns.align || 'left'}`}
                                style={{ width: columns.width }}
                                >
                                    {columns.label}
                                </th>
                            ))}
                            {actions&&(
                                <th className="text-white-wfff text-fm-16 font-bold px-5 py-7.5 text-right">Actions</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                    {data.map((row, index) => (
                            <tr key={index} className="px-17.5">
                                {columns.map((column, colIndex) => (
                                    <td 
                                        key={colIndex}
                                        className={`text-blue-bbee px-4.75 py-7.5 text-fr-14 text-${column.align || 'left'}`}
                                    >
                                        {row[column.key]}
                                    </td>
                                ))}
                                {actions && (
                                    <td className="text-blue-bbee px-4.75 py-7.5 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                className="p-2 bg-green-g372 hover:bg-gray-gedd rounded-full"
                                                onClick={actions[index]?.onView}
                                                title="View Details"
                                            >
                                                <Eye />
                                            </button>
                                            <button
                                                className="p-2 bg-blue-bbee hover:bg-gray-gedd rounded-full"
                                                onClick={actions[index]?.onEdit}
                                                title="Edit"
                                            >
                                                <EditLight />
                                            </button>
                                            <button
                                                className="p-2 bg-red-r64b hover:bg-gray-gedd rounded-full"
                                                onClick={actions[index]?.onDelete}
                                                title="Delete"
                                            >
                                                <Trash />
                                            </button>
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>

                </table>

            </div>

        </div>
    )
}