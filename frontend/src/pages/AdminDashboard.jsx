import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import apiService from '../services/apiService';
import { useAuth } from '../hooks/useAuth';

export default function AdminDashboard() {
  const { user, role, name, employeeId } = useAuth();
  const [totalUsers, setTotalUsers] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await apiService.manageUsers({ action: 'list' });
        let count = 0;
        if (Array.isArray(data)) count = data.length;
        else if (data && Array.isArray(data.Users)) count = data.Users.length;
        else if (data && Array.isArray(data.users)) count = data.users.length;
        else if (data && typeof data === 'object') {
           const body = data.body ? (typeof data.body === 'string' ? JSON.parse(data.body) : data.body) : data;
           count = (body.Users || body.users || []).length;
        }
        setTotalUsers(count);
      } catch (error) {
        console.error('Error fetching total users:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col relative h-screen overflow-hidden">
        <Header />
        <div className="flex-1 overflow-y-auto w-full flex flex-col">
          <div className="p-margin-desktop md:p-margin-mobile flex-1">
            <div className="max-w-container-max mx-auto w-full">
            <header className="mb-8 hidden md:block">
              <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight mb-2">Super Admin Global View</h1>
              <p className="font-body-sm text-body-sm text-on-surface-variant">&gt; root_access --global-stats</p>
            </header>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter mb-gutter">
              {/* Profile Panel */}
              <div className="lg:col-span-4 flex flex-col gap-gutter">
                <div className="bg-surface-container border border-outline-variant rounded p-6 flex flex-col items-center text-center h-full justify-center">
                  <div className="w-16 h-16 rounded-full bg-surface-container-highest border border-outline-variant flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-[32px] text-primary">admin_panel_settings</span>
                  </div>
                  <div className="mb-4 w-full">
                    <p className="font-headline-md text-headline-md text-primary font-bold leading-tight mb-1">{name ? name.toUpperCase() : user?.username ? user.username.toUpperCase() : 'SUPER ADMIN'}</p>
                    <p className="font-code-inline text-code-inline text-secondary mb-3">{employeeId || 'ROOT'}</p>
                    <div className="flex justify-center gap-2 flex-wrap">
                      <span className="bg-surface-variant text-on-surface px-2 py-1 rounded text-[10px] uppercase tracking-widest font-bold">ALL DEPARTMENTS</span>
                      <span className="bg-primary/10 border border-primary/30 text-primary px-2 py-1 rounded text-[10px] uppercase tracking-widest font-bold">{role || 'SUPER-ADMIN'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stat Cards */}
              <div className="lg:col-span-8 flex flex-col gap-gutter">
                {/* Total Active Users Panel */}
                <div className="bg-surface-container border border-outline-variant rounded p-6 flex flex-col justify-center h-full">
                  <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-[18px]">public</span>
                    Total Active Users
                  </h3>
                  <div className="flex items-end gap-3">
                    <p className="font-headline-lg text-[48px] leading-none font-bold text-on-surface">
                      {isLoading ? <span className="material-symbols-outlined animate-spin text-[32px] opacity-50">sync</span> : totalUsers}
                    </p>
                    <p className="font-code-inline text-sm text-on-surface-variant mb-1">Organization-wide</p>
                  </div>
                </div>
              </div>
            </div>

            </div>
          </div>
          <Footer />
        </div>
      </main>
    </div>
  );
}
