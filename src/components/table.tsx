// import React from "react";

// interface Column {
//   field: string;
//   header: string;
// }

// interface TableProps {
//   columnArray: Column[];
//   dataArray: any[]; // Accepting the dynamic data
// }

// const formatDate = (dateString: string) => {
//   if (!dateString) return "N/A";
//   const date = new Date(dateString);
//   return date.toLocaleDateString("en-US", {
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//   });
// };


// const Table: React.FC<TableProps> = ({ columnArray, dataArray }) => {
//   return (
//     <div className="bg-black border border-gray-700 rounded-sm">
//       <table className="w-full">
//         <thead>
//           <tr className="border-b border-gray-700">
//             {columnArray.map((column) => (
//               <th key={column.field} className="text-left p-4">
//                 {column.header}
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody className="text-gray-300">
//           {dataArray.length > 0 ? (
//             dataArray.map((row, index) => (
//               <tr key={index} className="border-b border-gray-800 hover:bg-gray-900 transition duration-300">
//                 {columnArray.map((column) => (
//                  <td key={column.field} className="p-4">
//                  {column.field === "createdAt" ? formatDate(row[column.field]) : row[column.field] || "N/A"}
//                </td>
//                 ))}
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan={columnArray.length} className="text-center p-4 text-gray-500">
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

interface Column {
  field: string;
  header: string;
}

interface TableProps {
  columnArray: Column[];
  dataArray: any[]; // Accepting the dynamic data
  actions?: boolean; // Flag to show action buttons
  onBlockUser?: (userId: string, currentStatus: number) => void; // Updated to accept number status
}

const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const Table: React.FC<TableProps> = ({ columnArray, dataArray, actions = false, onBlockUser }) => {
  return (
    <div className="bg-black border border-gray-700 rounded-sm">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-700">
            {columnArray.map((column) => (
              <th key={column.field} className="text-left p-4">
                {column.header}
              </th>
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
                    {column.field === "createdAt" ? formatDate(row[column.field]) : row[column.field] || "N/A"}
                  </td>
                ))}
                {actions && (
                  <td className="p-4">
                    <button
                      onClick={() => onBlockUser && onBlockUser(row._id, row.status)}
                      className={`px-3 py-1 rounded text-sm ${
                        row.status === -1
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-red-600 hover:bg-red-700"
                      }`}
                    >
                      {row.status === -1 ? "Unblock" : "Block"}
                    </button>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={actions ? columnArray.length + 1 : columnArray.length} className="text-center p-4 text-gray-500">
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
