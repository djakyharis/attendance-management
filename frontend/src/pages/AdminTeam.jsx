import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function AdminTeam() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col relative h-screen overflow-hidden">
        <Header />
        <div className="flex-1 overflow-y-auto w-full flex flex-col">
          <div className="p-margin-desktop md:p-margin-mobile flex-1">
            <div className="max-w-container-max mx-auto w-full">
            <header className="mb-8 hidden md:block flex justify-between items-end">
              <div>
                <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight mb-2">Team Management</h1>
                <p className="font-body-sm text-body-sm text-on-surface-variant">&gt; admin_panel --manage-users</p>
              </div>
            </header>
            
            <div className="bg-surface-container border border-outline-variant rounded p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                  <span className="material-symbols-outlined">folder_shared</span>
                  User Directory
                </h3>
                <button className="bg-primary text-on-primary px-4 py-2 font-label-md text-label-md uppercase tracking-wider flex items-center gap-2 hover:bg-primary-fixed transition-colors">
                  <span className="material-symbols-outlined text-[18px]">person_add</span>
                  Create New User
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-body-sm text-body-sm border-collapse">
                  <thead>
                    <tr className="border-b border-outline-variant text-on-surface-variant font-label-md text-label-md uppercase">
                      <th className="py-3 px-4 font-normal">User ID</th>
                      <th className="py-3 px-4 font-normal">Name</th>
                      <th className="py-3 px-4 font-normal">Department</th>
                      <th className="py-3 px-4 font-normal">Role</th>
                      <th className="py-3 px-4 font-normal text-right">Controls</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/50">
                    <tr className="hover:bg-surface-variant/50 transition-colors">
                      <td className="py-3 px-4 font-code-inline text-on-surface">USR-001</td>
                      <td className="py-3 px-4 text-on-surface">John Doe</td>
                      <td className="py-3 px-4 text-on-surface-variant">ENGINEERING</td>
                      <td className="py-3 px-4"><span className="text-tertiary">MANAGER</span></td>
                      <td className="py-3 px-4 text-right">
                        <button className="text-error hover:text-error-container"><span className="material-symbols-outlined">block</span></button>
                      </td>
                    </tr>
                    <tr className="hover:bg-surface-variant/50 transition-colors">
                      <td className="py-3 px-4 font-code-inline text-on-surface">USR-002</td>
                      <td className="py-3 px-4 text-on-surface">Jane Smith</td>
                      <td className="py-3 px-4 text-on-surface-variant">ENGINEERING</td>
                      <td className="py-3 px-4"><span className="text-on-surface">EMPLOYEE</span></td>
                      <td className="py-3 px-4 text-right">
                        <button className="text-error hover:text-error-container"><span className="material-symbols-outlined">block</span></button>
                      </td>
                    </tr>
                  </tbody>
                </table>
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
