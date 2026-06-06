export default function AttendanceTable() {
  return (
    <div className="mt-gutter bg-surface-container border border-outline-variant rounded p-1 overflow-x-auto">
      <div className="min-w-max p-4">
        <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px]">list_alt</span>
          Recent Verification Logs
        </h3>
        <table className="w-full text-left font-body-sm text-body-sm border-collapse">
          <thead>
            <tr className="border-b border-outline-variant text-on-surface-variant font-label-md text-label-md uppercase">
              <th className="py-3 px-4 font-normal">Date / Time</th>
              <th className="py-3 px-4 font-normal">Proof</th>
              <th className="py-3 px-4 font-normal">Location IP</th>
              <th className="py-3 px-4 font-normal">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/50">
            <tr className="hover:bg-surface-variant/50 transition-colors">
              <td className="py-3 px-4 font-code-inline text-on-surface">2023-10-27 08:55:12</td>
              <td className="py-3 px-4">
                <div className="w-12 h-8 bg-surface-container-highest border border-outline-variant flex items-center justify-center">
                  <span className="material-symbols-outlined text-[16px] text-outline">image</span>
                </div>
              </td>
              <td className="py-3 px-4 font-code-inline text-on-surface-variant">192.168.1.104</td>
              <td className="py-3 px-4">
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-tertiary-container/10 text-tertiary text-xs uppercase tracking-wider font-bold border border-tertiary-container/20">
                  <span className="material-symbols-outlined text-[12px]">check_circle</span> Verified
                </span>
              </td>
            </tr>
            <tr className="hover:bg-surface-variant/50 transition-colors">
              <td className="py-3 px-4 font-code-inline text-on-surface">2023-10-26 09:02:45</td>
              <td className="py-3 px-4">
                <div className="w-12 h-8 bg-surface-container-highest border border-outline-variant flex items-center justify-center">
                  <span className="material-symbols-outlined text-[16px] text-outline">image</span>
                </div>
              </td>
              <td className="py-3 px-4 font-code-inline text-on-surface-variant">192.168.1.104</td>
              <td className="py-3 px-4">
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-tertiary-container/10 text-tertiary text-xs uppercase tracking-wider font-bold border border-tertiary-container/20">
                  <span className="material-symbols-outlined text-[12px]">check_circle</span> Verified
                </span>
              </td>
            </tr>
            <tr className="hover:bg-surface-variant/50 transition-colors bg-error-container/10">
              <td className="py-3 px-4 font-code-inline text-on-surface">2023-10-25 08:45:01</td>
              <td className="py-3 px-4">
                <div className="w-12 h-8 bg-surface-container-highest border border-outline-variant flex items-center justify-center">
                  <span className="material-symbols-outlined text-[16px] text-error">broken_image</span>
                </div>
              </td>
              <td className="py-3 px-4 font-code-inline text-on-surface-variant">10.0.0.45</td>
              <td className="py-3 px-4">
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-error/10 text-error text-xs uppercase tracking-wider font-bold border border-error/20">
                  <span className="material-symbols-outlined text-[12px]">block</span> Forbidden
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
