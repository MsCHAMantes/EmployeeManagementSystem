import React, { useEffect, useState } from 'react';

function Dashboard() {
  const [stats, setStats] = useState({ employeeCount: 0, projectCount: 0 });
  const [activities, setActivities] = useState([]);  

  useEffect(() => {
    fetch('http://localhost/employeems/getDashboardStats.php')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (data.success) {
          setStats({
            employeeCount: data.employeeCount,
            projectCount: data.projectCount,
          });
        } else {
          console.error('Backend error:', data.error);
        }
      })
      .catch(error => console.error('Fetch error:', error));
      
    fetch('http://localhost/employeems/getActivityLog.php')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (data.success) {
          setActivities(data.activities);
        } else {
          console.error('Activity log backend error:', data.error);
        }
      })
      .catch(error => console.error('Activity log fetch error:', error));
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-blue-700 mb-4">Dashboard Overview</h1>
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-blue-100 p-4 rounded-xl shadow">
          <h2 className="text-xl font-semibold text-blue-800">Total Employees</h2>
          <p className="text-3xl font-bold text-blue-900">{stats.employeeCount}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-xl shadow">
          <h2 className="text-xl font-semibold text-green-800">Total Projects</h2>
          <p className="text-3xl font-bold text-green-900">{stats.projectCount}</p>
        </div>
      </div>

      {/* Activity Log Section */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-semibold mb-4">Activity Log</h2>
        {activities.length === 0 ? (
          <p className="text-gray-500">No recent activities.</p>
        ) : (
                  <ul className="divide-y divide-gray-200">
          {activities.map((activity) => (
            <li key={activity.id} className="py-2 flex justify-between">
              <span>
                <strong>{activity.username}</strong> {activity.action}
              </span>
              <time className="text-gray-400 text-sm">
                {new Date(activity.timestamp).toLocaleString()}
              </time>
            </li>
          ))}
        </ul>

        )}
      </div>
    </div>
  );
}

export default Dashboard;
