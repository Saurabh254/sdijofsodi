import React from "react";

const Students: React.FC = () => {
  // Dummy data for pagination
  const students = Array.from({ length: 50 }, (_, i) => ({
    name: `Student ${i + 1}`,
    email: `student${i + 1}@example.com`,
  }));

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">All Students</h1>
      <table className="w-full bg-white rounded-lg shadow">
        <thead>
          <tr>
            <th className="text-left p-4">Name</th>
            <th className="text-left p-4">Email</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="p-4">{student.name}</td>
              <td className="p-4">{student.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Add pagination controls here */}
    </div>
  );
};

export default Students;
