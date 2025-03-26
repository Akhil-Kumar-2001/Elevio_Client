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

// Function to render the status with appropriate styling
const renderStatus = (row: any) => {
  const status = row.status || "unknown"; // Fallback to "unknown" if status is undefined
  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${
        status === "listed"
          ? "bg-green-100 text-green-800"
          : status === "accepted"
          ? "bg-blue-100 text-blue-800"
          : status === "rejected"
          ? "bg-red-100 text-red-800"
          : "bg-yellow-100 text-yellow-800"
      }`}
    >
      {status}
    </span>
  );
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
  // Map through columnArray and add a custom render function for the "status" column
  const updatedColumnArray = columnArray.map((column) => {
    if (column.field === "status") {
      return {
        ...column,
        render: renderStatus, // Use the renderStatus function for the status column
      };
    }
    return column;
  });

  return (
    <div className="bg-white rounded-md overflow-hidden">
      <table className="w-full table-fixed">
        <thead className="bg-gray-100 border-b">
          <tr>
            {updatedColumnArray.map((column) => (
              <th key={column.field} className="py-3 px-4 text-left font-medium text-gray-700">
                {column.header}
              </th>
            ))}
            {(actions || pageRole) && (
              <th className="py-3 px-4 text-left font-medium text-gray-700">Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {dataArray.length > 0 ? (
            dataArray.map((row, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                {updatedColumnArray.map((column) => (
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
              <td
                colSpan={updatedColumnArray.length + (actions || pageRole ? 1 : 0)}
                className="text-center py-4"
              >
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