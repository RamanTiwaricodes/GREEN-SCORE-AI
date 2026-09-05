import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Alert } from '../types';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle2, 
  X, 
  ShieldAlert, 
  Wind, 
  Trash2, 
  Droplets,
  ArrowRight
} from 'lucide-react';

interface AlertsPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const AlertsPage: React.FC<AlertsPageProps> = ({ onNavigate }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const res = await api.getAlerts();
      setAlerts(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDismiss = async (id: number) => {
    try {
      await api.dismissAlert(id);
      setAlerts(alerts.filter((a) => a.id !== id));
    } catch (e: any) {
      alert(`Error dismissing alert: ${e.message}`);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-red-400" />
            <h1 className="text-2xl font-black text-white">Early Warnings & Critical Alerts</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-500/20 text-red-400 border border-red-500/30">
              REAL-TIME THRESHOLDS
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Automated alerts triggered when particulate thresholds are violated, waste overflows occur, or Green Scores decline.
          </p>
        </div>

        <span className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 font-mono text-xs font-bold self-start sm:self-auto">
          {alerts.length} Active System Alerts
        </span>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {alerts.map((al) => {
          const isCrit = al.severity === 'Critical';
          const isHigh = al.severity === 'High';

          return (
            <div
              key={al.id}
              className={`glass-panel p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isCrit ? 'border-red-500/50 bg-red-500/5 shadow-glow-red' : (isHigh ? 'border-amber-500/40 bg-amber-500/5' : 'border-slate-800')
              }`}
            >
              <div className="flex items-start space-x-3.5">
                <div className={`p-2.5 rounded-xl mt-0.5 ${
                  isCrit ? 'bg-red-500/20 text-red-400' : (isHigh ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-300')
                }`}>
                  <AlertTriangle className="h-5 w-5" />
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-white text-base leading-tight">{al.title}</h3>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      isCrit ? 'bg-red-500 text-white font-black' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {al.severity}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{al.message}</p>
                  <p className="text-[11px] text-slate-500 mt-1.5">
                    Zone: <strong className="text-slate-300">{al.zone_name}</strong> • Trigger: <strong className="text-amber-400">{al.trigger_metric}</strong> • {new Date(al.created_at).toLocaleTimeString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                <button
                  onClick={() => onNavigate('budget')}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-glow-emerald"
                >
                  Allocate Intervention
                </button>
                <button
                  onClick={() => handleDismiss(al.id)}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition-all"
                  title="Dismiss Alert"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}

        {alerts.length === 0 && (
          <div className="glass-panel p-12 rounded-2xl border border-slate-800 text-center space-y-2">
            <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto" />
            <h3 className="font-bold text-white text-base">All Municipal Systems Operating Within Thresholds</h3>
            <p className="text-xs text-slate-400">No active critical alerts or environmental violations detected.</p>
          </div>
        )}
      </div>

    </div>
  );
};
