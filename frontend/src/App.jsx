import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

const EmployeeDashboard = lazy(() => import('./pages/EmployeeDashboard'));
const ManagerDashboard = lazy(() => import('./pages/ManagerDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const EmployeeAttendance = lazy(() => import('./pages/EmployeeAttendance'));
const ManagerAttendance = lazy(() => import('./pages/ManagerAttendance'));
const AdminTeam = lazy(() => import('./pages/AdminTeam'));
const AdminAttendance = lazy(() => import('./pages/AdminAttendance'));
const AdminSecurity = lazy(() => import('./pages/AdminSecurity'));
const AdminReports = lazy(() => import('./pages/AdminReports'));
const ManagerTeam = lazy(() => import('./pages/ManagerTeam'));
const Login = lazy(() => import('./pages/Login'));
const ManagerReports = lazy(() => import('./pages/ManagerReports'));

// Fallback Loader component for Suspense
const PageLoader = () => (
  <div className="flex h-screen items-center justify-center bg-surface">
    <div className="flex flex-col items-center gap-4 text-primary">
      <span className="material-symbols-outlined animate-spin text-[48px]">sync</span>
      <p className="font-code-inline text-sm tracking-widest uppercase animate-pulse">Loading Module...</p>
    </div>
  </div>
);

// Dynamic Router for Attendance based on Role
function AttendanceRouter() {
  const { user, role, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  if (role === 'super-admin') return <Navigate to="/team" replace />;
  if (role === 'manager') return <ManagerAttendance />;
  return <EmployeeAttendance />;
}

// Dynamic Router for Dashboard based on Role
function DashboardRouter() {
  const { user, role, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  if (role === 'super-admin') return <AdminDashboard />;
  if (role === 'manager') return <ManagerDashboard />;
  // Fallback to employee
  return <EmployeeDashboard />;
}

// Dynamic Router for Reports based on Role
function ReportsRouter() {
  const { user, role, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  // Super-admin features trimmed, reports no longer available
  return <Navigate to="/dashboard" replace />;
}

// Dynamic Router for Team based on Role
function TeamRouter() {
  const { user, role, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  if (role === 'super-admin') return <AdminTeam />;
  if (role === 'manager') return <ManagerTeam />;
  return <Navigate to="/dashboard" replace />;
}

// Dynamic Router for Security based on Role
function SecurityRouter() {
  const { user, role, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to="/dashboard" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Explicit Role Dashboards (Protected) */}
          <Route path="/admin" element={<DashboardRouter />} />
          <Route path="/manager" element={<DashboardRouter />} />
          <Route path="/employee" element={<DashboardRouter />} />
          <Route path="/dashboard" element={<DashboardRouter />} />
          
          {/* Modules */}
          <Route path="/attendance" element={<AttendanceRouter />} />
          <Route path="/team" element={<TeamRouter />} />
          <Route path="/security" element={<SecurityRouter />} />
          <Route path="/reports" element={<ReportsRouter />} />
          
          {/* Default Route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
