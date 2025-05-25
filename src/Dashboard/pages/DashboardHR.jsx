import React, { useEffect, useState } from 'react';

function DashboardHR() {
  const [stats, setStats] = useState({
    pendingProjects: 0,
    completedProjects: 0,
    totalProjects: 0,
  });
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch('http://localhost/employeems/getHRDashboardStats.php')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (data.success) {
          setStats({
            pendingProjects: data.pendingProjects,
            completedProjects: data.completedProjects,
            totalProjects: data.totalProjects,
          });
        } else {
          console.error('Backend error:', data.error);
        }
      })
      .catch(error => console.error('Fetch error:', error));

    fetch('http://localhost/employeems/get_projects.php')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        setProjects(data);
      })
      .catch(error => console.error('Fetch error:', error));
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-blue-700 mb-4">HR Dashboard Overview</h1>
      <p className="text-gray-700 mb-6">Manage projects overview.</p>
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-yellow-100 p-4 rounded-xl shadow">
          <h2 className="text-xl font-semibold text-yellow-800">Pending Projects</h2>
          <p className="text-3xl font-bold text-yellow-900">{stats.pendingProjects}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-xl shadow">
          <h2 className="text-xl font-semibold text-green-800">Completed Projects</h2>
          <p className="text-3xl font-bold text-green-900">{stats.completedProjects}</p>
        </div>
        <div className="bg-blue-100 p-4 rounded-xl shadow">
          <h2 className="text-xl font-semibold text-blue-800">Total Projects</h2>
          <p className="text-3xl font-bold text-blue-900">{stats.totalProjects}</p>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-semibold mb-4">Project Summary</h2>
        {projects.length === 0 ? (
          <p className="text-gray-500">No projects found.</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="border-b p-2">Project Name</th>
                <th className="border-b p-2">Start Date</th>
                <th className="border-b p-2">End Date</th>
                <th className="border-b p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-100">
                  <td className="border-b p-2">{project.name}</td>
                  <td className="border-b p-2">{new Date(project.start_date).toLocaleDateString()}</td>
                  <td className="border-b p-2">{new Date(project.end_date).toLocaleDateString()}</td>
                  <td
                    className={`border-b p-2 font-semibold ${
                      project.status === 'completed'
                        ? 'text-green-600'
                        : project.status === 'pending'
                        ? 'text-yellow-600'
                        : 'text-gray-600'
                    }`}
                  >
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default DashboardHR;
