import Eye from "../Icons/Eye";
import EditLight from "../Icons/EditLight";
import Trash from "../Icons/Trash";

interface TableColumn {
  key: string;
  label: string;
  align?: "left" | "center" | "right";
  width?: string;
}

interface TableAction {
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

interface TableCardProps {
  columns: TableColumn[];
  actions: TableAction[];
  data: any[];
}

export default function TableCard({ columns, actions, data }: TableCardProps) {
  return (
    <div className="flex flex-col gap-10">
      <div>
        <div className="overflow-hidden rounded-t-sm border-l border-r border-blue-bbee">
          <table className="w-full">
            <thead>
              <tr className="bg-blue-bbee">
                {columns.map((col, index) => (
                  <th
                    key={index}
                    className={`text-white-wfff text-fr-16 px-[30px] py-5 text-${col.align || "left"}`}
                    style={{ width: col.width }}
                  >
                    {col.label}
                  </th>
                ))}
                {actions && (
                  <th className="text-white-wfff text-fm-16 font-bold px-[30px] py-5 text-right">
                    Actions
                  </th>
                )}
              </tr>
            </thead>

            <tbody>
              {data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((column, colIndex) => {
                    let cellContent: React.ReactNode = row[column.key];

                    if (column.key === "poster_url") {
                      cellContent = (
                        <img
                          src={row[column.key]}
                          alt={row.title}
                          className="w-[42px] h-[63px] overflow-hidden object-cover"
                        />
                      );
                    }

                    if (column.key === "duration_min") {
                      cellContent = `${row[column.key]} mins`;
                    }

                    return (
                      <td
                        key={colIndex}
                        className={`text-blue-bbee px-[30px] py-5 border-b border-blue-bbee text-fr-14 text-${column.align || "left"}`}
                      >
                        {cellContent}
                      </td>
                    );
                  })}

                  {actions && (
                    <td className="text-blue-bbee px-[30px] py-5 border-b border-blue-bbee text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          className="p-2 bg-green-g372 hover:bg-gray-gedd rounded-full"
                          onClick={actions[rowIndex]?.onView}
                          title="View Details"
                        >
                          <Eye />
                        </button>
                        <button
                          className="p-2 bg-blue-bbee hover:bg-gray-gedd rounded-full"
                          onClick={actions[rowIndex]?.onEdit}
                          title="Edit"
                        >
                          <EditLight />
                        </button>
                        <button
                          className="p-2 bg-red-r64b hover:bg-gray-gedd rounded-full"
                          onClick={actions[rowIndex]?.onDelete}
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
    </div>
  );
}
