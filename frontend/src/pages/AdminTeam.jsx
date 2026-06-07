import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function AdminTeam() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', email: '', userId: '', password: '', department: 'ENGINEERING', role: 'EMPLOYEE' });
  const [notification, setNotification] = useState(null);

  const handleCreateUser = (e) => {
    e.preventDefault();
    // Simulate API call
    setNotification(`SUCCESS: User ${formData.userId} created and added to directory.`);
    setTimeout(() => {
      setShowCreateModal(false);
      setNotification(null);
      setFormData({ fullName: '', email: '', userId: '', password: '', department: 'ENGINEERING', role: 'EMPLOYEE' });
    }, 2000);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col relative h-screen overflow-hidden">
        <Header />
        <div className="flex-1 overflow-y-auto w-full flex flex-col">
          <div className="p-margin-desktop md:p-margin-mobile flex-1">
            <div className="max-w-container-max mx-auto w-full relative">
            
            {/* Create User Modal */}
            {showCreateModal && (
              <div className="absolute inset-0 bg-surface/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-surface-container border border-outline-variant shadow-[0_0_20px_rgba(203,166,247,0.15)] rounded w-full max-w-md overflow-hidden relative">
                  
                  {/* Modal Header */}
                  <div className="bg-surface-container-high px-6 py-4 border-b border-outline-variant flex items-center justify-between">
                    <h2 className="font-headline-md text-headline-md text-primary tracking-tight">ADD_USER_PROTOCOL</h2>
                    <button onClick={() => setShowCreateModal(false)} className="text-on-surface-variant hover:text-primary transition-colors">
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  </div>

                  {/* Modal Body */}
                  <div className="p-6">
                    {notification ? (
                      <div className="bg-tertiary/10 border border-tertiary text-tertiary px-4 py-6 rounded font-code-inline text-sm flex flex-col items-center justify-center gap-3 text-center">
                        <span className="material-symbols-outlined text-[32px]">check_circle</span>
                        {notification}
                      </div>
                    ) : (
                      <form onSubmit={handleCreateUser} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="block font-label-md text-label-md text-on-surface uppercase">Full Name</label>
                            <input required type="text" className="w-full bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 text-on-surface font-code-inline focus:border-primary outline-none transition-colors" placeholder="e.g. Neo Anderson" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
                          </div>
                          <div className="space-y-2">
                            <label className="block font-label-md text-label-md text-on-surface uppercase">Email Address</label>
                            <input required type="email" className="w-full bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 text-on-surface font-code-inline focus:border-primary outline-none transition-colors" placeholder="neo@attendsecure.sys" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="block font-label-md text-label-md text-on-surface uppercase">Employee ID</label>
                            <input required type="text" className="w-full bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 text-on-surface font-code-inline focus:border-primary outline-none transition-colors" placeholder="e.g. 5070523" value={formData.userId} onChange={e => setFormData({...formData, userId: e.target.value})} />
                          </div>
                          <div className="space-y-2">
                            <label className="block font-label-md text-label-md text-on-surface uppercase">Initial Password</label>
                            <input required type="text" className="w-full bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 text-on-surface font-code-inline focus:border-primary outline-none transition-colors" placeholder="e.g. TempPass123!" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="block font-label-md text-label-md text-on-surface uppercase">Department</label>
                            <select className="w-full bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 text-on-surface font-code-inline focus:border-primary outline-none transition-colors appearance-none" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})}>
                              <option>ENGINEERING</option>
                              <option>SALES</option>
                              <option>HR</option>
                              <option>PRODUCT</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="block font-label-md text-label-md text-on-surface uppercase">Role</label>
                            <select className="w-full bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 text-on-surface font-code-inline focus:border-primary outline-none transition-colors appearance-none" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                              <option>EMPLOYEE</option>
                              <option>MANAGER</option>
                              <option>ADMIN</option>
                            </select>
                          </div>
                        </div>
                        <div className="pt-4 flex justify-end gap-3">
                          <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 border border-outline-variant text-on-surface-variant hover:bg-surface-variant rounded font-label-md uppercase tracking-wider transition-colors">Cancel</button>
                          <button type="submit" className="px-4 py-2 bg-primary text-on-primary hover:bg-primary-fixed rounded font-label-md uppercase tracking-wider shadow-[0_0_10px_rgba(203,166,247,0.3)] transition-colors">Deploy User</button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            )}

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
                <button onClick={() => setShowCreateModal(true)} className="bg-primary text-on-primary px-4 py-2 font-label-md text-label-md uppercase tracking-wider flex items-center gap-2 hover:bg-primary-fixed transition-colors rounded">
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
