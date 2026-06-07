import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Sidebar() {
  const { role } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path 
      ? "text-primary border-l-2 border-primary bg-surface-variant" 
      : "text-on-surface-variant border-l-2 border-transparent hover:bg-surface-container-high hover:text-on-surface";
  };

  const dashboardPath = role === 'super-admin' ? '/admin' : role === 'manager' ? '/manager' : '/employee';

  return (
    <aside className="hidden md:flex flex-col h-screen w-64 left-0 top-0 bg-surface-container-low text-primary font-label-md text-label-md border-r border-outline-variant py-gutter sticky">
      {/* Logo */}
      <div className="px-4 mb-8 pt-2">
        <h1 className="font-headline-md text-headline-md font-bold text-primary flex items-center gap-2">
          <span className="material-symbols-outlined text-[24px]">terminal</span>
          AttendSecure
        </h1>
      </div>
      
      {/* Navigation Links */}
      <nav className="flex-1 flex flex-col gap-1 px-2">
        {/* Everyone gets a Dashboard */}
        <Link to={dashboardPath} 
              className={`px-4 py-3 flex items-center gap-3 transition-all duration-150 ease-in-out ${isActive(dashboardPath)}`}>
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
          Dashboard
        </Link>

        {/* Everyone gets Attendance */}
        <Link to="/attendance" className={`px-4 py-3 flex items-center gap-3 transition-all duration-150 ease-in-out ${isActive('/attendance')}`}>
          <span className="material-symbols-outlined">fingerprint</span>
          Attendance
        </Link>

        {/* Admin Only */}
        {role === 'super-admin' && (
          <>
            <Link to="/security" className={`px-4 py-3 flex items-center gap-3 transition-all duration-150 ease-in-out ${isActive('/security')}`}>
              <span className="material-symbols-outlined">security</span>
              Security Logs
            </Link>
          </>
        )}

        {/* Manager & Admin */}
        {(role === 'super-admin' || role === 'manager') && (
          <>
            <Link to="/team" className={`px-4 py-3 flex items-center gap-3 transition-all duration-150 ease-in-out ${isActive('/team')}`}>
              <span className="material-symbols-outlined">group</span>
              Team Management
            </Link>
            <Link to="/reports" className={`px-4 py-3 flex items-center gap-3 transition-all duration-150 ease-in-out ${isActive('/reports')}`}>
              <span className="material-symbols-outlined">analytics</span>
              Reports
            </Link>
          </>
        )}
      </nav>

      {/* Footer Links */}
      <div className="mt-auto px-2 pt-4 border-t border-outline-variant">
        {/* Terminate session moved to header */}
      </div>
    </aside>
  );
}
