import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AttendanceTable from '../components/AttendanceTable';

export default function ManagerAttendance() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col relative h-screen overflow-hidden">
        <Header />
        <div className="flex-1 overflow-y-auto w-full flex flex-col">
          <div className="p-margin-desktop md:p-margin-mobile flex-1">
            <div className="max-w-container-max mx-auto w-full">
            <header className="mb-8 hidden md:block">
              <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight mb-2">Department Roster</h1>
              <p className="font-body-sm text-body-sm text-on-surface-variant">&gt; fetch_roster --dept=ENGINEERING</p>
            </header>
            
            {/* We reuse the table component as a placeholder for the roster */}
            <div className="bg-surface-container border border-outline-variant p-4">
              <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-[16px]">groups</span>
                Today's Department Log
              </h3>
              <AttendanceTable />
              
              <div className="mt-4 p-4 border border-tertiary/20 bg-tertiary/5 text-sm text-tertiary font-code-inline flex items-center gap-2">
                <span className="material-symbols-outlined">info</span>
                Manager feature: "Review Photo" button will be integrated per row once backend supplies presigned URLs.
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
