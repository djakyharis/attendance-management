import { useState, useMemo, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import apiService from '../services/apiService';

export default function AdminTeam() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [formData, setFormData] = useState({ fullName: '', email: '', userId: '', password: '', department: 'IT', role: 'EMPLOYEE' });
  const [notification, setNotification] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const data = await apiService.manageUsers({ action: 'list' });
      let usersList = [];
      if (Array.isArray(data)) {
        usersList = data;
      } else if (data && Array.isArray(data.Users)) {
        usersList = data.Users;
      } else if (data && Array.isArray(data.users)) {
        usersList = data.users;
      } else if (data && typeof data === 'object') {
         const body = data.body ? (typeof data.body === 'string' ? JSON.parse(data.body) : data.body) : data;
         usersList = body.Users || body.users || [];
      }

      const mappedUsers = usersList.map(u => {
        if (u.Attributes && Array.isArray(u.Attributes)) {
          const getAttr = (name) => u.Attributes.find(a => a.Name === name)?.Value || '';
          return {
            id: getAttr('sub') || u.Username || u.id,
            name: getAttr('name') || getAttr('email') || u.Username || 'Unknown',
            email: getAttr('email') || '',
            dept: getAttr('custom:department') || 'UNASSIGNED',
            role: 'EMPLOYEE',
            raw: u
          };
        } else {
          return {
            id: u.sub || u.id || u.userId || u.Username || 'Unknown',
            name: u.name || u['custom:name'] || u.username || u.profile || u.email || 'Unknown',
            email: u.email || '',
            dept: u['custom:department'] || u.department || u.dept || 'UNASSIGNED',
            role: u.role || 'EMPLOYEE',
            raw: u
          };
        }
      });
      setUsers(mappedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return selectedDept === 'ALL' ? users : users.filter(u => u.dept === selectedDept);
  }, [selectedDept, users]);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);
    
    // Map role to groupName based on Department
    let groupName = `${formData.department}_employee`; // Default to Department_employee
    if (formData.role === 'ADMIN') groupName = 'super-admin';
    if (formData.role === 'MANAGER') groupName = `${formData.department}_manager`;

    try {
      const response = await apiService.manageUsers({
        action: 'create',
        email: formData.email,
        department: formData.department,
        groupName: groupName,
        password: formData.password,
        name: formData.fullName,
        employeeId: formData.userId
      });

      setNotification(`SUCCESS: ${response.message || 'User created'}`);
      fetchUsers(); // Refresh the list
      
      setTimeout(() => {
        setShowCreateModal(false);
        setNotification(null);
        setFormData({ fullName: '', email: '', userId: '', password: '', department: 'IT', role: 'EMPLOYEE' });
      }, 2000);
    } catch (error) {
      console.error('Error creating user:', error);
      setErrorMsg(error.response?.data?.message || error.message || 'Failed to create user');
    } finally {
      setIsSubmitting(false);
    }
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
                <div className="fixed inset-0 bg-surface/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                  <div className="bg-surface-container border border-outline-variant shadow-[0_0_20px_rgba(203,166,247,0.15)] rounded w-full max-w-md overflow-hidden relative">

                    {/* Modal Header */}
                    <div className="bg-surface-container-high px-6 py-4 border-b border-outline-variant flex items-center justify-center relative">
                      <h2 className="font-headline-md text-headline-md text-primary tracking-tight text-center">ADD_USER_PROTOCOL</h2>
                      <button onClick={() => setShowCreateModal(false)} className="text-on-surface-variant hover:text-primary transition-colors absolute right-6">
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
                          {errorMsg && (
                            <div className="bg-error/10 border border-error text-error px-3 py-2 rounded font-code-inline text-sm mb-4">
                              ERROR: {errorMsg}
                            </div>
                          )}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="block font-label-md text-label-md text-on-surface uppercase">Full Name</label>
                              <input required type="text" className="w-full bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 text-on-surface font-code-inline focus:border-primary outline-none transition-colors" placeholder="e.g. Neo Anderson" value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                              <label className="block font-label-md text-label-md text-on-surface uppercase">Email Address</label>
                              <input required type="email" className="w-full bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 text-on-surface font-code-inline focus:border-primary outline-none transition-colors" placeholder="neo@attendsecure.sys" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="block font-label-md text-label-md text-on-surface uppercase">Employee ID</label>
                              <input required type="text" className="w-full bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 text-on-surface font-code-inline focus:border-primary outline-none transition-colors" placeholder="e.g. 5070523" value={formData.userId} onChange={e => setFormData({ ...formData, userId: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                              <label className="block font-label-md text-label-md text-on-surface uppercase">Initial Password</label>
                              <input required type="text" className="w-full bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 text-on-surface font-code-inline focus:border-primary outline-none transition-colors" placeholder="e.g. TempPass123!" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="block font-label-md text-label-md text-on-surface uppercase">Department</label>
                              <select className="w-full bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 text-on-surface font-code-inline focus:border-primary outline-none transition-colors appearance-none" value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })}>
                                <option value="IT">IT</option>
                                <option value="Humas">Humas</option>
                              </select>
                            </div>
                            <div className="space-y-2">
                              <label className="block font-label-md text-label-md text-on-surface uppercase">Role</label>
                              <select className="w-full bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 text-on-surface font-code-inline focus:border-primary outline-none transition-colors appearance-none" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
                                <option>EMPLOYEE</option>
                                <option>MANAGER</option>
                                <option>ADMIN</option>
                              </select>
                            </div>
                          </div>
                          <div className="pt-4 flex justify-end gap-3">
                            <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 border border-outline-variant text-on-surface-variant hover:bg-surface-variant rounded font-label-md uppercase tracking-wider transition-colors" disabled={isSubmitting}>Cancel</button>
                            <button type="submit" className="px-4 py-2 bg-primary text-on-primary hover:bg-primary-fixed rounded font-label-md uppercase tracking-wider shadow-[0_0_10px_rgba(203,166,247,0.3)] transition-colors flex items-center gap-2" disabled={isSubmitting}>
                              {isSubmitting ? <span className="material-symbols-outlined animate-spin text-[18px]">sync</span> : null}
                              Deploy User
                            </button>
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
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                      <span className="material-symbols-outlined">folder_shared</span>
                      User Directory
                    </h3>
                    <div className="relative border border-outline-variant rounded bg-surface-container-highest">
                      <select
                        value={selectedDept}
                        onChange={e => setSelectedDept(e.target.value)}
                        className="bg-transparent appearance-none pl-3 pr-8 py-1.5 text-on-surface font-code-inline text-sm focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer w-[180px]"
                      >
                        <option value="ALL">ALL DEPARTMENTS</option>
                        <option value="IT">IT</option>
                        <option value="Humas">Humas</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-[16px] text-on-surface-variant pointer-events-none">expand_more</span>
                    </div>
                  </div>
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
                      {isLoading ? (
                        <tr>
                          <td colSpan="5" className="py-8 text-center text-on-surface-variant font-code-inline">
                            <span className="material-symbols-outlined animate-spin text-[32px] mb-2 block opacity-50">sync</span>
                            Fetching user directory...
                          </td>
                        </tr>
                      ) : filteredUsers.length > 0 ? (
                        filteredUsers.map((u) => (
                          <tr key={u.id} className="hover:bg-surface-variant/50 transition-colors">
                            <td className="py-3 px-4 font-code-inline text-on-surface">{u.id}</td>
                            <td className="py-3 px-4 text-on-surface">{u.name}</td>
                            <td className="py-3 px-4 text-on-surface-variant">{u.dept}</td>
                            <td className="py-3 px-4">
                              <span className={u.role === 'MANAGER' ? 'text-tertiary' : 'text-on-surface'}>{u.role}</span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button className="text-error hover:text-error-container" title="Block User"><span className="material-symbols-outlined">block</span></button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="py-8 text-center text-on-surface-variant font-code-inline">
                            <span className="material-symbols-outlined text-[32px] mb-2 block opacity-50">search_off</span>
                            No users found in this department.
                          </td>
                        </tr>
                      )}
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
