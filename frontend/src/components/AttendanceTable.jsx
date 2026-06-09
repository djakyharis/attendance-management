import { useState, useEffect, memo } from 'react';
import apiService from '../services/apiService';
import { useAuth } from '../hooks/useAuth';

// Component to handle lazy loading of the proof image
const AttendanceProof = memo(({ viewMode, defaultUrl, status, photoKey, onImageClick }) => {
  const [imageUrl, setImageUrl] = useState(defaultUrl || null);
  const [loading, setLoading] = useState(!defaultUrl && status !== 'Forbidden');
  
  useEffect(() => {
    let isMounted = true;
    const fetchUrl = async () => {
      if (defaultUrl || status === 'Forbidden') {
        setLoading(false);
        return;
      }
      try {
        const res = await apiService.getPhotoUrl(viewMode, photoKey);
        if (isMounted) {
          // The backend returns { viewUrl: '...' }
          let finalUrl = res?.viewUrl || res?.url || res?.photoUrl;
          if (!finalUrl && typeof res === 'string') finalUrl = res;
          setImageUrl(finalUrl || null);
        }
      } catch (err) {
        console.error('Failed to load proof image', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchUrl();
    return () => { isMounted = false; };
  }, [viewMode, defaultUrl, status, photoKey]);

  if (status === 'Forbidden') {
    return (
      <div className="w-12 h-8 rounded bg-surface-container-highest border border-outline-variant flex items-center justify-center">
        <span className="material-symbols-outlined text-[16px] text-error">broken_image</span>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-12 h-8 rounded bg-surface-container-highest border border-outline-variant flex items-center justify-center">
        <span className="material-symbols-outlined text-[16px] animate-spin text-primary">sync</span>
      </div>
    );
  }

  if (imageUrl) {
    return (
      <div 
        className="w-12 h-8 rounded bg-surface-container-highest border border-outline-variant overflow-hidden cursor-pointer hover:opacity-80 transition-opacity ring-1 ring-transparent hover:ring-primary"
        onClick={() => onImageClick && onImageClick(imageUrl)}
        title="Click to view full image"
      >
        <img src={imageUrl} alt="proof" className="w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div className="w-12 h-8 rounded bg-surface-container-highest border border-outline-variant flex items-center justify-center">
      <span className="material-symbols-outlined text-[16px] text-outline">image</span>
    </div>
  );
});

const AttendanceTable = memo(function AttendanceTable({ viewMode = 'employee', departmentFilter = 'ALL' }) {
  const { user, employeeId, name, department } = useAuth();
  const showEmployee = viewMode === 'manager' || viewMode === 'admin';
  const isAdmin = viewMode === 'admin';

  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      setIsLoading(true);
      try {
        // Fetch attendance logs
        const data = await apiService.getAttendance(viewMode);
        let fetchedLogs = [];
        if (Array.isArray(data)) fetchedLogs = data;
        else if (data && Array.isArray(data.items)) fetchedLogs = data.items;
        else if (data && Array.isArray(data.data)) fetchedLogs = data.data;
        else if (data && typeof data === 'object') {
           const body = data.body ? (typeof data.body === 'string' ? JSON.parse(data.body) : data.body) : data;
           fetchedLogs = Array.isArray(body) ? body : (body.items || body.data || []);
        }
        
        // If we need to show employee names (Manager/Admin view), fetch the user list for joining
        let userMap = {};
        if (showEmployee) {
          try {
            const usersData = await apiService.getEmployees(viewMode);
            
            let usersList = [];
            if (Array.isArray(usersData)) {
              usersList = usersData;
            } else if (usersData && Array.isArray(usersData.employees)) {
              usersList = usersData.employees;
            } else if (usersData && Array.isArray(usersData.Users)) {
              usersList = usersData.Users; // Standard AWS SDK format
            } else if (usersData && Array.isArray(usersData.users)) {
              usersList = usersData.users;
            } else if (usersData && typeof usersData === 'object') {
               // Just in case it's nested differently, e.g., { data: { employees: [] } }
               const body = usersData.body ? (typeof usersData.body === 'string' ? JSON.parse(usersData.body) : usersData.body) : usersData;
               usersList = body.employees || body.Users || body.users || [];
            }

            usersList.forEach(userItem => {
              // 1. AWS SDK Format (UserType with Attributes array)
              if (userItem.Attributes && Array.isArray(userItem.Attributes)) {
                const subAttr = userItem.Attributes.find(a => a.Name === 'sub');
                const nameAttr = userItem.Attributes.find(a => a.Name === 'name' || a.Name === 'custom:name' || a.Name === 'profile');
                
                if (subAttr && nameAttr) userMap[subAttr.Value] = nameAttr.Value;
                if (userItem.Username && nameAttr) userMap[userItem.Username] = nameAttr.Value;
              } 
              // 2. Custom mapped flattened object format
              else {
                const userId = userItem.sub || userItem.id || userItem.userId || userItem.Username || userItem.username;
                const userName = userItem.name || userItem['custom:name'] || userItem.profile || userItem.email || userItem.username;
                if (userId && userName) {
                  userMap[userId] = userName;
                }
              }
            });
          } catch (userErr) {
            console.error('Failed to fetch users for joining:', userErr);
          }
        }
        
        // Optional client side filtering
        if (isAdmin && departmentFilter !== 'ALL') {
          const filterDept = (departmentFilter || '').toLowerCase();
          fetchedLogs = fetchedLogs.filter(log => {
            const logDept = (log.dept || log.department || '').toLowerCase();
            return logDept === filterDept;
          });
        }

        // Map backend keys to expected keys
        const mappedLogs = fetchedLogs.map((log, index) => {
          // Format ISO timestamp to readable date
          let readableTime = log.timestamp || log.time || '';
          if (readableTime && readableTime.includes('T')) {
            const d = new Date(readableTime);
            if (!isNaN(d.getTime())) {
              readableTime = d.toLocaleString('en-GB', { 
                day: '2-digit', month: 'short', year: 'numeric', 
                hour: '2-digit', minute: '2-digit' 
              });
            }
          }
          
          // Capitalize status
          let statusText = log.status || 'Verified';
          if (statusText) statusText = statusText.charAt(0).toUpperCase() + statusText.slice(1);

          return {
            id: log.id || log.attendanceId || index,
            name: userMap[log.userId] || log.username || log.userName || log.name || log.userId || 'Unknown',
            dept: log.dept || log.department || 'N/A',
            time: readableTime,
            originalTime: log.timestamp || log.time,
            status: statusText,
            photoKey: log.photoKey || log.uploadUrl || null,
            proofUrl: (log.photoKey && log.photoKey.startsWith('http')) ? log.photoKey : (log.uploadUrl && log.uploadUrl.startsWith('http') ? log.uploadUrl : null),
            userId: log.userId || ''
          };
        });
        const sortedLogs = mappedLogs.sort((a, b) => {
          const timeA = new Date(a.originalTime || 0).getTime();
          const timeB = new Date(b.originalTime || 0).getTime();
          return timeB - timeA; // Descending (newest first)
        });
        
        setLogs(sortedLogs);
      } catch (error) {
        console.error('Failed to fetch attendance logs:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLogs();

    window.addEventListener('attendance_updated', fetchLogs);
    return () => window.removeEventListener('attendance_updated', fetchLogs);
  }, [departmentFilter, isAdmin, viewMode, employeeId, user?.userId, name, department]);

  return (
    <div className="bg-surface-container border border-outline-variant rounded p-1 overflow-x-auto">
      <div className="min-w-max p-4">
        <table className="w-full text-left font-body-sm text-body-sm border-collapse">
          <thead>
            <tr className="border-b border-outline-variant text-on-surface-variant font-label-md text-label-md uppercase">
              <th className="py-3 px-4 font-normal">Date / Time</th>
              {showEmployee && <th className="py-3 px-4 font-normal">Employee</th>}
              {isAdmin && <th className="py-3 px-4 font-normal">Department</th>}
              <th className="py-3 px-4 font-normal">Proof</th>
              <th className="py-3 px-4 font-normal">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/50">
            {isLoading ? (
              <tr>
                <td colSpan={showEmployee && isAdmin ? 5 : showEmployee ? 4 : 3} className="py-8 text-center text-on-surface-variant font-code-inline">
                  <span className="material-symbols-outlined animate-spin text-[32px] mb-2 block opacity-50">sync</span>
                  Fetching records...
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={showEmployee && isAdmin ? 5 : showEmployee ? 4 : 3} className="py-8 text-center text-on-surface-variant font-code-inline">
                  <span className="material-symbols-outlined text-[32px] mb-2 block opacity-50">history_toggle_off</span>
                  No attendance records found.
                </td>
              </tr>
            ) : logs.map((log) => (
              <tr key={log.id} className={`hover:bg-surface-variant/50 transition-colors ${log.status === 'Forbidden' ? 'bg-error-container/10' : ''}`}>
                <td className="py-3 px-4 font-code-inline text-on-surface">{log.time}</td>
                {showEmployee && (
                  <td className="py-3 px-4">
                    <div className="font-label-md text-on-surface uppercase">{log.name}</div>
                  </td>
                )}
                {isAdmin && (
                  <td className="py-3 px-4">
                    <span className="text-[10px] bg-surface-variant text-on-surface-variant px-2 py-1 rounded tracking-widest uppercase font-bold">{log.dept}</span>
                  </td>
                )}
                <td className="py-3 px-4">
                  <AttendanceProof 
                    viewMode={viewMode}
                    defaultUrl={log.proofUrl} 
                    status={log.status} 
                    photoKey={log.photoKey} 
                    onImageClick={setSelectedImage}
                  />
                </td>
                <td className="py-3 px-4">
                  {log.status.toLowerCase() === 'hadir' || log.status === 'Verified' ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-tertiary-container/10 text-tertiary text-xs uppercase tracking-wider font-bold border border-tertiary-container/20">
                      <span className="material-symbols-outlined text-[12px]">check_circle</span> {log.status}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-error/10 text-error text-xs uppercase tracking-wider font-bold border border-error/20">
                      <span className="material-symbols-outlined text-[12px]">warning</span> {log.status}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Image Modal Popout */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full flex justify-center animate-in zoom-in-95 duration-200">
            <button 
              className="absolute -top-12 right-0 text-white hover:text-primary transition-colors flex items-center gap-2 font-label-md uppercase tracking-wider cursor-pointer"
              onClick={() => setSelectedImage(null)}
            >
              <span className="material-symbols-outlined">close</span>
              Tutup
            </button>
            <img 
              src={selectedImage} 
              alt="Attendance Proof Full Size" 
              className="max-w-full max-h-[90vh] object-contain rounded-lg border border-outline-variant shadow-[0_0_50px_rgba(0,0,0,0.5)]"
              onClick={(e) => e.stopPropagation()} 
            />
          </div>
        </div>
      )}
    </div>
  );
});

export default AttendanceTable;
