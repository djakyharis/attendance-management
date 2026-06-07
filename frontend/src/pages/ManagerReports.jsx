import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AttendanceTable from '../components/AttendanceTable';
import { useAuth } from '../hooks/useAuth';

export default function ManagerReports() {
  const { department } = useAuth();
  const departmentName = department || "ENGINEERING";
  
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const handleExportCSV = () => {
    // Mock export functionality
    alert(`Exporting attendance records for ${departmentName} from ${startDate || 'beginning'} to ${endDate || 'now'} as CSV.`);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col relative h-screen overflow-hidden">
        <Header />
        <div className="flex-1 overflow-y-auto w-full flex flex-col">
          <div className="p-margin-desktop md:p-margin-mobile lg:p-margin-desktop flex-1">
            <div className="max-w-container-max mx-auto w-full">
              <header className="mb-8 hidden md:block">
                <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight mb-2">Terminal Access: Department Reports</h1>
                <p className="font-body-sm text-body-sm text-on-surface-variant">&gt; init_export --dept={departmentName}</p>
              </header>

              {/* Control Panel for Reports */}
              <div className="bg-surface-container border border-outline-variant rounded p-6 mb-gutter">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                  <div className="flex-1 w-full">
                    <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest flex items-center gap-2 mb-4">
                      <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                      Select Date Range
                    </h3>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1">
                        <label className="block font-body-sm text-on-surface-variant mb-1">Start Date</label>
                        <input 
                          type="date" 
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="w-full bg-surface-container-highest border border-outline-variant text-on-surface px-4 py-2 rounded focus:outline-none focus:border-primary transition-colors font-code-inline"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block font-body-sm text-on-surface-variant mb-1">End Date</label>
                        <input 
                          type="date" 
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="w-full bg-surface-container-highest border border-outline-variant text-on-surface px-4 py-2 rounded focus:outline-none focus:border-primary transition-colors font-code-inline"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full md:w-auto mt-2 md:mt-0">
                    <button 
                      onClick={handleExportCSV}
                      className="w-full md:w-auto bg-primary text-on-primary hover:bg-primary/90 px-6 py-3 rounded font-label-lg font-bold tracking-wide transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 h-[42px]"
                    >
                      <span className="material-symbols-outlined text-[20px]">download</span>
                      EXPORT TO CSV
                    </button>
                  </div>
                </div>
              </div>

              {/* Data Preview */}
              <div className="mt-8">
                <h2 className="font-headline-md text-headline-md text-primary tracking-tight mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined">table_chart</span>
                  Report Preview: {departmentName}
                </h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">&gt; display preview --limit=10</p>
                <div className="bg-surface-container border border-outline-variant rounded overflow-hidden">
                  <AttendanceTable />
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
