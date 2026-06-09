import { useState, useMemo, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import apiService from '../services/apiService';

export default function AdminTeam() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [formData, setFormData] = useState({ fullName: '', email: '', userId: '', password: '', department: 'IT', role: 'EMPLOYEE', changePassword: false });
  const [notification, setNotification] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
            id: getAttr('profile') || getAttr('sub') || u.Username || u.id || 'Unknown',
            name: getAttr('name') || getAttr('email') || u.Username || 'Unknown',
            email: getAttr('email') || '',
            dept: getAttr('custom:department') || 'UNASSIGNED',
            role: u.role || u.group || u.GroupName || 'EMPLOYEE',
            raw: u
          };
        } else {
          return {
            id: u.profile || u.sub || u.id || u.userId || u.Username || 'Unknown',
            name: u.name || u['custom:name'] || u.username || u.email || 'Unknown',
            email: u.email || u.username || '',
            dept: u['custom:department'] || u.department || u.dept || 'UNASSIGNED',
            role: u.role || u.groupName || u.group || 'EMPLOYEE',
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
    if (selectedDept === 'ALL') return users;
    if (selectedDept === 'ADMIN') return users.filter(u => !u.dept || u.dept === 'N/A' || u.dept === 'UNASSIGNED');
    return users.filter(u => u.dept === selectedDept);
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
      let payload;
      const finalDepartment = formData.role === 'ADMIN' ? 'N/A' : formData.department;

      if (formData.isEdit) {
        payload = {
          action: 'update',
          username: formData.email || formData.userId,
          department: finalDepartment,
          name: formData.fullName,
          employeeId: formData.userId,
          groupName: groupName
        };
        if (formData.changePassword && formData.password) {
          payload.password = formData.password;
        }
      } else {
        payload = {
          action: 'create',
          email: formData.email,
          name: formData.fullName,
          employeeId: formData.userId,
          department: finalDepartment,
          groupName: groupName,
          password: formData.password
        };
      }
      
      const response = await apiService.manageUsers(payload);

      setNotification(`SUCCESS: ${response.message || (formData.isEdit ? 'User updated' : 'User created')}`);
      fetchUsers(); // Refresh the list
      
      setTimeout(() => {
        setShowCreateModal(false);
        setNotification(null);
        setFormData({ fullName: '', email: '', userId: '', password: '', department: 'IT', role: 'EMPLOYEE', isEdit: false, changePassword: false });
      }, 2000);
    } catch (error) {
      console.error(`Error ${formData.isEdit ? 'updating' : 'creating'} user:`, error);
      setErrorMsg(error.response?.data?.message || error.message || `Failed to ${formData.isEdit ? 'update' : 'create'} user`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);
    try {
      await apiService.manageUsers({ action: 'delete', username: userToDelete.email || userToDelete.id });
      setNotification(`SUCCESS: User ${userToDelete.name} deleted.`);
      fetchUsers();
      setTimeout(() => setNotification(null), 2000);
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('Failed to delete user.');
    } finally {
      setIsDeleting(false);
      setUserToDelete(null);
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
                      <button onClick={() => {
                        setShowCreateModal(false);
                        setFormData({ fullName: '', email: '', userId: '', password: '', department: 'IT', role: 'EMPLOYEE', isEdit: false, changePassword: false });
                      }} className="text-on-surface-variant hover:text-primary transition-colors absolute right-6">
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
                              <label className={`block font-label-md text-label-md uppercase ${formData.isEdit ? 'text-on-surface-variant' : 'text-on-surface'}`}>Email Address</label>
                              <input required type="email" disabled={formData.isEdit} className={`w-full bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 font-code-inline focus:border-primary outline-none transition-colors ${formData.isEdit ? 'text-on-surface-variant opacity-50 cursor-not-allowed' : 'text-on-surface'}`} placeholder="neo@attendsecure.sys" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="block font-label-md text-label-md text-on-surface uppercase">Employee ID</label>
                              <input required type="text" className="w-full bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 text-on-surface font-code-inline focus:border-primary outline-none transition-colors" placeholder="e.g. 5070523" value={formData.userId} onChange={e => setFormData({ ...formData, userId: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <label className={`block font-label-md text-label-md uppercase ${formData.isEdit && !formData.changePassword ? 'text-on-surface-variant' : 'text-on-surface'}`}>
                                  {formData.isEdit ? 'New Password' : 'Initial Password'}
                                </label>
                                {formData.isEdit && (
                                  <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                      type="checkbox" 
                                      className="accent-primary"
                                      checked={formData.changePassword} 
                                      onChange={e => setFormData({ ...formData, changePassword: e.target.checked })}
                                    />
                                    <span className="text-xs text-on-surface-variant font-label-md uppercase">Change?</span>
                                  </label>
                                )}
                              </div>
                              <input 
                                required={!formData.isEdit || formData.changePassword} 
                                disabled={formData.isEdit && !formData.changePassword}
                                type="text" 
                                className={`w-full bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 font-code-inline focus:border-primary outline-none transition-colors ${formData.isEdit && !formData.changePassword ? 'text-on-surface-variant opacity-50 cursor-not-allowed' : 'text-on-surface'}`} 
                                placeholder={formData.isEdit && !formData.changePassword ? "Unchanged" : "e.g. TempPass123!"} 
                                value={formData.isEdit && !formData.changePassword ? '' : formData.password} 
                                onChange={e => setFormData({ ...formData, password: e.target.value })} 
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className={`block font-label-md text-label-md uppercase ${formData.role === 'ADMIN' ? 'text-on-surface-variant' : 'text-on-surface'}`}>Department</label>
                              <select 
                                disabled={formData.role === 'ADMIN'}
                                className={`w-full bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 font-code-inline focus:border-primary outline-none transition-colors appearance-none ${formData.role === 'ADMIN' ? 'text-on-surface-variant opacity-50 cursor-not-allowed' : 'text-on-surface'}`} 
                                value={formData.role === 'ADMIN' ? 'N/A' : formData.department} 
                                onChange={e => setFormData({ ...formData, department: e.target.value })}
                              >
                                {formData.role === 'ADMIN' && <option value="N/A">N/A</option>}
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
                            <button type="button" onClick={() => {
                              setShowCreateModal(false);
                              setFormData({ fullName: '', email: '', userId: '', password: '', department: 'IT', role: 'EMPLOYEE', isEdit: false, changePassword: false });
                            }} className="px-4 py-2 border border-outline-variant text-on-surface-variant hover:bg-surface-variant rounded font-label-md uppercase tracking-wider transition-colors" disabled={isSubmitting}>Cancel</button>
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

              {/* Delete User Modal */}
              {userToDelete && (
                <div className="fixed inset-0 bg-surface/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                  <div className="bg-surface-container border border-error/30 shadow-[0_0_20px_rgba(242,141,168,0.15)] rounded w-full max-w-md overflow-hidden relative">
                    <div className="bg-error/10 px-6 py-4 border-b border-error/20 flex items-center justify-center relative">
                      <h2 className="font-headline-md text-headline-md text-error tracking-tight text-center flex items-center gap-2">
                        <span className="material-symbols-outlined">warning</span>
                        CONFIRM_DELETION
                      </h2>
                    </div>
                    <div className="p-6 text-center">
                      <p className="text-on-surface mb-6 font-body-lg">
                        Are you sure you want to permanently delete user <strong className="text-error">{userToDelete.name}</strong>?
                        <br/><span className="text-on-surface-variant text-sm mt-2 block">This action cannot be undone.</span>
                      </p>
                      <div className="flex justify-center gap-4">
                        <button onClick={() => setUserToDelete(null)} className="px-6 py-2 border border-outline-variant text-on-surface-variant hover:bg-surface-variant rounded font-label-md uppercase tracking-wider transition-colors" disabled={isDeleting}>Cancel</button>
                        <button onClick={handleDeleteUser} className="px-6 py-2 bg-error text-on-error hover:bg-[#ffb3c6] rounded font-label-md uppercase tracking-wider shadow-[0_0_10px_rgba(242,141,168,0.3)] transition-colors flex items-center gap-2" disabled={isDeleting}>
                          {isDeleting ? <span className="material-symbols-outlined animate-spin text-[18px]">sync</span> : null}
                          Delete User
                        </button>
                      </div>
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
                        <option value="ADMIN">Admins</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-[16px] text-on-surface-variant pointer-events-none">expand_more</span>
                    </div>
                  </div>
                  <button onClick={() => {
                    setFormData({ fullName: '', email: '', userId: '', password: '', department: 'IT', role: 'EMPLOYEE', isEdit: false, changePassword: false });
                    setShowCreateModal(true);
                  }} className="bg-primary text-on-primary px-4 py-2 font-label-md text-label-md uppercase tracking-wider flex items-center gap-2 hover:bg-primary-fixed transition-colors rounded">
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
                            <td className="py-3 px-4 text-right flex justify-end gap-2">
                              <button onClick={() => {
                                let r = 'EMPLOYEE';
                                const roleStr = Array.isArray(u.role) ? u.role[0] : u.role;
                                if (roleStr && typeof roleStr === 'string') {
                                  const lower = roleStr.toLowerCase();
                                  if (lower.includes('admin')) r = 'ADMIN';
                                  else if (lower.includes('manager')) r = 'MANAGER';
                                }
                                const d = (!u.dept || u.dept === 'N/A' || u.dept === 'UNASSIGNED') ? 'IT' : u.dept;
                                setFormData({ fullName: u.name, email: u.email, userId: u.id, password: '', department: d, role: r, isEdit: true, changePassword: false });
                                setShowCreateModal(true);
                              }} className="text-primary hover:text-primary-fixed transition-colors" title="Edit User">
                                <span className="material-symbols-outlined">edit</span>
                              </button>
                              <button onClick={() => setUserToDelete(u)} className="text-error hover:text-error-container transition-colors" title="Delete User">
                                <span className="material-symbols-outlined">delete</span>
                              </button>
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
