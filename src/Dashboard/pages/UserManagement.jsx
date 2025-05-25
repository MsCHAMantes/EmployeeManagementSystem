import React, { useEffect, useState } from 'react';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editFormData, setEditFormData] = useState({ username: '', role: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    fetch('http://localhost/employeems/getUsers.php')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (data.success) {
          setUsers(data.users);
          setError(null);
        } else {
          setError(data.error || 'Failed to fetch users');
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  };

  const handleEditClick = (user) => {
    setEditingUserId(user.id);
    setEditFormData({ username: user.username, role: user.role });
  };

  const handleCancelClick = () => {
    setEditingUserId(null);
    setEditFormData({ username: '', role: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateClick = (id) => {
    fetch('http://localhost/employeems/getUsers.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...editFormData }),
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (data.success) {
          setUsers(prevUsers =>
            prevUsers.map(user =>
              user.id === id ? { ...user, ...editFormData } : user
            )
          );
          setEditingUserId(null);
          setEditFormData({ username: '', role: '' });
          setError(null);
        } else {
          setError(data.error || 'Failed to update user');
        }
      })
      .catch(err => setError(err.message));
  };

  const handleDeleteClick = (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    fetch('http://localhost/employeems/deleteUser.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (data.success) {
          setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
          setError(null);
        } else {
          setError(data.error || 'Failed to delete user');
        }
      })
      .catch(err => setError(err.message));
  };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-blue-700 mb-4">User Management</h1>
      <p className="text-gray-700 mb-6">Manage all registered users and assign roles.</p>
      <table className="min-w-full bg-white shadow rounded-lg">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-left">ID</th>
            <th className="py-2 px-4 border-b text-left">Username</th>
            <th className="py-2 px-4 border-b text-left">Role</th>
            <th className="py-2 px-4 border-b text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b">{user.id}</td>

              {editingUserId === user.id ? (
                <>
                  <td className="py-2 px-4 border-b">
                    <input
                      type="text"
                      name="username"
                      value={editFormData.username}
                      onChange={handleInputChange}
                      className="border rounded px-2 py-1 w-full"
                    />
                  </td>
                  <td className="py-2 px-4 border-b">
                    <select
                      name="role"
                      value={editFormData.role}
                      onChange={handleInputChange}
                      className="border rounded px-2 py-1 w-full"
                    >
                      <option value="admin">Admin</option>
                      <option value="hr">HR</option>
                      <option value="employee">Employee</option>
                    </select>
                  </td>
                  <td className="py-2 px-4 border-b space-x-2">
                    <button
                      onClick={() => handleUpdateClick(user.id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelClick}
                      className="bg-gray-300 hover:bg-gray-400 text-black px-3 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td className="py-2 px-4 border-b">{user.username}</td>
                  <td className="py-2 px-4 border-b">{user.role}</td>
                  <td className="py-2 px-4 border-b space-x-2">
                    <button
                      onClick={() => handleEditClick(user)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(user.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserManagement;
