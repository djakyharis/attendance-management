import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function AdminDashboard() {
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
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-gutter">
              {/* Card 1 */}
              <div className="bg-surface-container border border-outline-variant rounded p-6">
                <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-[18px]">public</span>
                  Total Active Users
                </h3>
                <p className="font-headline-lg text-[48px] leading-none font-bold text-on-surface">1,204</p>
                <p className="font-code-inline text-sm text-on-surface-variant mt-2">Organization-wide</p>
              </div>

              {/* Card 2 */}
              <div className="bg-surface-container border border-primary/30 rounded p-6">
                <h3 className="font-label-md text-label-md text-primary uppercase tracking-widest flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-[18px]">domain_verification</span>
                  Company Attendance
                </h3>
                <p className="font-headline-lg text-[48px] leading-none font-bold text-primary">89.2%</p>
                <p className="font-code-inline text-sm text-primary/70 mt-2">Live aggregate rate</p>
              </div>

              {/* Card 3 */}
              <div className="bg-surface-container border border-error/30 rounded p-6">
                <h3 className="font-label-md text-label-md text-error uppercase tracking-widest flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-[18px]">hourglass_top</span>
                  Pending Registrations
                </h3>
                <p className="font-headline-lg text-[48px] leading-none font-bold text-error">12</p>
                <p className="font-code-inline text-sm text-error/70 mt-2">Awaiting approval</p>
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
