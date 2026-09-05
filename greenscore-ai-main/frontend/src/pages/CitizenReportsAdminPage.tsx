import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { CitizenReport, Zone, Department } from '../types';
import { 
  MessageSquarePlus, 
  Sparkles, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Building2, 
  ArrowRight,
  Filter,
  Eye,
  PlusCircle
} from 'lucide-react';

interface CitizenReportsAdminPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const CitizenReportsAdminPage: React.FC<CitizenReportsAdminPageProps> = ({ onNavigate }) => {
  const [reports, setReports] = useState<CitizenReport[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [selectedZoneId, setSelectedZoneId] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [rList, zList] = await Promise.all([
        api.getAllCitizenReports(selectedZoneId),
        api.getZones()
      ]);
      setReports(rList);
      setZones(zList);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedZoneId]);

  const handleUpdateStatus = async (reportId: number, newStatus: string) => {
    try {
      await api.updateReportStatus(reportId, newStatus);
      await loadData();
    } catch (e: any) {
      alert(`Error updating status: ${e.message}`);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <MessageSquarePlus className="h-5 w-5 text-emerald-400" />
            <h1 className="text-2xl font-black text-white">Citizen Grievance Triage Queue</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              AI CLASSIFIED QUEUE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Incoming citizen reports automatically classified by NLP and computer vision for instant departmental dispatch.
          </p>
        </div>

        <button
          onClick={() => onNavigate('citizen-report')}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-glow-emerald flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <PlusCircle className="h-4 w-4" />
          <span>New Citizen Ticket</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <span className="text-slate-400 font-bold uppercase text-[10px]">Filter Zone:</span>
          <select
            value={selectedZoneId || ''}
            onChange={(e) => setSelectedZoneId(e.target.value ? Number(e.target.value) : undefined)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none"
          >
            <option value="">All Zones ({reports.length} Reports)</option>
            {zones.map((z) => (
              <option key={z.id} value={z.id}>
                {z.name}
              </option>
            ))}
          </select>
        </div>

        <span className="text-slate-400 font-mono text-[11px] hidden sm:inline">
          Automatic Vision Triage: 92.4% Classification Accuracy
        </span>
      </div>

      {/* Reports Table / Card List */}
      <div className="space-y-3">
        {reports.map((rep) => (
          <div
            key={rep.id}
            className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-3">
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {rep.tracking_id}
                </span>
                <h3 className="font-bold text-white text-base leading-tight">{rep.category}</h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  rep.severity === 'Critical' || rep.severity === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {rep.severity} Severity
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-400">{new Date(rep.created_at).toLocaleDateString()}</span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
                  {rep.status}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
              "{rep.description}"
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Complainant</span>
                <p className="font-bold text-slate-200 mt-0.5">{rep.citizen_name} {rep.citizen_phone && `(${rep.citizen_phone})`}</p>
              </div>

              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Location / Zone</span>
                <p className="font-bold text-slate-200 mt-0.5 flex items-center">
                  <MapPin className="h-3.5 w-3.5 mr-1 text-slate-400" />
                  {rep.address || `${rep.zone_name}, Lucknow`}
                </p>
              </div>

              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold">AI Suggested Department</span>
                <p className="font-bold text-cyan-300 mt-0.5 flex items-center">
                  <Sparkles className="h-3.5 w-3.5 mr-1 text-cyan-400" />
                  {rep.ai_suggested_dept}
                </p>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-800 gap-2">
              <div className="flex items-center space-x-1.5 text-[11px]">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Change Status:</span>
                {['Under Review', 'Assigned', 'In Progress', 'Resolved'].map((st) => (
                  <button
                    key={st}
                    onClick={() => handleUpdateStatus(rep.id, st)}
                    className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all ${
                      rep.status === st ? 'bg-emerald-500 text-white font-bold' : 'bg-slate-800 hover:bg-slate-700 text-slate-400'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <button
                onClick={() => onNavigate('actions')}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all flex items-center space-x-1"
              >
                <span>Convert to Municipal Action</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
