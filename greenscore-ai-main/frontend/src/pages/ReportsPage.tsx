import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  FileText, 
  Printer, 
  Download, 
  ShieldCheck, 
  Building2, 
  Award, 
  CheckCircle2, 
  RefreshCw,
  Calendar,
  Layers
} from 'lucide-react';

interface ReportsPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({ onNavigate }) => {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.getSustainabilityAuditReport();
        setReport(res);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading || !report) {
    return (
      <div className="flex items-center justify-center h-96 text-emerald-400 text-sm">
        <div className="animate-spin mr-2 h-5 w-5 border-2 border-emerald-400 border-t-transparent rounded-full" />
        Compiling Municipal Sustainability Audit Report...
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const exec = report.executive_summary;

  return (
    <div className="space-y-6 pb-12 print:p-0 print:m-0">
      
      {/* Header Bar (Hidden during Print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-emerald-400" />
            <h1 className="text-2xl font-black text-white">Municipal Sustainability Audit Report</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              AUDIT READY
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Official executive summary, zone performance audit, budget utilization, and statistical impact verification.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-glow-emerald flex items-center space-x-2 self-start sm:self-auto"
        >
          <Printer className="h-4 w-4" />
          <span>Print / Export PDF Audit Report</span>
        </button>
      </div>

      {/* Printable Report Document Card */}
      <div className="glass-panel p-8 rounded-2xl border border-slate-700 bg-slate-950/95 space-y-8 print:border-none print:bg-white print:text-black">
        
        {/* Document Header */}
        <div className="border-b border-slate-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="h-3 w-3 rounded-full bg-emerald-400" />
              <h2 className="text-xl font-black text-white uppercase tracking-wider">{report.report_title}</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-semibold">Jurisdiction: {report.jurisdiction}</p>
          </div>

          <div className="text-right text-xs font-mono text-slate-400">
            <p className="font-bold text-white">{report.report_id}</p>
            <p className="text-[11px]">Generated: {new Date(report.generated_at).toLocaleString()}</p>
          </div>
        </div>

        {/* Section 1: Executive Summary */}
        <div className="space-y-3">
          <h3 className="font-bold text-emerald-400 text-sm uppercase tracking-wider">1. Executive Summary</h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <div>
              <span className="text-slate-400">City Green Score:</span>
              <p className="text-xl font-black text-emerald-400 mt-0.5">{exec.city_green_score} / 100 ({exec.tier})</p>
            </div>
            <div>
              <span className="text-slate-400">Mean AQI:</span>
              <p className="text-xl font-black text-amber-400 mt-0.5">{exec.air_quality_index}</p>
            </div>
            <div>
              <span className="text-slate-400">Waste Efficiency:</span>
              <p className="text-xl font-black text-white mt-0.5">{exec.waste_collection_efficiency}</p>
            </div>
            <div>
              <span className="text-slate-400">Budget Spent:</span>
              <p className="text-xl font-black text-cyan-300 mt-0.5">₹{(exec.total_budget_spent / 100000).toFixed(1)}L</p>
            </div>
          </div>
        </div>

        {/* Section 2: Zone Performance Breakdown */}
        <div className="space-y-3">
          <h3 className="font-bold text-emerald-400 text-sm uppercase tracking-wider">2. Monitored Zone Health Report Cards</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-900 text-slate-400 uppercase font-bold text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Zone</th>
                  <th className="py-2.5 px-3">Population</th>
                  <th className="py-2.5 px-3">Green Score</th>
                  <th className="py-2.5 px-3">30d Forecast</th>
                  <th className="py-2.5 px-3">AQI</th>
                  <th className="py-2.5 px-3">Waste Eff.</th>
                  <th className="py-2.5 px-3">Risk Tier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {report.zone_breakdown.map((z: any, i: number) => (
                  <tr key={i} className="hover:bg-slate-900/40">
                    <td className="py-2.5 px-3 font-bold text-white">{z.zone_name}</td>
                    <td className="py-2.5 px-3 text-slate-300">{z.population.toLocaleString()}</td>
                    <td className="py-2.5 px-3 font-bold text-emerald-400">{z.green_score}</td>
                    <td className="py-2.5 px-3 text-purple-300">{z.predicted_score_30d}</td>
                    <td className="py-2.5 px-3 text-amber-400">{z.aqi}</td>
                    <td className="py-2.5 px-3 text-slate-300">{z.waste_efficiency}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        z.risk_level === 'Critical' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        {z.risk_level}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Verified Impact Summary */}
        <div className="space-y-3">
          <h3 className="font-bold text-emerald-400 text-sm uppercase tracking-wider">3. Verified Municipal Impact Audit</h3>
          
          <div className="space-y-2">
            {report.verified_impact_summary.map((v: any, i: number) => (
              <div key={i} className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-white">Action ACT-2026-3392: Water Leakage Rectification</span>
                  <p className="text-slate-400 text-[11px] mt-0.5">Pre: {v.pre_val} pts → Post: {v.post_val} pts (+{v.measured_delta} pts Yield)</p>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-emerald-400">{v.attainment_pct} Attainment</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 block mt-0.5">
                    {v.verdict}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Signature Box */}
        <div className="pt-8 border-t border-slate-800 flex justify-between items-end text-xs text-slate-400">
          <div>
            <p className="font-bold text-slate-300">Auditor Signature:</p>
            <p className="font-mono text-emerald-400 mt-1">Autonomous Impact Verification Engine v1.0</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-slate-300">Municipal Authority:</p>
            <p className="mt-1">Dr. Anand Verma (Municipal Commissioner)</p>
          </div>
        </div>

      </div>

    </div>
  );
};
