import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AttendanceTable from '../components/AttendanceTable';

export default function ManagerDashboard() {
  // Mock data for the manager view
  const departmentName = "ENGINEERING";
  const totalHeadcount = 42;
  const presentToday = 35;
  const pending = 7;
  const attendanceRate = Math.round((presentToday / totalHeadcount) * 100);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col relative h-screen overflow-hidden">
        <Header />
        <div className="flex-1 overflow-y-auto w-full flex flex-col">
          <div className="p-margin-desktop md:p-margin-mobile lg:p-margin-desktop flex-1">
            <div className="max-w-container-max mx-auto w-full">
            <header className="mb-8 hidden md:block">
              <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight mb-2">Terminal Access: Manager Dashboard</h1>
              <p className="font-body-sm text-body-sm text-on-surface-variant">&gt; query_dept_stats --dept={departmentName} --live</p>
            </header>
            
            {/* Stat Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-gutter">
              {/* Stat Card 1: Total Headcount */}
              <div className="bg-surface-container border border-outline-variant rounded p-6 hover:border-outline transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">groups</span>
                    Total Headcount
                  </h3>
                </div>
                <div className="flex items-end gap-3">
                  <p className="font-headline-lg text-[48px] leading-none font-bold text-on-surface">{totalHeadcount}</p>
                  <p className="font-code-inline text-sm text-on-surface-variant mb-1">Personnel</p>
                </div>
              </div>

              {/* Stat Card 2: Present Today */}
              <div className="bg-surface-container border border-tertiary/30 rounded p-6 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-tertiary/5 to-transparent w-full h-[20%] opacity-0 group-hover:opacity-100 group-hover:animate-scan pointer-events-none z-10"></div>
                <div className="flex items-center justify-between mb-4 relative z-20">
                  <h3 className="font-label-md text-label-md text-tertiary uppercase tracking-widest flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
                    Present Today
                  </h3>
                </div>
                <div className="flex items-end gap-3 relative z-20">
                  <p className="font-headline-lg text-[48px] leading-none font-bold text-tertiary">{presentToday}</p>
                  <p className="font-code-inline text-sm text-tertiary/70 mb-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span> Verified
                  </p>
                </div>
              </div>

              {/* Stat Card 3: Pending/Absent */}
              <div className="bg-surface-container border border-error/30 rounded p-6 relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-label-md text-label-md text-error uppercase tracking-widest flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">pending_actions</span>
                    Pending / Absent
                  </h3>
                </div>
                <div className="flex items-end gap-3">
                  <p className="font-headline-lg text-[48px] leading-none font-bold text-error">{pending}</p>
                  <p className="font-code-inline text-sm text-error/70 mb-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">warning</span> Action Req.
                  </p>
                </div>
              </div>
            </div>

            {/* Attendance Rate Visual Bar */}
            <div className="bg-surface-container border border-outline-variant rounded p-6 mb-gutter">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest flex items-center gap-2 mb-1">
                    <span className="material-symbols-outlined text-[16px]">monitoring</span>
                    Live Attendance Rate
                  </h3>
                  <p className="font-code-inline text-sm text-primary">Target: 95.0%</p>
                </div>
                <div className="text-right">
                  <p className="font-headline-lg text-[32px] leading-none font-bold text-primary">{attendanceRate}%</p>
                  <p className="font-code-inline text-xs text-on-surface-variant mt-1">OF TOTAL HEADCOUNT</p>
                </div>
              </div>
              
              {/* Terminal-style Progress Bar */}
              <div className="w-full h-10 bg-surface-container-highest border border-outline-variant rounded overflow-hidden relative">
                {/* Background Grid Pattern for the empty part */}
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(90deg, #968e9a 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                
                {/* The Filled Progress */}
                <div 
                  className="h-full bg-primary/20 border-r border-primary relative transition-all duration-1000 ease-out flex flex-col justify-center overflow-hidden"
                  style={{ width: `${attendanceRate}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-primary/40"></div>
                  
                  {/* Stripe pattern overlaid on the fill for a tech look */}
                  <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(226, 199, 255, 0.5) 10px, rgba(226, 199, 255, 0.5) 20px)' }}></div>
                  
                  {/* Glowing vertical bar sweeping across */}
                  <div className="absolute top-0 bottom-0 w-4 bg-primary/80 blur-[4px]" style={{ animation: 'scanline-horizontal 2.5s ease-in-out infinite' }}></div>
                </div>
                
                {/* Target Marker Line */}
                <div className="absolute top-0 bottom-0 w-[2px] bg-tertiary z-10" style={{ left: '95%' }}>
                   <div className="absolute -top-6 -translate-x-1/2 text-tertiary">
                     <span className="material-symbols-outlined text-[14px]">flag</span>
                   </div>
                </div>
              </div>
              
              <div className="flex justify-between mt-3 font-code-inline text-xs text-on-surface-variant">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>

            {/* Reuse Attendance Table to show Team Logs */}
            <div className="mt-8">
              <h2 className="font-headline-md text-headline-md text-primary tracking-tight mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined">list_alt</span>
                Department Verification Logs
              </h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">&gt; fetch logs --dept={departmentName} --limit=50</p>
              <AttendanceTable />
            </div>
            
            </div>
          </div>
          <Footer />
        </div>
      </main>
      
      {/* Inject custom horizontal scanline animation for the progress bar */}
      <style>{`
        @keyframes scanline-horizontal {
          0% { left: -10%; opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}
