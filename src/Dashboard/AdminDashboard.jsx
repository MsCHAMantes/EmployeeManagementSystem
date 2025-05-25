import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardOverview from './pages/DashboardOverview';
import UserManagement from './pages/UserManagement';  // <-- import here
import Employees from './pages/Employees';
import AccountSection from './pages/AccountSection';


function AdminDashboard() {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');
  const role = localStorage.getItem('role');
  const [activeSection, setActiveSection] = useState('Dashboard');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'Dashboard':
        return <DashboardOverview username={username} />;
      case 'User Management':
                return <UserManagement username={username} />;

      case 'System Settings':
        return (
          <>
            <h1 className="text-3xl font-bold text-blue-700 mb-4">System Settings</h1>
            <p className="text-gray-700">Configure platform preferences and security options.</p>
          </>
        );
      case 'Employees':
        return <Employees username={username} />;
            case 'Account':
        return <AccountSection username={username} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-[#B8E1EC] shadow-md p-0 flex flex-col justify-between h-screen overflow-hidden">
        <div>
          {/* Profile Section */}
          <div className="flex flex-col mt-4 items-center mb-10">
            <img
              src="https://via.placeholder.com/80"
              alt="Profile"
              className="w-20 h-20 rounded-full mb-3 border-2 border-blue-600"
            />
            <h3 className="text-lg font-semibold text-black">{username}</h3>
            <p className="text-sm text-gray-600">{role && role.toUpperCase()}</p>
          </div>

          <nav className="space-y-2">
            {['Dashboard', 'User Management', 'System Settings', 'Employees', 'Account'].map(section => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`block w-full text-left px-6 py-3 font-medium ${
                  activeSection === section
                    ? 'bg-white text-black'
                    : 'bg-[#B8E1EC] text-black hover:bg-gray-50'
                }`}
              >
                {section}
              </button>
            ))}
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="mt-8 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 bg-gray-50 h-screen overflow-auto">
        {renderContent()}
      </main>
    </div>
  );
}

export default AdminDashboard;
