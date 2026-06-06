import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import EmployeeDashboard from './pages/EmployeeDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeAttendance from './pages/EmployeeAttendance';
import ManagerAttendance from './pages/ManagerAttendance';
import AdminTeam from './pages/AdminTeam';
import UnderConstruction from './pages/UnderConstruction';
import Login from './pages/Login';
import { useAuth } from './hooks/useAuth';

// Dynamic Router for Attendance based on Role
function AttendanceRouter() {
  const { role } = useAuth();
  if (role === 'super-admin') return <UnderConstruction title="Admin Attendance Log" />;
  if (role === 'manager') return <ManagerAttendance />;
  return <EmployeeAttendance />;
}

// Dynamic Router for Dashboard based on Role
function DashboardRouter() {
  const { role } = useAuth();
  if (role === 'super-admin') return <AdminDashboard />;
  if (role === 'manager') return <ManagerDashboard />;
  // Fallback to employee
  return <EmployeeDashboard />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Explicit Role Dashboards */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/manager" element={<ManagerDashboard />} />
        <Route path="/employee" element={<EmployeeDashboard />} />
        <Route path="/dashboard" element={<DashboardRouter />} />
        
        {/* Modules */}
        <Route path="/attendance" element={<AttendanceRouter />} />
        <Route path="/team" element={<AdminTeam />} />
        <Route path="/security" element={<UnderConstruction title="Security Logs" />} />
        <Route path="/reports" element={<UnderConstruction title="Reports" />} />
        
        {/* Default Route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
