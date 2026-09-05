import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { ImpactVerification, ActionAssignment } from '../types';
import { ImpactComparisonChart } from '../components/charts/ImpactComparisonChart';
import { 
  Award, 
  CheckCircle2, 
  TrendingUp, 
  ShieldCheck, 
  AlertTriangle, 
  Building2, 
  MapPin, 
  ArrowRight,
  Sparkles,
  RefreshCw,
  Loader2
} from 'lucide-react';

interface ImpactVerificationPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const ImpactVerificationPage: React.FC<ImpactVerificationPageProps> = ({ onNavigate }) => {
  const [verifications, setVerifications] = useState<ImpactVerification[]>([]);
  const [completedActions, setCompletedActions] = useState<ActionAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifyingId, setVerifyingId] = useState<number | null>(null);

  const loadData = async () => {
    try {
      const [vList, aList] = await Promise.all([
        api.getImpactVerifications(),
        api.getActions()
      ]);
      setVerifications(vList);
      // Filter actions that are in progress or completed and not yet verified
      const unverified = aList.filter((a) => a.status !== 'Verified');
      setCompletedActions(unverified);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleVerifyAction = async (actionId: number) => {
    setVerifyingId(actionId);
    try {
      const res = await api.verifyActionImpact(actionId);
      alert(`Impact Verified Successfully! Goal Attainment: ${res.verification.goal_attainment_pct}%, Verdict: ${res.verification.verdict}. Zone Green Score updated to ${res.new_zone_score}!`);
      await loadData();
    } catch (e: any) {
      alert(`Verification error: ${e.message}`);
    } finally {
      setVerifyingId(null);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Award className="h-5 w-5 text-emerald-400" />
            <h1 className="text-2xl font-black text-white">Closed-Loop Impact Verification</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              AUDIT & MEASURE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Answers: <em>"Did the intervention actually improve the area?"</em> Compares pre-baseline telemetry against post-execution measurements to verify goal attainment.
          </p>
        </div>

        <button
          onClick={loadData}
          className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-300 text-xs font-bold transition-all flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Refresh Audits</span>
        </button>
      </div>

      {/* Top Banner: Predicted vs Measured Comparison Chart */}
      <div className="glass-panel p-6 rounded-2xl border border-[#1F293D] space-y-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white text-base">Predicted Impact vs Measured Actual Yield</h3>
            <p className="text-xs text-slate-400">Green Score Point Realization across completed municipal interventions.</p>
          </div>
          <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            {verifications.length} Verified Outlets
          </span>
        </div>

        {verifications.length > 0 ? (
          <ImpactComparisonChart verifications={verifications} />
        ) : (
          <div className="h-48 flex items-center justify-center text-slate-500 text-xs">
            No completed actions verified yet. Click "Run Verification Audit" below.
          </div>
        )}
      </div>

      {/* Pending Actions Ready for Verification */}
      {completedActions.length > 0 && (
        <div className="glass-panel p-6 rounded-2xl border border-blue-500/30 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
              <h3 className="font-bold text-white text-base">Actions Ready for Statistical Verification Audit</h3>
            </div>
            <span className="text-xs text-slate-400">{completedActions.length} Pending Verification</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completedActions.map((act) => (
              <div
                key={act.id}
                className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">
                      {act.action_code}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300">
                      {act.progress_pct}% Executed
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-sm mt-1.5">{act.title}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Zone: <strong className="text-slate-200">{act.zone_name}</strong> • Dept: <strong className="text-cyan-300">{act.department_name}</strong>
                  </p>
                  {act.evidence_notes && (
                    <p className="text-[11px] text-slate-300 italic mt-2 bg-slate-950 p-2 rounded-lg border border-slate-800">
                      "{act.evidence_notes}"
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <span className="text-[10px] text-slate-400">Cost: <strong>₹{act.actual_cost?.toLocaleString() || act.estimated_cost.toLocaleString()}</strong></span>
                  <button
                    onClick={() => handleVerifyAction(act.id)}
                    disabled={verifyingId === act.id}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-glow-emerald flex items-center space-x-1.5"
                  >
                    {verifyingId === act.id ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Auditing Post Telemetry...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Run Impact Audit</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Verified Impact Records */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="font-bold text-white text-base">Verified Municipal Impact Audit Log</h3>
        
        <div className="space-y-3">
          {verifications.map((v) => (
            <div
              key={v.id}
              className="bg-slate-900/90 p-5 rounded-xl border border-slate-800/90 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      {v.action_code}
                    </span>
                    <h4 className="font-bold text-white text-sm">{v.action_title}</h4>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Zone: <strong className="text-slate-200">{v.zone_name}</strong> • Verified By: <strong className="text-cyan-300">{v.verified_by}</strong>
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <span className="text-lg font-black text-emerald-400 font-mono">{v.goal_attainment_pct}%</span>
                    <span className="text-[9px] text-slate-400 uppercase font-bold block">Attainment</span>
                  </div>
                  <span className={`px-3 py-1 rounded-xl text-xs font-bold ${
                    v.verdict === 'Exceeded' || v.verdict === 'Achieved' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}>
                    {v.verdict}
                  </span>
                </div>
              </div>

              {/* Pre vs Post Comparison Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 text-center">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Pre-Baseline Score</span>
                  <p className="font-bold text-slate-300 mt-0.5">{v.pre_metric_val} pts</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Post-Measured Score</span>
                  <p className="font-bold text-emerald-400 mt-0.5">{v.post_metric_val} pts</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Target Forecast Gain</span>
                  <p className="font-bold text-purple-300 mt-0.5">+{v.predicted_delta} pts</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Actual Measured Gain</span>
                  <p className="font-bold text-emerald-400 mt-0.5">+{v.measured_delta} pts</p>
                </div>
              </div>

              {v.verification_notes && (
                <p className="text-xs text-slate-300 italic bg-slate-950/40 p-2.5 rounded-lg border border-slate-800">
                  Audit Notes: "{v.verification_notes}"
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
