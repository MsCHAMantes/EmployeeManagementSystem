import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './LoginForm';
import HRDashboard from './Dashboard/HRDashboard';
import AdminDashboard from './Dashboard/AdminDashboard';
import EmployeeDashboard from './Dashboard/EmployeeDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/hr-dashboard" element={<HRDashboard />} />
        <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
