import React from 'react';
import { FileText, Download, Calendar, CheckCircle2 } from 'lucide-react';

const mockReports = [
  { title: 'Q3 2026 Executive Financial Statement', period: 'Jul 1 - Sep 30, 2026', size: '2.4 MB', date: 'Oct 01, 2026' },
  { title: 'September 2026 Monthly Reconciliation', period: 'Sep 1 - Sep 30, 2026', size: '1.1 MB', date: 'Oct 02, 2026' },
  { title: 'ARGUS AI Dispute & Chargeback Audit', period: 'Jan 1 - Sep 30, 2026', size: '4.8 MB', date: 'Oct 15, 2026' },
  { title: 'Top Performing SKUs & Regional Margins', period: 'Trailing 90 Days', size: '840 KB', date: 'Oct 20, 2026' }
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {mockReports.map((r, i) => (
          <div key={i} className="dashboard-card p-5 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">{r.title}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{r.period}</p>
                <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500">
                  <span>{r.size}</span>
                  <span>•</span>
                  <span>Generated {r.date}</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-[#202938] transition-colors shrink-0"
              title="Download Report"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
