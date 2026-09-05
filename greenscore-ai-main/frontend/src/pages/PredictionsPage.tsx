import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Zone, PredictionResponse } from '../types';
import { ForecastChart } from '../components/charts/ForecastChart';
import { 
  TrendingUp, 
  AlertTriangle, 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  Cpu, 
  Info,
  Clock,
  Sparkles
} from 'lucide-react';

interface PredictionsPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const PredictionsPage: React.FC<PredictionsPageProps> = ({ onNavigate }) => {
  const [zones, setZones] = useState<Zone[]>([]);
  const [selectedZoneId, setSelectedZoneId] = useState<number>(5); // Chowk default
  const [targetMetric, setTargetMetric] = useState<string>('GREEN_SCORE');
  const [timeframeDays, setTimeframeDays] = useState<number>(30);
  const [forecast, setForecast] = useState<PredictionResponse | null>(null);
  const [allSummaries, setAllSummaries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        const [zList, sums] = await Promise.all([
          api.getZones(),
          api.getAllZonesPredictions()
        ]);
        setZones(zList);
        setAllSummaries(sums);
      } catch (e) {
        console.error(e);
      }
    }
    init();
  }, []);

  useEffect(() => {
    async function fetchForecast() {
      if (!selectedZoneId) return;
      setLoading(true);
      try {
        const res = await api.getForecast(selectedZoneId, targetMetric, timeframeDays);
        setForecast(res);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchForecast();
  }, [selectedZoneId, targetMetric, timeframeDays]);

  const selectedZone = zones.find((z) => z.id === selectedZoneId);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-purple-400" />
            <h1 className="text-2xl font-black text-white">AI Urban State Prediction Engine</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
              Scikit-Learn ML
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            7-day and 30-day forecast curves with 95% confidence intervals to identify deterioration before crises occur.
          </p>
        </div>

        <button
          onClick={() => onNavigate('priority')}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-all shadow-glow-blue flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <span>Feed to Priority Engine</span>
          <Sparkles className="h-4 w-4" />
        </button>
      </div>

      {/* Control Bar: Zone, Metric, Timeframe */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Zone Selector */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Target Zone</label>
            <select
              value={selectedZoneId}
              onChange={(e) => setSelectedZoneId(Number(e.target.value))}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500 font-medium"
            >
              {zones.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.name} ({z.risk_level} Risk)
                </option>
              ))}
            </select>
          </div>

          {/* Metric Selector */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Target Metric</label>
            <select
              value={targetMetric}
              onChange={(e) => setTargetMetric(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500 font-medium"
            >
              <option value="GREEN_SCORE">Green Score (0-100)</option>
              <option value="AQI">Air Quality Index (AQI)</option>
              <option value="WASTE_EFFICIENCY">Waste Collection Efficiency (%)</option>
              <option value="WATER_SCORE">Water Health Score (%)</option>
              <option value="ENERGY">Energy Demand (MWh)</option>
            </select>
          </div>

          {/* Timeframe Toggle */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Forecast Horizon</label>
            <div className="flex space-x-1 bg-slate-900 p-0.5 rounded-xl border border-slate-700">
              <button
                onClick={() => setTimeframeDays(7)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  timeframeDays === 7 ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                7 Days (Short-Term)
              </button>
              <button
                onClick={() => setTimeframeDays(30)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  timeframeDays === 30 ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                30 Days (Strategic)
              </button>
            </div>
          </div>

        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-400 font-mono">
          <Cpu className="h-4 w-4 text-purple-400" />
          <span>Model: {forecast?.model_name || 'Random Forest Ensemble'}</span>
        </div>
      </div>

      {/* Main Prediction Visual Card */}
      {forecast && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Chart Left 2 Cols */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-base">
                  {forecast.zone_name} • {timeframeDays}-Day {targetMetric.replace('_', ' ')} Trajectory
                </h3>
                <p className="text-xs text-slate-400">
                  Historical baseline regression with weather covariates and seasonal coefficients.
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400">Confidence:</span>
                <span className="ml-1 font-bold text-emerald-400">{forecast.confidence_pct}%</span>
              </div>
            </div>

            <ForecastChart
              data={forecast.curve_points}
              metricLabel={targetMetric}
              unit={targetMetric === 'AQI' ? 'AQI' : (targetMetric.includes('EFFICIENCY') || targetMetric.includes('SCORE') ? 'pts' : 'units')}
              targetMetric={targetMetric}
            />

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
              <span className="flex items-center"><Info className="h-3.5 w-3.5 mr-1 text-purple-400" /> Prediction is decision support only and indicates projected baseline without intervention.</span>
              <span className="font-bold text-purple-300">PREDICTED DATA</span>
            </div>
          </div>

          {/* Diagnostic & Risk Summary Right Col */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Forecast Verdict</span>
                <div className="flex items-baseline space-x-3 mt-1">
                  <div>
                    <span className="text-xs text-slate-400">Current:</span>
                    <p className="text-xl font-black text-white">{forecast.current_val}</p>
                  </div>
                  <span className="text-slate-500 font-bold">→</span>
                  <div>
                    <span className="text-xs text-slate-400">{timeframeDays}-Day Target:</span>
                    <p className={`text-xl font-black ${
                      forecast.predicted_val < forecast.current_val && targetMetric.includes('SCORE')
                        ? 'text-red-400'
                        : 'text-emerald-400'
                    }`}>
                      {forecast.predicted_val}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-300 block mb-2">Key Risk Factors & Drivers:</span>
                <div className="space-y-2">
                  {forecast.risk_factors?.map((f, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 flex items-start space-x-2">
                      <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800">
              <button
                onClick={() => onNavigate('simulation', { zoneId: selectedZoneId })}
                className="w-full py-2.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 rounded-xl text-xs font-bold transition-all text-center"
              >
                Simulate Interventions to Prevent Decline
              </button>
            </div>
          </div>

        </div>
      )}

      {/* All Zones Risk Matrix */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="font-bold text-white text-base">City-Wide 30-Day Forecast Matrix</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allSummaries.map((s) => (
            <div
              key={s.zone_id}
              onClick={() => setSelectedZoneId(s.zone_id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selectedZoneId === s.zone_id ? 'bg-purple-500/10 border-purple-500/50 shadow-md' : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-white text-sm">{s.zone_name}</h4>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  s.risk_level === 'Critical' ? 'bg-red-500/20 text-red-400' : (s.risk_level === 'High' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400')
                }`}>
                  {s.risk_level} Risk
                </span>
              </div>

              <div className="flex items-baseline justify-between text-xs my-2">
                <span className="text-slate-400">Score: <strong>{s.current_score}</strong></span>
                <span className="font-bold text-purple-300">30d: {s.forecast_30d_score} pts</span>
              </div>

              <p className="text-[10px] text-slate-400 italic truncate">{s.key_risk_reason}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
