import React, { useState, useEffect } from 'react';

function MainProject({ username }) {
  const [projects, setProjects] = useState([]);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [editData, setEditData] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [totalProjects, setTotalProjects] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProjects();
    fetch('http://localhost/employeems/get_users.php')
      .then(res => res.json())
      .then(data => setAllUsers(data))
      .catch(err => console.error('Failed to fetch users:', err));
  }, []);

  const fetchProjects = () => {
    fetch('http://localhost/employeems/get_projects.php')
      .then(res => res.json())
      .then(data => {
        setProjects(data);
        setTotalProjects(data.length);
      });
  };

  const handleEditChange = (id, field, value) => {
    setEditData(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }));
  };

  const saveProject = async (id) => {
    const updated = editData[id];
    try {
      const response = await fetch('http://localhost/employeems/update_project.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updated })
      });

      if (response.ok) {
        setEditingProjectId(null);
        setEditData(prev => {
          const newData = { ...prev };
          delete newData[id];
          return newData;
        });
        fetchProjects();
      } else {
        console.error('Failed to update');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Project Management</h1>

      {/* Top Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div
          className="bg-white rounded-xl shadow p-6 cursor-pointer hover:bg-blue-100 transition"
          onClick={() => setShowForm(false)}
        >
          <h2 className="text-lg font-semibold text-gray-700">Total Projects</h2>
          <p className="text-3xl font-bold text-blue-600">{totalProjects}</p>
        </div>
        <div
          className="bg-blue-600 text-white rounded-xl shadow p-6 cursor-pointer hover:bg-blue-700 transition"
          onClick={() => setShowForm(true)}
        >
          <h2 className="text-lg font-semibold">Add Project</h2>
          <p className="text-sm">Click here to create a new project</p>
        </div>
      </div>

      {/* Add Project Form */}
      {showForm && (
        <AddProjectForm
          username={username}
          allUsers={allUsers}
          onCreated={() => {
            fetchProjects();
            setShowForm(false);
          }}
        />
      )}

      {/* Project List */}
      {!showForm && (
        <div className="mt-6 space-y-4">
          {projects.map(project => (
            <div key={project.id} className="bg-white p-4 rounded shadow">
              {editingProjectId === project.id ? (
                <>
                  <input
                    value={editData[project.id]?.name || project.name}
                    onChange={e => handleEditChange(project.id, 'name', e.target.value)}
                    className="w-full mb-2 border p-2 rounded"
                  />
                  <textarea
                    value={editData[project.id]?.description || project.description}
                    onChange={e => handleEditChange(project.id, 'description', e.target.value)}
                    className="w-full mb-2 border p-2 rounded"
                  />
                  <select
                    value={editData[project.id]?.status || project.status}
                    onChange={e => handleEditChange(project.id, 'status', e.target.value)}
                    className="w-full mb-2 border p-2 rounded"
                  >
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                  </select>
                  <input
                    type="date"
                    value={editData[project.id]?.start_date || project.start_date}
                    onChange={e => handleEditChange(project.id, 'start_date', e.target.value)}
                    className="w-full mb-2 border p-2 rounded"
                  />
                  <input
                    type="date"
                    value={editData[project.id]?.end_date || project.end_date}
                    onChange={e => handleEditChange(project.id, 'end_date', e.target.value)}
                    className="w-full mb-2 border p-2 rounded"
                  />
                  <button
                    className="bg-green-600 text-white px-4 py-1 rounded mr-2"
                    onClick={() => saveProject(project.id)}
                  >
                    Save
                  </button>
                  <button
                    className="bg-gray-300 px-4 py-1 rounded"
                    onClick={() => setEditingProjectId(null)}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-semibold">{project.name}</h2>
                  <p className="text-gray-600">{project.description}</p>
                  <p>Status: <span className="font-medium">{project.status}</span></p>
                  <p>Start: {project.start_date}</p>
                  <p>End: {project.end_date}</p>
                  <button
                    className="mt-2 bg-blue-500 text-white px-4 py-1 rounded"
                    onClick={() => {
                      setEditingProjectId(project.id);
                      setEditData(prev => ({
                        ...prev,
                        [project.id]: {
                          name: project.name,
                          description: project.description,
                          status: project.status,
                          start_date: project.start_date,
                          end_date: project.end_date
                        }
                      }));
                    }}
                  >
                    Edit
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AddProjectForm({ username, allUsers, onCreated }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('ongoing');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [assignedUsers, setAssignedUsers] = useState([]);

  const handleCreate = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost/employeems/create_project.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        description,
        status,
        user_id: username,
        start_date: startDate,
        end_date: endDate,
        assigned_users: assignedUsers
      })
    });

    if (response.ok) {
      onCreated();
    }
  };

  return (
    <form onSubmit={handleCreate} className="space-y-4 bg-white p-6 rounded-lg shadow">
      <div>
        <label className="block font-medium">Project Name</label>
        <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full border p-2 rounded" />
      </div>
      <div>
        <label className="block font-medium">Description</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} required className="w-full border p-2 rounded" />
      </div>
      <div>
        <label className="block font-medium">Status</label>
        <select value={status} onChange={e => setStatus(e.target.value)} className="w-full border p-2 rounded">
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      <div>
        <label className="block font-medium">Start Date</label>
        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required className="w-full border p-2 rounded" />
      </div>
      <div>
        <label className="block font-medium">End Date</label>
        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required className="w-full border p-2 rounded" />
      </div>
      <div>
        <label className="block font-medium">Assign Users to Project</label>
        <select
          multiple
          value={assignedUsers}
          onChange={e => {
            const selected = Array.from(e.target.selectedOptions, option => option.value);
            setAssignedUsers(selected);
          }}
          className="w-full border p-2 rounded h-40"
        >
          {allUsers.map(user => (
            <option key={user.id} value={user.id}>
              {user.name} ({user.username})
            </option>
          ))}
        </select>
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Create Project
      </button>
    </form>
  );
}

export default MainProject;
