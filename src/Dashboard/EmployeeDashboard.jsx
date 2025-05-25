import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardEmployee from './pages/DashboardEmployee';
import EmployeeProjects from './pages/EmployeeProjects';
import AccountSection from './pages/AccountSection';

function EmployeeDashboard() {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');
  const role = localStorage.getItem('role');
  const [activeSection, setActiveSection] = useState('Dashboard');
  const [resume, setResume] = useState(null);
  const [contract, setContract] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfilePicPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
      console.log("Submitting form..."); 

    const formData = new FormData();
    console.log("Username being sent:", username);
    if (resume) formData.append('resume', resume);
    if (contract) formData.append('contract', contract);
    if (profilePic) formData.append('profile_picture', profilePic);

    try {
    const res = await fetch('http://localhost/employeems/api/update_account.php', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    alert(data.message);
  } catch (error) {
    console.error("Error:", error); 
    alert("Upload failed.");
  }
};

  const renderContent = () => {
    switch (activeSection) {
      case 'Dashboard':
        return <DashboardEmployee username={username} />;
      case 'Projects':
  return <EmployeeProjects username={username} />;
      case 'Deadlines':
        return (
          <>
            <h1 className="text-3xl font-bold text-blue-700 mb-4">Deadlines</h1>
            <p className="text-gray-700">These are your upcoming deadlines.</p>
          </>
        );
        case 'Account':
        return <AccountSection username={username} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-[#B8E1EC] shadow-md p-0 flex flex-col justify-between">
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
            {['Dashboard', 'Projects', 'Deadlines', 'Account'].map((section) => (
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
      <main className="flex-1 p-10 bg-gray-50">{renderContent()}</main>
    </div>
  );
}

export default EmployeeDashboard;
