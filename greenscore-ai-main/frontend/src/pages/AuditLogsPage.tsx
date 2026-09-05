import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { AuditLog } from '../types';
import { 
  History, 
  ShieldCheck, 
  FileText, 
  Coins, 
  CheckCircle2, 
  RefreshCw,
  Clock,
  User
} from 'lucide-react';

export const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  const loadLogs = async () => {
    try {
      const res = await api.getAuditLogs();
      setLogs(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <History className="h-5 w-5 text-emerald-400" />
            <h1 className="text-2xl font-black text-white">Immutable Municipal Audit Trail</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              AUDIT TRAIL
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Tamper-evident logs of administrative approvals, budget allocations, weight recalculations, and impact verifications.
          </p>
        </div>

        <button
          onClick={loadLogs}
          className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-300 text-xs font-bold transition-all flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Refresh Logs</span>
        </button>
      </div>

      {/* Log Entries */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
        {logs.map((l, i) => (
          <div
            key={i}
            className="bg-slate-900/80 hover:bg-slate-850 p-4 rounded-xl border border-slate-800/80 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
          >
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mt-0.5">
                <ShieldCheck className="h-4 w-4" />
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-white text-sm">{l.action_type.replace('_', ' ')}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-cyan-300 border border-slate-700">
                    {l.entity_type}
                  </span>
                </div>
                <p className="text-slate-300 mt-0.5">
                  Executed By: <strong className="text-white">{l.user_name}</strong> ({l.role})
                </p>
                {l.details_json && (
                  <p className="text-[11px] font-mono text-slate-400 mt-1 bg-slate-950 p-1.5 rounded border border-slate-800/80">
                    {l.details_json}
                  </p>
                )}
              </div>
            </div>

            <div className="text-right text-[11px] text-slate-500 font-mono shrink-0 self-end sm:self-center">
              <p>{new Date(l.timestamp).toLocaleDateString()}</p>
              <p>{new Date(l.timestamp).toLocaleTimeString()}</p>
            </div>
          </div>
        ))}

        {logs.length === 0 && (
          <div className="text-center py-12 text-slate-500 text-xs italic">
            No audit events recorded in database yet.
          </div>
        )}
      </div>

    </div>
  );
};
