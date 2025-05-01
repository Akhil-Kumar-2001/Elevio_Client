import React from "react";
import { Lock, Unlock, Trash2, Eye } from "lucide-react";

// Define a generic type for row data
interface RowData {
  _id: string;
  [key: string]: string | number | undefined; 
  status?: number; 
  createdAt?: string; 
  name?: string; 
  tutorId?: string; 
}

// Define the Column interface with a generic type for the row
interface Column<T extends RowData> {
  field: keyof T | string; // Allow string for flexibility
  header: string;
  render?: (row: T) => React.ReactNode;
}

// Define the TableProps interface with a generic type
interface TableProps<T extends RowData> {
  columnArray: Column<T>[];
  dataArray: T[];
  actions?: boolean;
  onBlockUser?: (userId: string, currentStatus: number) => void;
  onDeleteCategory?: (categoryId: string, categoryName: string) => void;
  pageRole?: string;
  pageFunction?: (tutorId: string) => void;
  pageCourseFunction?: (courseId: string) => void;
  pageTutorEarningsFunction?: (tutorId: string) => void;
}

const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

const Table = <T extends RowData>({
  columnArray,
  dataArray,
  actions = false,
  onBlockUser,
  onDeleteCategory,
  pageRole,
  pageFunction,
  pageCourseFunction,
  pageTutorEarningsFunction,
}: TableProps<T>): React.ReactNode => {
  return (
    <div className="bg-black border border-gray-700 rounded-sm">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-700 text-white">
            {columnArray.map((column) => (
              <th key={column.field as string} className="text-left p-4">
                {column.header}
              </th>
            ))}
            {(actions || pageRole) && <th className="text-left p-4">Actions</th>}
          </tr>
        </thead>
        <tbody className="text-gray-300">
          {dataArray.length > 0 ? (
            dataArray.map((row, index) => (
              <tr key={index} className="border-b border-gray-800 hover:bg-gray-900 transition duration-300">
                {columnArray.map((column) => (
                  <td key={column.field as string} className="p-4">
                    {column.render
                      ? column.render(row)
                      : column.field === "createdAt"
                      ? formatDate(row.createdAt)
                      : row[column.field as keyof T] ?? "N/A"}
                  </td>
                ))}
                {(actions || pageRole) && (
                  <td className="p-4 flex space-x-6">
                    {onBlockUser && row.status !== undefined && (
                      <button
                        onClick={() => onBlockUser(row._id, row.status!)}
                        className={`transition transform hover:scale-110 ${
                          row.status === -1
                            ? "text-red-400 drop-shadow-[0_0_8px_#8b0000]"
                            : "text-green-400 drop-shadow-[0_0_8px_#00ff00]"
                        }`}
                      >
                        {row.status === -1 ? <Lock size={22} /> : <Unlock size={22} />}
                      </button>
                    )}
                    {onDeleteCategory && row.name && (
                      <button
                        onClick={() => onDeleteCategory(row._id, row.name ?? "Unknown")}
                        className="text-red-600 transition transform hover:scale-110"
                      >
                        <Trash2 size={22} className="drop-shadow-[0_0_8px_#8b0000]" />
                      </button>
                    )}
                    {pageRole === "tutor-profile" && pageFunction && (
                      <button
                        onClick={() => pageFunction(row._id)}
                        className="text-blue-500 transition transform hover:scale-110"
                      >
                        <Eye size={22} />
                      </button>
                    )}
                    {pageRole === "Course-preview" && pageCourseFunction && (
                      <button
                        onClick={() => pageCourseFunction(row._id)}
                        className="text-blue-500 transition transform hover:scale-110"
                      >
                        <Eye size={22} />
                      </button>
                    )}
                    {pageRole === "tutor-earnings-profile" && pageTutorEarningsFunction && row.tutorId && (
                      <button
                        onClick={() => pageTutorEarningsFunction(row.tutorId ?? "")}
                        className="text-blue-500 transition transform hover:scale-110"
                      >
                        <Eye size={22} />
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columnArray.length + (actions || pageRole ? 1 : 0)} className="text-center p-4 text-gray-500">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;