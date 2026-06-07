import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AttendanceTable from '../components/AttendanceTable';

export default function AdminAttendance() {
  const [selectedDept, setSelectedDept] = useState('ALL');
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col relative h-screen overflow-hidden">
        <Header />
        <div className="flex-1 overflow-y-auto w-full flex flex-col">
          <div className="p-margin-desktop md:p-margin-mobile flex-1">
            <div className="max-w-container-max mx-auto w-full">
            <header className="mb-8 hidden md:block">
              <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight mb-2">Global Verification Logs</h1>
              <p className="font-body-sm text-body-sm text-on-surface-variant">&gt; fetch logs --scope={selectedDept === 'ALL' ? 'all_departments' : selectedDept.toLowerCase()}</p>
            </header>
            
            <div className="bg-surface-container border border-outline-variant p-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">public</span>
                  Organization-wide Attendance Record
                </h3>
                
                {/* Department Filter */}
                <div className="flex items-center gap-2 bg-surface-container-highest px-3 py-1.5 border border-outline-variant rounded">
                  <span className="material-symbols-outlined text-[16px] text-secondary">filter_list</span>
                  <select 
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                    className="bg-transparent border-none text-on-surface font-label-md text-sm outline-none cursor-pointer uppercase tracking-wider"
                  >
                    <option value="ALL">All Departments</option>
                    <option value="ENGINEERING">Engineering</option>
                    <option value="SALES">Sales</option>
                    <option value="HR">HR</option>
                    <option value="MARKETING">Marketing</option>
                  </select>
                </div>
              </div>
              <AttendanceTable viewMode="admin" departmentFilter={selectedDept} />
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </main>
    </div>
  );
}
