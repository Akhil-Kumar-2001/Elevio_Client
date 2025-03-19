import React from "react";
import { Lock, Unlock, Trash2, Eye } from "lucide-react";

interface Column {
  field: string;
  header: string;
  render?: (row: any) => React.ReactNode;
}

interface TableProps {
  columnArray: Column[];
  dataArray: any[];
  actions?: boolean;
  onBlockUser?: (userId: string, currentStatus: number) => void;
  onDeleteCategory?: (categoryId: string, categoryName: string) => void;
  pageRole?: string;
  pageFunction?: (tutorId: string) => void;
}

const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

const Table: React.FC<TableProps> = ({
  columnArray,
  dataArray,
  actions = false,
  onBlockUser,
  onDeleteCategory,
  pageRole,
  pageFunction,
}) => {
  return (
    <div className="bg-white rounded-md overflow-hidden">
      <table className="w-full table-fixed">
        <thead className="bg-gray-100 border-b">
          <tr>
            {columnArray.map((column) => (
              <th key={column.field} className="py-3 px-4 text-left font-medium text-gray-700">
                {column.header}
              </th>
            ))}
            {(actions || pageRole) && <th className="tpy-3 px-4 text-left font-medium text-gray-700">Actions</th>
            }
          </tr>
        </thead>
        <tbody>
          {dataArray.length > 0 ? (
            dataArray.map((row, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                {columnArray.map((column) => (
                  <td key={column.field} className="py-3 px-4 text-gray-800">
                    {column.render ? column.render(row) : row[column.field]}
                  </td>
                ))}
                {(actions || pageRole) && (
                  <td className="px-4 py-2 border">
                  <div className="flex gap-2 items-center">
                    {onBlockUser && (
                      <button
                        onClick={() => onBlockUser(row._id, row.status)}
                        className={`transition transform hover:scale-110 ${
                          row.status === -1
                            ? "text-green-400 drop-shadow-[0_0_8px_#00ff00]"
                            : "text-red-400 drop-shadow-[0_0_8px_#8b0000]"
                        }`}
                      >
                        {row.status === -1 ? <Unlock /> : <Lock />}
                      </button>
                    )}
                    {onDeleteCategory && (
                      <button
                        onClick={() => onDeleteCategory(row._id, row.name)}
                        className="text-red-600 transition transform hover:scale-110"
                      >
                        <Trash2 />
                      </button>
                    )}
                    {pageRole === "course-details" && pageFunction && (
                      <button
                        onClick={() => pageFunction(row._id)}
                        className="text-blue-500 transition transform hover:scale-110"
                      >
                        <Eye />
                      </button>
                    )}
                  </div>
                </td>
                
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columnArray.length + (actions || pageRole ? 1 : 0)} className="text-center py-4">
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
