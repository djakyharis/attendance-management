import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CameraScanner from '../components/CameraScanner';
import AttendanceTable from '../components/AttendanceTable';
import { useAuth } from '../hooks/useAuth';

export default function EmployeeDashboard() {
  const { user, department, role, name, employeeId } = useAuth();
  
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col relative h-screen overflow-hidden">
        <Header />
        <div className="flex-1 overflow-y-auto w-full flex flex-col">
          <div className="p-margin-desktop md:p-margin-mobile flex-1">
            <div className="max-w-container-max mx-auto w-full">
            <header className="mb-8 hidden md:block">
              <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight mb-2">Terminal Access: Dashboard</h1>
              <p className="font-body-sm text-body-sm text-on-surface-variant">&gt; system_check --status OK</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter mb-gutter">
              {/* Left Column: Verification & Primary Action */}
              <div className="lg:col-span-8 flex flex-col gap-gutter">
                <CameraScanner />
              </div>
              
              {/* Right Column: Status & Protocol Info */}
              <div className="lg:col-span-4 flex flex-col gap-gutter">
                <div className="bg-surface-container border border-outline-variant rounded p-6 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-surface-container-highest border border-outline-variant flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-[32px] text-primary">account_circle</span>
                  </div>
                  <div className="mb-4 w-full">
                    <p className="font-headline-md text-headline-md text-primary font-bold leading-tight mb-1">{name ? name.toUpperCase() : user?.username ? user.username.toUpperCase() : 'JOHN DOE'}</p>
                    <p className="font-code-inline text-code-inline text-secondary mb-3">{employeeId || user?.userId || '5070523'}</p>
                    <div className="flex justify-center gap-2">
                      <span className="bg-surface-variant text-on-surface px-2 py-1 rounded text-[10px] uppercase tracking-widest font-bold">{department || 'IT'}</span>
                      <span className="bg-primary/10 border border-primary/30 text-primary px-2 py-1 rounded text-[10px] uppercase tracking-widest font-bold">{role || 'EMPLOYEE'}</span>
                    </div>
                  </div>
                </div>
                
                {/* Status Card */}
                <div className="bg-surface-container border border-tertiary/30 rounded p-6">
                  <h3 className="font-label-md text-label-md text-tertiary uppercase tracking-widest border-b border-tertiary/30 pb-2 mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px]">info</span>
                    Today's Status
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mb-1">Current State</p>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-secondary-fixed-dim animate-pulse"></div>
                        <p className="font-code-inline text-code-inline text-on-surface">PENDING_VERIFICATION</p>
                      </div>
                    </div>
                    <div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mb-1">Shift Start</p>
                      <p className="font-code-inline text-code-inline text-on-surface">09:00 AM EST</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Logs Table */}
            <div className="mt-gutter">
               <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">list_alt</span>
                  Recent Verification Logs
               </h3>
               <AttendanceTable />
            </div>

            </div>
          </div>
          <Footer />
        </div>
      </main>
    </div>
  );
}
