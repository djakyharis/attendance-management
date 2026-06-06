import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AttendanceTable from '../components/AttendanceTable';

export default function EmployeeAttendance() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col relative h-screen overflow-hidden">
        <Header />
        <div className="flex-1 overflow-y-auto w-full flex flex-col">
          <div className="p-margin-desktop md:p-margin-mobile flex-1">
            <div className="max-w-container-max mx-auto w-full">
            <header className="mb-8 hidden md:block">
              <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight mb-2">Personal Attendance Log</h1>
              <p className="font-body-sm text-body-sm text-on-surface-variant">&gt; fetch_history --user=SECURE_NODE_01</p>
            </header>
            
            <AttendanceTable />
            </div>
          </div>
          <Footer />
        </div>
      </main>
    </div>
  );
}
