import React from "react";

interface Column {
  field: string;
  header: string;
}

interface CourseTableProps {
  columnArray: Column[];
}

const CourseTable: React.FC<CourseTableProps> = ({ columnArray }) => {
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
          </tr>
        </thead>
        <tbody className="text-gray-300">
          <tr className="border-b border-gray-800 hover:bg-gray-900 transition duration-300">
            {columnArray.map((column) => (
              <td key={column.field} className="p-4">
                Sample Data
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default CourseTable;
