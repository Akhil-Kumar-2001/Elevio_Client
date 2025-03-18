import React from "react";
import { Lock, Unlock, Trash2 } from "lucide-react"; // Importing icons

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
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};


const Table: React.FC<TableProps> = ({ columnArray, dataArray, actions = false, onBlockUser, onDeleteCategory }) => {
  return (
    <div className="bg-black border border-gray-700 rounded-sm">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-700 text-white">
            {columnArray.map((column) => (
              <th key={column.field} className="text-left p-4">{column.header}</th>
            ))}
            {actions && <th className="text-left p-4">Actions</th>}
          </tr>
        </thead>
        <tbody className="text-gray-300">
          {dataArray.length > 0 ? (
            dataArray.map((row, index) => (
              <tr key={index} className="border-b border-gray-800 hover:bg-gray-900 transition duration-300">
                {columnArray.map((column) => (
                  <td key={column.field} className="p-4">
                    {column.field === "createdAt" ? formatDate(row[column.field]) : row[column.field]}
                  </td>
                ))}
                {actions && (
                  <td className="p-4 flex space-x-6">
                    {/* Block/Unblock Button */}
                    {onBlockUser && (
                      <button
                        onClick={() => onBlockUser(row._id, row.status)}
                        className={`transition transform hover:scale-110 ${
                          row.status === -1
                            ? "text-green-400 drop-shadow-[0_0_8px_#00ff00]" // Green glow when unblocked
                            : "text-red-400 drop-shadow-[0_0_8px_#8b0000]"  // Red glow when blocked
                        }`}
                      >
                        {row.status === -1 ? <Unlock size={22} /> : <Lock size={22} />}
                      </button>
                    )}
                    
                    {/* Delete Button */}
                    {onDeleteCategory && (
                      <button
                        onClick={() => onDeleteCategory(row._id, row.name)}
                        className="text-red-600 transition transform hover:scale-110"
                      >
                        <Trash2
                          size={22}
                          className="drop-shadow-[0_0_8px_#8b0000]" /* Dark Red Glow Effect */
                        />
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columnArray.length + (actions ? 1 : 0)} className="text-center p-4 text-gray-500">
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
