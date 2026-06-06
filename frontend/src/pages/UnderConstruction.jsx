import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function UnderConstruction({ title }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col relative h-screen overflow-hidden">
        <Header />
        <div className="flex-1 overflow-y-auto w-full flex flex-col">
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <span className="material-symbols-outlined text-[64px] text-error mb-4">gpp_maybe</span>
          <h1 className="font-headline-lg text-headline-lg text-primary tracking-widest uppercase mb-2">ACCESS RESTRICTED</h1>
          <p className="font-code-inline text-on-surface-variant max-w-md">
            The {title} module is currently offline or under construction. 
            Awaiting backend integration and security clearance.
          </p>
          <div className="mt-8 border border-error/30 bg-error/10 text-error px-4 py-2 font-code-inline text-sm animate-pulse">
            ERR_MODULE_NOT_FOUND
            </div>
          </div>
          <Footer />
        </div>
      </main>
    </div>
  );
}
