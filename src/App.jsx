import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './LoginForm';
import AdminDashboard from './Dashboard/AdminDashboard';
import HRDashboard from './Dashboard/HRDashboard';
import EmployeeDashboard from './Dashboard/EmployeeDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/Dashboard/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/Dashboard/HRDashboard" element={<HRDashboard />} />
        <Route path="/Dashboard/EmployeeDashboard" element={<EmployeeDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
