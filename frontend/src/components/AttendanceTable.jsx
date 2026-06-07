export default function AttendanceTable({ viewMode = 'employee' }) {
  const isManager = viewMode === 'manager';

  const mockLogs = isManager ? [
    { id: 1, name: 'Alice Smith', role: 'Frontend Dev', time: '2026-06-07 08:55:12', ip: '192.168.1.104', status: 'Verified', proofUrl: 'https://i.pravatar.cc/150?u=alice' },
    { id: 2, name: 'Bob Johnson', role: 'Backend Dev', time: '2026-06-07 08:58:22', ip: '192.168.1.105', status: 'Verified', proofUrl: 'https://i.pravatar.cc/150?u=bob' },
    { id: 3, name: 'Charlie Lee', role: 'DevOps', time: '2026-06-07 09:05:01', ip: '10.0.0.45', status: 'Forbidden', proofUrl: null }
  ] : [
    { id: 1, time: '2026-06-07 08:55:12', ip: '192.168.1.104', status: 'Verified', proofUrl: 'https://i.pravatar.cc/150?u=current' },
    { id: 2, time: '2026-06-06 08:52:45', ip: '192.168.1.104', status: 'Verified', proofUrl: 'https://i.pravatar.cc/150?u=current' },
    { id: 3, time: '2026-06-05 08:45:01', ip: '10.0.0.45', status: 'Forbidden', proofUrl: null }
  ];

  return (
    <div className="bg-surface-container border border-outline-variant rounded p-1 overflow-x-auto">
      <div className="min-w-max p-4">
        <table className="w-full text-left font-body-sm text-body-sm border-collapse">
          <thead>
            <tr className="border-b border-outline-variant text-on-surface-variant font-label-md text-label-md uppercase">
              <th className="py-3 px-4 font-normal">Date / Time</th>
              {isManager && <th className="py-3 px-4 font-normal">Employee</th>}
              <th className="py-3 px-4 font-normal">Proof</th>
              <th className="py-3 px-4 font-normal">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/50">
            {mockLogs.map((log) => (
              <tr key={log.id} className={`hover:bg-surface-variant/50 transition-colors ${log.status === 'Forbidden' ? 'bg-error-container/10' : ''}`}>
                <td className="py-3 px-4 font-code-inline text-on-surface">{log.time}</td>
                {isManager && (
                  <td className="py-3 px-4">
                    <div className="font-label-md text-on-surface uppercase">{log.name}</div>
                  </td>
                )}
                <td className="py-3 px-4">
                  {log.proofUrl ? (
                    <div className="w-12 h-8 rounded bg-surface-container-highest border border-outline-variant overflow-hidden">
                      <img src={log.proofUrl} alt="proof" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-12 h-8 rounded bg-surface-container-highest border border-outline-variant flex items-center justify-center">
                      <span className={`material-symbols-outlined text-[16px] ${log.status === 'Forbidden' ? 'text-error' : 'text-outline'}`}>
                        {log.status === 'Forbidden' ? 'broken_image' : 'image'}
                      </span>
                    </div>
                  )}
                </td>
                <td className="py-3 px-4">
                  {log.status === 'Verified' ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-tertiary-container/10 text-tertiary text-xs uppercase tracking-wider font-bold border border-tertiary-container/20">
                      <span className="material-symbols-outlined text-[12px]">check_circle</span> Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-error/10 text-error text-xs uppercase tracking-wider font-bold border border-error/20">
                      <span className="material-symbols-outlined text-[12px]">block</span> Forbidden
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
