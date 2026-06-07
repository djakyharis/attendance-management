import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function AdminSecurity() {
  const mockSecurityLogs = [
    { id: 'LOG-001', timestamp: '2026-06-07 19:45:12', severity: 'CRITICAL', event: 'Brute-force login attempt detected', details: 'Target: USR-001 | IP: 192.168.1.55' },
    { id: 'LOG-002', timestamp: '2026-06-07 18:30:05', severity: 'WARNING', event: 'Virtual camera bypass detected', details: 'Target: USR-042 | Action: Blocked' },
    { id: 'LOG-003', timestamp: '2026-06-07 18:15:20', severity: 'INFO', event: 'New user created', details: 'Target: USR-005 | Actor: ROOT' },
    { id: 'LOG-004', timestamp: '2026-06-07 14:02:11', severity: 'WARNING', event: 'Unauthorized route access', details: 'Target: /admin | Actor: USR-102' },
    { id: 'LOG-005', timestamp: '2026-06-07 09:00:00', severity: 'INFO', event: 'System daily backup completed', details: 'Size: 2.4GB | Status: Success' },
  ];

  const [filter, setFilter] = useState('ALL');

  const filteredLogs = filter === 'ALL' ? mockSecurityLogs : mockSecurityLogs.filter(log => log.severity === filter);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col relative h-screen overflow-hidden">
        <Header />
        <div className="flex-1 overflow-y-auto w-full flex flex-col">
          <div className="p-margin-desktop md:p-margin-mobile flex-1">
            <div className="max-w-container-max mx-auto w-full">
              
              <header className="mb-8 hidden md:block">
                <div>
                  <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight mb-2">Security & Audit Logs</h1>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">&gt; tail -f /var/log/syslog --filter={filter.toLowerCase()}</p>
                </div>
              </header>

              <div className="bg-surface-container border border-outline-variant rounded p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                    <span className="material-symbols-outlined">security</span>
                    System Events
                  </h3>
                  
                  <div className="flex gap-2 flex-wrap">
                    {['ALL', 'CRITICAL', 'WARNING', 'INFO'].map(level => (
                      <button
                        key={level}
                        onClick={() => setFilter(level)}
                        className={`px-3 py-1 text-xs font-bold tracking-widest uppercase rounded border transition-colors ${
                          filter === level
                            ? 'bg-primary/20 border-primary text-primary'
                            : 'bg-transparent border-outline-variant text-on-surface-variant hover:border-primary/50'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left font-body-sm text-body-sm border-collapse">
                    <thead>
                      <tr className="border-b border-outline-variant text-on-surface-variant font-label-md text-label-md uppercase">
                        <th className="py-3 px-4 font-normal">Timestamp</th>
                        <th className="py-3 px-4 font-normal">Severity</th>
                        <th className="py-3 px-4 font-normal">Event</th>
                        <th className="py-3 px-4 font-normal">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/50">
                      {filteredLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-surface-variant/50 transition-colors">
                          <td className="py-3 px-4 font-code-inline text-on-surface-variant">{log.timestamp}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center justify-center min-w-[80px] px-2 py-1 rounded text-[10px] uppercase tracking-widest font-bold border ${
                              log.severity === 'CRITICAL' ? 'bg-error/10 text-error border-error/30' :
                              log.severity === 'WARNING' ? 'bg-secondary/10 text-secondary border-secondary/30' :
                              'bg-tertiary/10 text-tertiary border-tertiary/30'
                            }`}>
                              {log.severity}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-on-surface font-code-inline">{log.event}</td>
                          <td className="py-3 px-4 text-on-surface-variant text-sm">{log.details}</td>
                        </tr>
                      ))}
                      {filteredLogs.length === 0 && (
                        <tr>
                          <td colSpan="4" className="py-8 text-center text-on-surface-variant font-code-inline">
                            <span className="material-symbols-outlined text-[32px] mb-2 block opacity-50">search_off</span>
                            No logs found for the selected filter.
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
