import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../hooks/useAuth';
import { useState, useEffect } from 'react';
import apiService from '../services/apiService';

export default function ManagerTeam() {
  const { department } = useAuth();
  const deptName = department || 'IT';
  
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        setIsLoading(true);
        const data = await apiService.getEmployees();
        
        let usersList = [];
        if (Array.isArray(data)) {
          usersList = data;
        } else if (data && Array.isArray(data.employees)) {
          usersList = data.employees;
        } else if (data && Array.isArray(data.Users)) {
          usersList = data.Users;
        } else if (data && Array.isArray(data.users)) {
          usersList = data.users;
        } else if (data && typeof data === 'object') {
           const body = data.body ? (typeof data.body === 'string' ? JSON.parse(data.body) : data.body) : data;
           usersList = body.employees || body.Users || body.users || [];
        }

        // Map and filter for this manager's department
        const targetDept = deptName.toLowerCase();
        const mappedTeam = usersList.map(u => {
          if (u.Attributes && Array.isArray(u.Attributes)) {
            const getAttr = (name) => u.Attributes.find(a => a.Name === name)?.Value || '';
            return {
              id: getAttr('sub') || u.Username || u.id,
              name: getAttr('name') || getAttr('email') || u.Username || 'Unknown',
              email: getAttr('email') || '',
              dept: getAttr('custom:department') || 'UNASSIGNED',
              status: u.UserStatus || 'CONFIRMED'
            };
          } else {
            return {
              id: u.sub || u.id || u.userId || u.username || u.Username || 'Unknown',
              name: u.name || u['custom:name'] || u.profile || u.email || 'Unknown',
              email: u.email || '',
              dept: u['custom:department'] || u.department || u.dept || 'UNASSIGNED',
              status: u.status || u.UserStatus || 'CONFIRMED'
            };
          }
        }).filter(emp => (emp.dept || '').toLowerCase() === targetDept);

        setEmployees(mappedTeam);
      } catch (error) {
        console.error('Failed to fetch team roster', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTeam();
  }, [deptName]);

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
                <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight mb-2">Department Roster</h1>
                <p className="font-body-sm text-body-sm text-on-surface-variant">&gt; view_roster --dept={deptName}</p>
              </div>
            </header>
            
            <div className="bg-surface-container border border-outline-variant rounded p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                  <span className="material-symbols-outlined">folder_shared</span>
                  {deptName} Directory
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-body-sm text-body-sm border-collapse">
                  <thead>
                    <tr className="border-b border-outline-variant text-on-surface-variant font-label-md text-label-md uppercase">
                      <th className="py-3 px-4 font-normal">User ID</th>
                      <th className="py-3 px-4 font-normal">Name</th>
                      <th className="py-3 px-4 font-normal">Department</th>
                      <th className="py-3 px-4 font-normal">Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/50">
                    {isLoading ? (
                      <tr>
                        <td colSpan="4" className="py-8 text-center text-on-surface-variant font-code-inline">
                          <span className="material-symbols-outlined animate-spin text-[32px] mb-2 block opacity-50">sync</span>
                          Loading team directory...
                        </td>
                      </tr>
                    ) : employees.length > 0 ? (
                      employees.map((emp) => (
                        <tr key={emp.id} className="hover:bg-surface-variant/50 transition-colors">
                          <td className="py-3 px-4 font-code-inline text-on-surface text-xs">{emp.id}</td>
                          <td className="py-3 px-4 text-on-surface font-label-md uppercase">{emp.name}</td>
                          <td className="py-3 px-4 text-on-surface-variant">{emp.dept}</td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-surface-variant text-on-surface text-xs uppercase tracking-wider font-bold border border-outline-variant">
                              {emp.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="py-8 text-center text-on-surface-variant font-code-inline">
                          <span className="material-symbols-outlined text-[32px] mb-2 block opacity-50">search_off</span>
                          No team members found for {deptName} department.
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
