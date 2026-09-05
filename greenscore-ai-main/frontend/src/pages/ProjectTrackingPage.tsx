import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { ActionAssignment } from '../types';
import { 
  Layers, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Building2, 
  Image as ImageIcon,
  DollarSign,
  ArrowRight
} from 'lucide-react';

interface ProjectTrackingPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const ProjectTrackingPage: React.FC<ProjectTrackingPageProps> = ({ onNavigate }) => {
  const [actions, setActions] = useState<ActionAssignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.getActions();
        setActions(res);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Layers className="h-5 w-5 text-emerald-400" />
            <h1 className="text-2xl font-black text-white">Project Milestone & Evidence Vault</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              AUDIT TRAIL
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Gantt milestones, actual budget expenditures, and before-and-after photographic evidence records.
          </p>
        </div>

        <button
          onClick={() => onNavigate('impact')}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-glow-emerald flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <span>Run Impact Audits</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* Projects Grid with Evidence Photos */}
      <div className="space-y-4">
        {actions.map((act) => (
          <div key={act.id} className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                  {act.action_code}
                </span>
                <h3 className="text-base font-bold text-white mt-1.5">{act.title}</h3>
                <p className="text-xs text-slate-400 flex items-center mt-0.5">
                  <MapPin className="h-3.5 w-3.5 mr-1 text-slate-500" />
                  {act.zone_name} • {act.department_name}
                </p>
              </div>

              <div className="text-right">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  act.status === 'Verified' || act.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                }`}>
                  {act.status} ({act.progress_pct}%)
                </span>
                <p className="text-[10px] text-slate-400 mt-1">Deadline: {new Date(act.deadline).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Financial & Execution Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-center">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Estimated Cost</span>
                <p className="font-bold text-white mt-0.5">₹{(act.estimated_cost / 100000).toFixed(1)}L</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Actual Spent</span>
                <p className="font-bold text-emerald-400 mt-0.5">₹{(act.actual_cost / 100000).toFixed(1)}L</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Assigned Lead</span>
                <p className="font-bold text-slate-200 mt-0.5 truncate">{act.assigned_officer_name || 'Sanitation Lead'}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Completion Date</span>
                <p className="font-bold text-slate-300 mt-0.5">{act.completion_date ? new Date(act.completion_date).toLocaleDateString() : 'In Flight'}</p>
              </div>
            </div>

            {/* Evidence & Photo Vault */}
            {act.evidence_notes && (
              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Field Completion Evidence Log:</span>
                <p className="italic">"{act.evidence_notes}"</p>
              </div>
            )}

            {act.evidence_photo_url && (
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1.5 flex items-center">
                  <ImageIcon className="h-3.5 w-3.5 mr-1 text-emerald-400" />
                  Verified Field Photo Evidence
                </span>
                <div className="rounded-xl overflow-hidden border border-slate-700 max-h-48 w-full sm:w-80">
                  <img src={act.evidence_photo_url} alt="Field Evidence" className="w-full h-full object-cover" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};
