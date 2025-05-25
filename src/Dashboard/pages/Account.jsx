import React, { useEffect, useState } from 'react';

function AdminAccount() {
  const [profilePic, setProfilePic] = useState(localStorage.getItem('profilePic') || '');
  const [name, setName] = useState(localStorage.getItem('username') || '');
  const [role, setRole] = useState(localStorage.getItem('role') || '');
  const [wordFile, setWordFile] = useState(null);

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      localStorage.setItem('profilePic', base64);
      setProfilePic(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleAccept = () => {
    alert("Document accepted.");
  };

  const handleView = () => {
    if (wordFile) {
      const url = URL.createObjectURL(wordFile);
      window.open(url);
    } else {
      alert("No file to view.");
    }
  };

  const handleEdit = () => {
    if (wordFile) {
      alert("You can now open this file in MS Word.");
    } else {
      alert("No file selected to edit.");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-blue-700 mb-4">My Account</h1>

      <div className="flex items-center space-x-6 mb-6">
        <div>
          <img
            src={profilePic || 'https://via.placeholder.com/100'}
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-blue-500"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleProfilePicChange}
            className="mt-2"
          />
        </div>
        <div>
          <p className="text-lg font-semibold">Name: {name}</p>
          <p className="text-md text-gray-600">Role: {role.toUpperCase()}</p>
        </div>
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-medium">Upload Word File:</label>
        <input
          type="file"
          accept=".doc,.docx"
          onChange={(e) => setWordFile(e.target.files[0])}
        />
      </div>

      <div className="space-x-4 mt-4">
        <button
          onClick={handleAccept}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Accept
        </button>
        <button
          onClick={handleView}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          View
        </button>
        <button
          onClick={handleEdit}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          Edit
        </button>
      </div>
    </div>
  );
}

export default AdminAccount;
