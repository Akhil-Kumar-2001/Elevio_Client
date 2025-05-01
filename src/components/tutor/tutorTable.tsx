// import React from "react";
// import { Lock, Unlock, Trash2, Eye } from "lucide-react";

// // Define possible status values
// type Status = "listed" | "accepted" | "rejected" | "unknown";

// // Define a base interface for row data
// interface BaseRow {
//   _id: string;
//   status?: Status | number; 
//   name?: string; 
// }

// // Define the Column interface with a generic type for rows
// interface Column<T extends BaseRow> {
//   field: keyof T | string; // Allow string for dynamic fields
//   header: string;
//   render?: (row: T) => React.ReactNode;
// }

// // Define props with a generic type for rows
// interface TableProps<T extends BaseRow> {
//   columnArray: Column<T>[];
//   dataArray: T[];
//   actions?: boolean;
//   onBlockUser?: (userId: string, currentStatus: number) => void;
//   onDeleteCategory?: (categoryId: string, categoryName: string) => void;
//   pageRole?: string;
//   pageFunction?: (tutorId: string) => void;
// }

// // // Function to format dates
// // const formatDate = (dateString: string): string => {
// //   if (!dateString) return "N/A";
// //   const date = new Date(dateString);
// //   return date.toLocaleDateString("en-US", {
// //     year: "numeric",
// //     month: "short",
// //     day: "2-digit",
// //   });
// // };

// // Function to render the status with appropriate styling
// const renderStatus = <T extends BaseRow>(row: T): React.ReactNode => {
//   const status = (row.status || "unknown") as Status; // Cast to Status, fallback to "unknown"
//   return (
//     <span
//       className={`px-3 py-1 rounded-full text-sm font-medium ${
//         status === "listed"
//           ? "bg-green-100 text-green-800"
//           : status === "accepted"
//           ? "bg-blue-100 text-blue-800"
//           : status === "rejected"
//           ? "bg-red-100 text-red-800"
//           : "bg-yellow-100 text-yellow-800"
//       }`}
//     >
//       {status}
//     </span>
//   );
// };

// const Table: React.FC<TableProps<BaseRow>> = ({
//   columnArray,
//   dataArray,
//   actions = false,
//   onBlockUser,
//   onDeleteCategory,
//   pageRole,
//   pageFunction,
// }) => {
//   // Map through columnArray and add a custom render function for the "status" column
//   const updatedColumnArray = columnArray.map((column) => {
//     if (column.field === "status") {
//       return {
//         ...column,
//         render: renderStatus,
//       };
//     }
//     return column;
//   });

//   return (
//     <div className="bg-white rounded-md overflow-hidden">
//       <table className="w-full table-fixed">
//         <thead className="bg-gray-100 border-b">
//           <tr>
//             {updatedColumnArray.map((column) => (
//               <th key={column.field as string} className="py-3 px-4 text-left font-medium text-gray-700">
//                 {column.header}
//               </th>
//             ))}
//             {(actions || pageRole) && (
//               <th className="py-3 px-4 text-left font-medium text-gray-700">Actions</th>
//             )}
//           </tr>
//         </thead>
//         <tbody>
//           {dataArray.length > 0 ? (
//             dataArray.map((row, index) => (
//               <tr key={index} className="border-b hover:bg-gray-50">
//                 {updatedColumnArray.map((column) => (
//                   <td key={column.field as string} className="py-3 px-4 text-gray-800">
//                     {column.render
//                       ? column.render(row)
//                       : typeof column.field === "string" && column.field in row
//                       ? (row[column.field as keyof BaseRow] as React.ReactNode)
//                       : "N/A"}
//                   </td>
//                 ))}
//                 {(actions || pageRole) && (
//                   <td className="px-4 py-2 border">
//                     <div className="flex gap-2 items-center">
//                       {onBlockUser && (
//                         <button
//                           onClick={() => onBlockUser(row._id, typeof row.status === "number" ? row.status : -1)}
//                           className={`transition transform hover:scale-110 ${
//                             row.status === -1
//                               ? "text-green-400 drop-shadow-[0_0_8px_#00ff00]"
//                               : "text-red-400 drop-shadow-[0_0_8px_#8b0000]"
//                           }`}
//                         >
//                           {row.status === -1 ? <Unlock /> : <Lock />}
//                         </button>
//                       )}
//                       {onDeleteCategory && row.name && (
//                         <button
//                           onClick={() => onDeleteCategory(row._id, row.name ?? "Unknown")}
//                           className="text-red-600 transition transform hover:scale-110"
//                         >
//                           <Trash2 />
//                         </button>
//                       )}
//                       {pageRole === "course-details" && pageFunction && (
//                         <button
//                           onClick={() => pageFunction(row._id)}
//                           className="text-blue-500 transition transform hover:scale-110"
//                         >
//                           <Eye />
//                         </button>
//                       )}
//                     </div>
//                   </td>
//                 )}
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td
//                 colSpan={updatedColumnArray.length + (actions || pageRole ? 1 : 0)}
//                 className="text-center py-4"
//               >
//                 No data available
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default Table;









import React from "react";
import { Lock, Unlock, Trash2, Eye } from "lucide-react";

type Status = "listed" | "accepted" | "rejected" | "unknown";

interface BaseRow {
  _id: string;
  status?: Status | number | string; // Allow string to accommodate "Published"
  name?: string;
}

interface Column<T extends BaseRow> {
  field: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
}

interface TableProps<T extends BaseRow> {
  columnArray: Column<T>[];
  dataArray: T[];
  actions?: boolean;
  onBlockUser?: (userId: string, currentStatus: number) => void;
  onDeleteCategory?: (categoryId: string, categoryName: string) => void;
  pageRole?: string;
  pageFunction?: (tutorId: string) => void;
}

const renderStatus = <T extends BaseRow>(row: T): React.ReactNode => {
  const status = (row.status || "unknown") as string; // Treat status as string to accommodate "Published"
  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${
        status === "Published" || status === "listed"
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

const Table = <T extends BaseRow>({
  columnArray,
  dataArray,
  actions = false,
  onBlockUser,
  onDeleteCategory,
  pageRole,
  pageFunction,
}: TableProps<T>): React.ReactElement => {
  const updatedColumnArray = columnArray.map((column) => {
    if (column.field === "status") {
      return {
        ...column,
        render: renderStatus,
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
              <th
                key={column.field as string}
                className="py-3 px-4 text-left font-medium text-gray-700"
              >
                {column.header}
              </th>
            ))}
            {(actions || pageRole) && (
              <th className="py-3 px-4 text-left font-medium text-gray-700">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {dataArray.length > 0 ? (
            dataArray.map((row, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                {updatedColumnArray.map((column) => (
                  <td
                    key={column.field as string}
                    className="py-3 px-4 text-gray-800"
                  >
                    {column.render
                      ? column.render(row)
                      : typeof column.field === "string" && column.field in row
                      ? (row[column.field as keyof T] as React.ReactNode)
                      : "N/A"}
                  </td>
                ))}
                {(actions || pageRole) && (
                  <td className="px-4 py-2 border">
                    <div className="flex gap-2 items-center">
                      {onBlockUser && (
                        <button
                          onClick={() =>
                            onBlockUser(
                              row._id,
                              typeof row.status === "number" ? row.status : -1
                            )
                          }
                          className={`transition transform hover:scale-110 ${
                            row.status === -1
                              ? "text-green-400 drop-shadow-[0_0_8px_#00ff00]"
                              : "text-red-400 drop-shadow-[0_0_8px_#8b0000]"
                          }`}
                        >
                          {row.status === -1 ? <Unlock /> : <Lock />}
                        </button>
                      )}
                      {onDeleteCategory && row.name && (
                        <button
                          onClick={() =>
                            onDeleteCategory(row._id, row.name ?? "Unknown")
                          }
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