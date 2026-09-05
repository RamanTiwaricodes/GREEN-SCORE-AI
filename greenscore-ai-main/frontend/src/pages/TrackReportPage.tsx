import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { CitizenReport } from '../types';
import { 
  Search, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Building2, 
  MapPin, 
  ShieldCheck, 
  AlertCircle,
  Calendar,
  Layers
} from 'lucide-react';

interface TrackReportPageProps {
  initialTrackingId?: string;
  onNavigate: (page: string) => void;
}

export const TrackReportPage: React.FC<TrackReportPageProps> = ({ initialTrackingId, onNavigate }) => {
  const [trackingId, setTrackingId] = useState(initialTrackingId || 'GS-2026-881294');
  const [report, setReport] = useState<CitizenReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stages = [
    { key: 'Submitted', label: '1. Submitted', desc: 'Ticket registered by citizen' },
    { key: 'AI Classified', label: '2. AI Classified', desc: 'NLP/Vision triage completed' },
    { key: 'Under Review', label: '3. Under Review', desc: 'Municipal authority validated' },
    { key: 'Assigned', label: '4. Assigned', desc: 'Dispatched to department' },
    { key: 'In Progress', label: '5. In Progress', desc: 'Field teams executing work' },
    { key: 'Resolved', label: '6. Resolved', desc: 'Physical cleanup completed' },
    { key: 'Verified', label: '7. Verified', desc: 'Post-audit impact verified' }
  ];

  const handleSearch = async (idToSearch?: string) => {
    const id = (idToSearch || trackingId).trim();
    if (!id) return;

    setLoading(true);
    setError(null);
    try {
      const res = await api.trackReport(id);
      setReport(res);
    } catch (err: any) {
      setError(err.message || 'Report not found');
      setReport(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialTrackingId) {
      handleSearch(initialTrackingId);
    } else {
      handleSearch('GS-2026-881294');
    }
  }, [initialTrackingId]);

  const getStageIndex = (status: string) => {
    const map: Record<string, number> = {
      'Submitted': 0,
      'AI Classified': 1,
      'Under Review': 2,
      'Assigned': 3,
      'In Progress': 4,
      'Resolved': 5,
      'Verified': 6
    };
    return map[status] ?? 4;
  };

  const currentStageIdx = report ? getStageIndex(report.status) : -1;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      
      {/* Header & Search */}
      <div>
        <h1 className="text-2xl font-black text-white">Track Grievance & Impact Progress</h1>
        <p className="text-xs text-slate-400 mt-1">
          Enter your unique Tracking ID to inspect the live municipal workflow stage and verified resolution status.
        </p>
      </div>

      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Enter Tracking ID (e.g. GS-2026-881294)..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white uppercase font-mono focus:outline-none focus:border-emerald-500"
          />
        </div>
        <button
          onClick={() => handleSearch()}
          disabled={loading}
          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-all shadow-glow-emerald"
        >
          {loading ? 'Searching...' : 'Track Ticket'}
        </button>
      </div>

      {/* Preset sample buttons */}
      <div className="flex items-center space-x-2 text-xs">
        <span className="text-slate-500 font-bold uppercase text-[10px]">Sample Tickets:</span>
        <button
          onClick={() => { setTrackingId('GS-2026-881294'); handleSearch('GS-2026-881294'); }}
          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 font-mono text-[11px]"
        >
          GS-2026-881294 (Chowk Waste)
        </button>
        <button
          onClick={() => { setTrackingId('GS-2026-772109'); handleSearch('GS-2026-772109'); }}
          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 font-mono text-[11px]"
        >
          GS-2026-772109 (Aliganj Leak)
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center space-x-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {report && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Main Card */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-2">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
                  {report.tracking_id}
                </span>
                <h3 className="text-lg font-bold text-white mt-1">{report.category}</h3>
                <p className="text-xs text-slate-400 flex items-center mt-0.5">
                  <MapPin className="h-3.5 w-3.5 mr-1 text-slate-500" />
                  {report.address || `${report.zone_name}, Lucknow`}
                </p>
              </div>

              <div className="text-right">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Status: {report.status}
                </span>
                <p className="text-[10px] text-slate-500 mt-1">Submitted: {new Date(report.created_at).toLocaleDateString()}</p>
              </div>
            </div>

            {/* 7-Stage Visual Lifecycle Stepper */}
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                7-Stage Municipal Action Lifecycle
              </p>

              <div className="relative">
                {/* Connecting Line */}
                <div className="hidden lg:block absolute top-1/2 left-4 right-4 h-0.5 bg-slate-800 -translate-y-1/2 z-0" />

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 relative z-10">
                  {stages.map((st, idx) => {
                    const isPassed = idx <= currentStageIdx;
                    const isCurrent = idx === currentStageIdx;

                    return (
                      <div
                        key={st.key}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          isCurrent
                            ? 'bg-emerald-500/20 border-emerald-400 shadow-glow-emerald text-white'
                            : isPassed
                            ? 'bg-slate-900/90 border-emerald-500/40 text-slate-200'
                            : 'bg-slate-950/60 border-slate-800 text-slate-500'
                        }`}
                      >
                        <div
                          className={`h-7 w-7 rounded-full mx-auto flex items-center justify-center mb-2 font-bold text-xs ${
                            isCurrent
                              ? 'bg-emerald-500 text-white animate-pulse'
                              : isPassed
                              ? 'bg-emerald-500/30 text-emerald-300'
                              : 'bg-slate-800 text-slate-600'
                          }`}
                        >
                          {isPassed ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
                        </div>
                        <p className="text-xs font-bold truncate">{st.label}</p>
                        <p className="text-[9px] text-slate-400 mt-0.5 leading-tight">{st.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Triage & Detail Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 text-xs">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Assigned Department</span>
                <p className="font-bold text-cyan-300 mt-1 flex items-center">
                  <Building2 className="h-3.5 w-3.5 mr-1 text-cyan-400" />
                  {report.ai_suggested_dept || 'Municipal Sanitation'}
                </p>
              </div>

              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 text-xs">
                <span className="text-[10px] text-slate-400 uppercase font-bold">AI Severity Triage</span>
                <p className="font-bold text-amber-400 mt-1 flex items-center">
                  <Sparkles className="h-3.5 w-3.5 mr-1 text-amber-400" />
                  {report.ai_severity || 'High'} ({report.ai_confidence || 94}% Confidence)
                </p>
              </div>

              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 text-xs">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Catchment Zone</span>
                <p className="font-bold text-emerald-400 mt-1 flex items-center">
                  <MapPin className="h-3.5 w-3.5 mr-1 text-emerald-400" />
                  {report.zone_name}
                </p>
              </div>
            </div>

            {/* Description & Photo */}
            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 text-xs space-y-2">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Reported Problem Description</span>
              <p className="text-slate-200 leading-relaxed">{report.description}</p>
              {report.ai_reason && (
                <p className="text-[11px] text-purple-300 italic pt-1 border-t border-slate-800">
                  AI Rationale: "{report.ai_reason}"
                </p>
              )}
            </div>

            {report.photo_url && (
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1.5">Submitted Photographic Evidence</span>
                <div className="rounded-xl overflow-hidden border border-slate-700 max-h-48 w-full sm:w-80">
                  <img src={report.photo_url} alt="Evidence" className="w-full h-full object-cover" />
                </div>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
