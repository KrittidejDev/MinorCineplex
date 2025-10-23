import Eye from "../Icons/Eye";
import EditLight from "../Icons/EditLight";
import Trash from "../Icons/Trash";
import { ReactNode } from "react";

interface TableColumn {
  key: string;
  label: ReactNode;
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
  data: Record<string, unknown>[];
  headerPaddingClass?: string;
  actionsHeaderPaddingClass?: string;
  total?: number;
  pageSize?: number;
}

export default function TableCard({
  columns,
  actions,
  data,
  headerPaddingClass = "px-5 py-7.5",
  actionsHeaderPaddingClass = "px-5 py-7.5",
}: TableCardProps) {
  return (
    <div className="flax flex-col gap-10 px-[70px]">
      <div className="border border-blue-bbee rounded-t-[4px] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-blue-bbee">
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={`text-white-wfff text-fr-16 ${headerPaddingClass} text-${column.align || "left"}`}
                  style={{ width: column.width }}
                >
                  {column.label}
                </th>
              ))}
              {actions && (
                <th
                  className={`text-white-wfff ${actionsHeaderPaddingClass} font-bold text-right`}
                >
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr
                key={index}
                className={`px-17.5 border-b border-blue-bbee ${index === data.length - 1 ? "border-b-0" : ""}`}
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className={`text-blue-bbee px-[30px] py-7.5 text-fr-14 text-${column.align || "left"}`}
                  >
                    {row[column.key] as ReactNode}
                  </td>
                ))}
                {actions && (
                  <td className="text-blue-bbee px-[30px] py-[15px] text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        className="p-2 bg-green-g372 cursor-pointer hover:bg-green-g372/90 rounded-full text-white"
                        onClick={actions[index]?.onView}
                        title="View Details"
                      >
                        <Eye />
                      </button>
                      <button
                        className="p-2 bg-blue-bbee cursor-pointer hover:bg-blue-bbee/90 rounded-full text-white"
                        onClick={actions[index]?.onEdit}
                        title="Edit"
                      >
                        <EditLight />
                      </button>
                      <button
                        className="p-2 bg-red-r64b cursor-pointer hover:bg-red-r64b/90 rounded-full text-white"
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
  );
}
