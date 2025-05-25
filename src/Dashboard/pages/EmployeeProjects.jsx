import React, { useEffect, useState } from 'react';

function EmployeeProjects({ username }) {
  const [projects, setProjects] = useState([]);
  const [openedProjectId, setOpenedProjectId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetch(`http://localhost/employeems/get_user_projects.php?username=${username}`)
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(err => console.error('Failed to load projects', err));
  }, [username]);

  const handleFileUpload = async (projectId) => {
    if (!selectedFile) return alert("Please choose a file to upload.");

    const formData = new FormData();
    formData.append('project_file', selectedFile);
    formData.append('project_id', projectId);

    try {
      const res = await fetch('http://localhost/employeems/upload_project_file.php', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      alert(data.message);
      setSelectedFile(null);
      setOpenedProjectId(null);
      setProjects(prev =>
        prev.map(p => (p.id === projectId ? { ...p, status: 'completed' } : p))
      );
    } catch (err) {
      console.error('Upload failed', err);
      alert("Upload failed");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Your Projects</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {projects.map(project => (
          <div
            key={project.id}
            className="bg-white p-4 rounded shadow text-center hover:bg-blue-100 cursor-pointer"
            onClick={() => setOpenedProjectId(project.id)}
          >
            <div className="text-5xl">📁</div>
            <div className="mt-2 font-medium">{project.name}</div>
          </div>
        ))}
      </div>

      {/* Project Detail View */}
      {openedProjectId && (
        <div className="mt-8 bg-white p-6 rounded-xl shadow-md">
          {projects.filter(p => p.id === openedProjectId).map(project => (
            <div key={project.id}>
              <h2 className="text-2xl font-bold text-blue-700">{project.name}</h2>
              <p className="mt-2 text-gray-700">{project.description}</p>
              <p className="mt-2">Start Date: <strong>{project.start_date}</strong></p>
              <p>End Date: <strong>{project.end_date}</strong></p>
              <p className="mt-2 mb-4">Status: <span className={`font-semibold ${project.status === 'completed' ? 'text-green-600' : 'text-orange-500'}`}>{project.status}</span></p>
              <div>
                <h3 className="font-medium mb-2">Assigned Users:</h3>
                <ul className="list-disc ml-6">
                  {project.assigned_users?.split(',').map((user, index) => (
                    <li key={index}>{user}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-6">
                <label className="block mb-2 font-medium">Upload Project File:</label>
                <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
                <button
                  className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  onClick={() => handleFileUpload(project.id)}
                >
                  Upload and Complete
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={() => setOpenedProjectId(null)}
            className="mt-6 text-blue-500 underline"
          >
            ← Back to all projects
          </button>
        </div>
      )}
    </div>
  );
}

export default EmployeeProjects;
