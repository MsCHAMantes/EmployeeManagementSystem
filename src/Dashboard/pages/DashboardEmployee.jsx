import React, { useEffect, useState } from 'react';

function DashboardEmployee({ username }) {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch(`http://localhost/employeems/get_employee_projects.php?username=${username}`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => setProjects(data))
      .catch(error => console.error('Fetch error:', error));
  }, [username]);

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-semibold mb-4 text-blue-700">Pending Projects Assigned to You</h2>
      {projects.length === 0 ? (
        <p className="text-gray-500">You are not assigned to any pending projects.</p>
      ) : (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="border-b p-2">Project Name</th>
              <th className="border-b p-2">Start Date</th>
              <th className="border-b p-2">End Date</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="hover:bg-gray-100">
                <td className="border-b p-2">{project.name}</td>
                <td className="border-b p-2">{new Date(project.start_date).toLocaleDateString()}</td>
                <td className="border-b p-2">{new Date(project.end_date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default DashboardEmployee;
