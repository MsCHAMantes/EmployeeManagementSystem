import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new URLSearchParams();
      formData.append('id', username);
      formData.append('pw', password);

      const response = await fetch('http://localhost/employeems/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      const result = await response.json();

      if (result.success) {
        localStorage.setItem('user_id', result.user_id);
        localStorage.setItem('username', result.username);
        localStorage.setItem('role', result.role);
        

        if (result.role === 'admin') navigate('/Dashboard/AdminDashboard');
        else if (result.role === 'hr') navigate('/Dashboard/HRDashboard');
        else if (result.role === 'employee') navigate('/Dashboard/EmployeeDashboard');
      } else {
        setError(result.error || 'Wrong password');
      }

    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please check your connection or server.');
    }
  };

  return (
 <div className="min-h-screen flex items-center justify-center bg-gray-100">
  <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-lg">
    <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h1>
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full px-4 py-2 mt-1 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-2 mt-1 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        className="w-full py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition duration-200"
      >
        Login
      </button>
    </form>

    {error && (
      <p className="mt-4 text-sm text-red-600 text-center">{error}</p>
    )}
  </div>
</div>

  );
}

export default LoginForm;
