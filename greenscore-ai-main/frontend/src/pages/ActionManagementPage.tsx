import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { ActionAssignment, Department, Zone } from '../types';
import { useAuth } from '../context/AuthContext';
import { 
  CheckSquare, 
  Building2, 
  MapPin, 
  Clock, 
  Upload, 
  CheckCircle2, 
  Plus, 
  ArrowRight,
  Filter,
  DollarSign,
  Calendar,
  Sparkles
} from 'lucide-react';

interface ActionManagementPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const ActionManagementPage: React.FC<ActionManagementPageProps> = ({ onNavigate }) => {
  const { role } = useAuth();
  const [actions, setActions] = useState<ActionAssignment[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [selectedDeptId, setSelectedDeptId] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  // Quick Progress Update Modal
  const [updatingAction, setUpdatingAction] = useState<ActionAssignment | null>(null);
  const [progressVal, setProgressVal] = useState<number>(50);
  const [actualCostVal, setActualCostVal] = useState<number>(0);
  const [evidenceNotesVal, setEvidenceNotesVal] = useState<string>('');
  const [evidencePhotoVal, setEvidencePhotoVal] = useState<string>('');

  const loadData = async () => {
    try {
      const [actList, deptList, zoneList] = await Promise.all([
        api.getActions(selectedDeptId),
        api.getDepartments(),
        api.getZones()
      ]);
      setActions(actList);
      setDepartments(deptList);
      setZones(zoneList);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedDeptId]);

  const handleOpenUpdate = (action: ActionAssignment) => {
    setUpdatingAction(action);
    setProgressVal(action.progress_pct);
    setActualCostVal(action.actual_cost || action.estimated_cost * 0.9);
    setEvidenceNotesVal(action.evidence_notes || '');
    setEvidencePhotoVal(action.evidence_photo_url || '');
  };

  const handleSaveProgress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updatingAction) return;

    try {
      await api.updateActionProgress(
        updatingAction.id,
        progressVal,
        actualCostVal,
        evidenceNotesVal,
        evidencePhotoVal,
        progressVal === 100 ? 'Completed' : (progressVal > 0 ? 'In Progress' : 'Assigned')
      );
      setUpdatingAction(null);
      await loadData();
    } catch (err: any) {
      alert(`Update error: ${err.message}`);
    }
  };

  const kanbanColumns = [
    { key: 'Assigned', title: '1. Assigned & Scheduled', color: 'border-blue-500/40 text-blue-400' },
    { key: 'In Progress', title: '2. In Active Execution', color: 'border-amber-500/40 text-amber-400' },
    { key: 'Completed', title: '3. Physical Completion', color: 'border-emerald-500/40 text-emerald-400' },
    { key: 'Verified', title: '4. Impact Verified', color: 'border-purple-500/40 text-purple-400' }
  ];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <CheckSquare className="h-5 w-5 text-emerald-400" />
            <h1 className="text-2xl font-black text-white">Department Action & Execution Pipeline</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              WORKFLOW & EVIDENCE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Department officers can update progress (0-100%), submit actual expenditures, and upload photographic completion evidence for impact verification.
          </p>
        </div>

        <button
          onClick={() => onNavigate('impact')}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-all shadow-glow-blue flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <span>Impact Verification Audits</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <span className="text-slate-400 font-bold uppercase text-[10px]">Filter Department:</span>
          <select
            value={selectedDeptId || ''}
            onChange={(e) => setSelectedDeptId(e.target.value ? Number(e.target.value) : undefined)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none"
          >
            <option value="">All Municipal Departments ({actions.length} Actions)</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.active_projects_count} Active)
              </option>
            ))}
          </select>
        </div>

        <span className="text-slate-400 font-mono text-[11px] hidden sm:inline">
          RBAC: Department Officers can update execution evidence
        </span>
      </div>

      {/* Kanban Board Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kanbanColumns.map((col) => {
          const colActions = actions.filter((a) => a.status === col.key);

          return (
            <div key={col.key} className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-3 flex flex-col">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className={`font-bold text-xs uppercase tracking-wider ${col.color}`}>{col.title}</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-900 text-slate-400 border border-slate-800">
                  {colActions.length}
                </span>
              </div>

              <div className="space-y-3 flex-1 overflow-y-auto max-h-[600px] pr-1">
                {colActions.map((act) => (
                  <div
                    key={act.id}
                    className="bg-slate-900/90 hover:bg-slate-850 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition-all space-y-3 shadow-md"
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">
                          {act.action_code}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          Due {new Date(act.deadline).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <h4 className="font-bold text-white text-xs mt-1.5 leading-snug">{act.title}</h4>
                      <p className="text-[11px] text-slate-400 mt-1 flex items-center">
                        <MapPin className="h-3 w-3 mr-1 text-slate-500" />
                        {act.zone_name} • {act.department_name}
                      </p>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                        <span>Progress:</span>
                        <span className="font-bold text-white">{act.progress_pct}%</span>
                      </div>
                      <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded-full transition-all"
                          style={{ width: `${act.progress_pct}%` }}
                        />
                      </div>
                    </div>

                    {act.evidence_notes && (
                      <p className="text-[10px] text-slate-300 italic bg-slate-950 p-2 rounded border border-slate-800/80 truncate">
                        "{act.evidence_notes}"
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px]">
                      <span className="text-slate-400">₹{(act.estimated_cost / 100000).toFixed(1)}L</span>
                      
                      <button
                        onClick={() => handleOpenUpdate(act)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 rounded-lg text-[10px] font-bold transition-all"
                      >
                        Update Progress
                      </button>
                    </div>
                  </div>
                ))}

                {colActions.length === 0 && (
                  <div className="text-center py-8 text-slate-600 text-xs italic">
                    No actions in this stage
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress & Evidence Update Modal */}
      {updatingAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <form onSubmit={handleSaveProgress} className="bg-[#0D1322] border border-[#1F293D] rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-start border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                  {updatingAction.action_code}
                </span>
                <h3 className="font-bold text-white text-base mt-1.5">{updatingAction.title}</h3>
                <p className="text-xs text-slate-400">{updatingAction.department_name} • {updatingAction.zone_name}</p>
              </div>
              <button
                type="button"
                onClick={() => setUpdatingAction(null)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            {/* Progress Slider */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="text-slate-300 font-bold">Execution Progress</span>
                <span className="font-black text-emerald-400 text-sm">{progressVal}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={progressVal}
                onChange={(e) => setProgressVal(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>0% (Assigned)</span>
                <span>50% (In Progress)</span>
                <span>100% (Completed)</span>
              </div>
            </div>

            {/* Actual Cost */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Actual Expenditure Incurred (₹)</label>
              <input
                type="number"
                value={actualCostVal}
                onChange={(e) => setActualCostVal(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Evidence Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Field Execution Notes & Observations</label>
              <textarea
                rows={3}
                value={evidenceNotesVal}
                onChange={(e) => setEvidenceNotesVal(e.target.value)}
                placeholder="Detail the physical intervention completed, metrics observed on the ground..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Evidence Photo */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Completion Photo URL (Optional)</label>
              <input
                type="text"
                value={evidencePhotoVal}
                onChange={(e) => setEvidencePhotoVal(e.target.value)}
                placeholder="https://..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setUpdatingAction(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-glow-emerald"
              >
                Save Progress & Evidence
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
