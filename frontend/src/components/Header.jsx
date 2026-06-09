import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Header() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [time, setTime] = useState(new Date());
  const navigate = useNavigate();
  const { user, department, name, employeeId, logout } = useAuth();

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');

  return (
    <header className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop h-16 bg-surface border-b border-outline-variant sticky top-0 z-50">
      <div className="flex items-center gap-4">
        {/* Mobile Hamburger */}
        <button 
          onClick={() => window.dispatchEvent(new Event('toggleSidebar'))}
          className="md:hidden text-primary hover:text-primary-fixed p-1 flex items-center justify-center cursor-pointer"
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>
        <h1 className="font-headline-md text-headline-md font-bold text-primary tracking-tighter md:hidden">AttendSecure</h1>
        <div className="font-code-inline text-code-inline text-primary hidden sm:flex items-center gap-1 px-2">
          <span>{hours}</span><span className="terminal-cursor">:</span><span>{minutes}</span>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 relative">
          <div className="text-right hidden sm:block">
            <p className="font-code-inline text-code-inline text-primary leading-none mb-1">{name ? name.toUpperCase() : user?.username ? user.username.toUpperCase() : 'JOHN DOE'}</p>
            <p className="text-[10px] uppercase tracking-widest text-secondary flex items-center justify-end gap-1">
              {employeeId || user?.userId || '5070523'} | {department || 'IT'}
            </p>
          </div>
          <button
            className="w-10 h-10 rounded bg-surface-container-highest border border-outline-variant flex items-center justify-center overflow-hidden hover:border-primary transition-colors cursor-pointer"
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
            }}
          >
            <span className="material-symbols-outlined text-primary">account_circle</span>
          </button>

          {/* Profile Dropdown Menu */}
          {showProfileMenu && (
            <div className="absolute top-14 right-0 w-48 bg-surface-container-high border border-outline-variant rounded shadow-[0_0_15px_rgba(0,0,0,0.5)] z-50 overflow-hidden">
              <div className="p-3 border-b border-outline-variant sm:hidden">
                <p className="font-code-inline text-code-inline text-primary">{name ? name.toUpperCase() : user?.username ? user.username.toUpperCase() : 'JOHN DOE'}</p>
                <p className="text-[10px] uppercase tracking-widest text-secondary mt-1">{employeeId || user?.userId || '5070523'} | {department || 'IT'}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left flex items-center gap-3 px-4 py-3 hover:bg-error/10 text-error transition-colors font-label-md text-label-md uppercase tracking-widest cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">power_settings_new</span>
                Terminate Session
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
