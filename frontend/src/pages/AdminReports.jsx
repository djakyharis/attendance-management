import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';

const departmentStats = [
  { name: 'ENGINEERING', rate: 94.2, late: 12, absent: 2 },
  { name: 'SALES', rate: 82.5, late: 28, absent: 8 },
  { name: 'HR', rate: 98.1, late: 3, absent: 0 },
  { name: 'MARKETING', rate: 88.7, late: 18, absent: 4 },
];

export default function AdminReports() {
  const [exporting, setExporting] = useState(false);
  const [notification, setNotification] = useState(null);

  const handleExport = (format) => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      setNotification(`DATA_DUMP_COMPLETE: global_report_Q2.${format} exported successfully.`);
      setTimeout(() => setNotification(null), 3000);
    }, 1500);
  };

  // departmentStats is hoisted outside component
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col relative h-screen overflow-hidden">
        <Header />
        <div className="flex-1 overflow-y-auto w-full flex flex-col">
          <div className="p-margin-desktop md:p-margin-mobile flex-1">
            <div className="max-w-container-max mx-auto w-full relative">
              
              <header className="mb-8 hidden md:block flex justify-between items-end">
                <div>
                  <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight mb-2">Global Reports & Analytics</h1>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">&gt; query_stats --module=analytics --scope=global</p>
                </div>
              </header>

              {/* Notification Overlay */}
              {notification && (
                <div className="mb-6 bg-tertiary/10 border border-tertiary text-tertiary px-4 py-3 rounded font-code-inline text-sm flex items-center gap-3">
                  <span className="material-symbols-outlined">download_done</span>
                  {notification}
                </div>
              )}

              {/* Top KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-gutter">
                <div className="bg-surface-container border border-primary/30 rounded p-6">
                  <h3 className="font-label-md text-label-md text-primary uppercase tracking-widest mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">monitoring</span>
                    Global Attendance
                  </h3>
                  <p className="font-headline-lg text-[42px] leading-none font-bold text-primary">90.8%</p>
                  <p className="font-code-inline text-sm text-primary/70 mt-2">+2.4% vs last month</p>
                </div>
                <div className="bg-surface-container border border-outline-variant rounded p-6">
                  <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">timer</span>
                    Total Late Incidents
                  </h3>
                  <p className="font-headline-lg text-[42px] leading-none font-bold text-on-surface">61</p>
                  <p className="font-code-inline text-sm text-on-surface-variant mt-2">-12 incidents vs last month</p>
                </div>
                <div className="bg-surface-container border border-outline-variant rounded p-6">
                  <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">work_history</span>
                    Hours Logged
                  </h3>
                  <p className="font-headline-lg text-[42px] leading-none font-bold text-on-surface">42.5K</p>
                  <p className="font-code-inline text-sm text-on-surface-variant mt-2">Organization-wide total</p>
                </div>
              </div>

              {/* Departmental Breakdown */}
              <div className="bg-surface-container border border-outline-variant rounded p-6 mb-gutter">
                <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest flex items-center gap-2 mb-6">
                  <span className="material-symbols-outlined">account_tree</span>
                  Departmental Compliance Analysis
                </h3>
                
                <div className="space-y-6">
                  {departmentStats.map(dept => (
                    <div key={dept.name} className="flex flex-col gap-2">
                      <div className="flex justify-between items-center font-code-inline text-sm">
                        <span className="text-on-surface font-bold">{dept.name}</span>
                        <span className={`${dept.rate < 85 ? 'text-error' : 'text-primary'}`}>{dept.rate}%</span>
                      </div>
                      <div className="w-full bg-surface-container-highest rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-2 rounded-full transition-all duration-1000 ${dept.rate < 85 ? 'bg-error' : 'bg-primary'}`} 
                          style={{ width: `${dept.rate}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-on-surface-variant font-code-inline">
                        <span>LATE: {dept.late}</span>
                        <span>ABSENT: {dept.absent}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Extraction Tools */}
              <div className="bg-surface-container border border-tertiary/30 rounded p-6">
                <h3 className="font-label-md text-label-md text-tertiary uppercase tracking-widest flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined">terminal</span>
                  Data Extraction Modules
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">Execute commands to compile and download raw analytics data for external processing.</p>
                
                <div className="flex flex-wrap gap-4">
                  <button 
                    onClick={() => handleExport('csv')}
                    disabled={exporting}
                    className="bg-transparent border border-tertiary text-tertiary px-4 py-2 font-code-inline text-sm uppercase tracking-wider flex items-center gap-2 hover:bg-tertiary/10 transition-colors rounded disabled:opacity-50 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">csv</span>
                    {exporting ? 'EXTRACTING...' : '> extract --format=csv'}
                  </button>
                  <button 
                    onClick={() => handleExport('pdf')}
                    disabled={exporting}
                    className="bg-transparent border border-tertiary text-tertiary px-4 py-2 font-code-inline text-sm uppercase tracking-wider flex items-center gap-2 hover:bg-tertiary/10 transition-colors rounded disabled:opacity-50 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
                    {exporting ? 'EXTRACTING...' : '> extract --format=pdf'}
                  </button>
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
