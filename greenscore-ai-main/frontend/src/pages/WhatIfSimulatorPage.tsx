import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Zone, SimulationResult } from '../types';
import { 
  Cpu, 
  Sparkles, 
  Trees, 
  Trash2, 
  Car, 
  Zap, 
  Droplets, 
  ArrowRight, 
  ShieldCheck, 
  Layers, 
  Info,
  RotateCcw
} from 'lucide-react';

interface WhatIfSimulatorPageProps {
  initialZoneId?: number;
  onNavigate: (page: string, params?: any) => void;
}

export const WhatIfSimulatorPage: React.FC<WhatIfSimulatorPageProps> = ({ initialZoneId, onNavigate }) => {
  const [zones, setZones] = useState<Zone[]>([]);
  const [selectedZoneId, setSelectedZoneId] = useState<number | undefined>(initialZoneId);
  
  // Simulation Sliders
  const [trees, setTrees] = useState<number>(650);
  const [wasteBoost, setWasteBoost] = useState<number>(15);
  const [evBuses, setEvBuses] = useState<number>(10);
  const [solarMw, setSolarMw] = useState<number>(2.5);
  const [waterRecycled, setWaterRecycled] = useState<number>(4.0);
  const [trafficRed, setTrafficRed] = useState<number>(10);

  const [simResult, setSimResult] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadZones() {
      try {
        const res = await api.getZones();
        setZones(res);
      } catch (e) {
        console.error(e);
      }
    }
    loadZones();
  }, []);

  const runSim = async () => {
    setLoading(true);
    try {
      const res = await api.runSimulation({
        zone_id: selectedZoneId,
        tree_plantation_count: trees,
        waste_collection_efficiency_pct_delta: wasteBoost,
        ev_bus_addition_count: evBuses,
        solar_power_capacity_mw_delta: solarMw,
        water_conservation_recycled_mld: waterRecycled,
        traffic_reduction_pct: trafficRed
      });
      setSimResult(res);
    } catch (e: any) {
      alert(`Simulation error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runSim();
  }, [selectedZoneId, trees, wasteBoost, evBuses, solarMw, waterRecycled, trafficRed]);

  const handleReset = () => {
    setTrees(0);
    setWasteBoost(0);
    setEvBuses(0);
    setSolarMw(0);
    setWaterRecycled(0);
    setTrafficRed(0);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Cpu className="h-5 w-5 text-blue-400" />
            <h1 className="text-2xl font-black text-white">What-If Intervention Simulator</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              SIMULATED / ESTIMATED
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Answers: <em>"What happens if we choose a different intervention?"</em> Model parameter sensitivity before committing municipal budget.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleReset}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-300 text-xs font-bold transition-all flex items-center space-x-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Sliders</span>
          </button>

          <button
            onClick={() => onNavigate('scenario-comparison')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-glow-blue flex items-center space-x-1.5"
          >
            <Layers className="h-4 w-4" />
            <span>Compare Scenarios (A vs B vs C)</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Parameter Sliders Sandbox */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-base">Intervention Parameters Sandbox</h3>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Target Zone:</span>
              <select
                value={selectedZoneId || ''}
                onChange={(e) => setSelectedZoneId(e.target.value ? Number(e.target.value) : undefined)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none"
              >
                <option value="">City-Wide Average</option>
                {zones.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.name} (Score: {z.current_green_score})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* 1. Tree Plantation */}
            <div className="space-y-2 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-bold flex items-center">
                  <Trees className="h-4 w-4 mr-1.5 text-emerald-400" />
                  Native Trees Planted
                </span>
                <span className="font-mono font-bold text-emerald-400">+{trees.toLocaleString()} Trees</span>
              </div>
              <input
                type="range"
                min="0"
                max="5000"
                step="50"
                value={trees}
                onChange={(e) => setTrees(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-900 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0</span>
                <span>2,500</span>
                <span>5,000 Trees</span>
              </div>
            </div>

            {/* 2. Waste Collection Boost */}
            <div className="space-y-2 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-bold flex items-center">
                  <Trash2 className="h-4 w-4 mr-1.5 text-orange-400" />
                  Waste Collection Boost
                </span>
                <span className="font-mono font-bold text-orange-400">+{wasteBoost}% Efficiency</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                step="1"
                value={wasteBoost}
                onChange={(e) => setWasteBoost(Number(e.target.value))}
                className="w-full accent-orange-500 cursor-pointer h-2 bg-slate-900 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0%</span>
                <span>+15%</span>
                <span>+30% Boost</span>
              </div>
            </div>

            {/* 3. EV Bus Fleet */}
            <div className="space-y-2 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-bold flex items-center">
                  <Car className="h-4 w-4 mr-1.5 text-blue-400" />
                  EV Electric Buses
                </span>
                <span className="font-mono font-bold text-blue-400">+{evBuses} EV Buses</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="2"
                value={evBuses}
                onChange={(e) => setEvBuses(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer h-2 bg-slate-900 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0</span>
                <span>25</span>
                <span>50 Buses</span>
              </div>
            </div>

            {/* 4. Solar Power Capacity */}
            <div className="space-y-2 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-bold flex items-center">
                  <Zap className="h-4 w-4 mr-1.5 text-yellow-400" />
                  Rooftop / Grid Solar
                </span>
                <span className="font-mono font-bold text-yellow-400">+{solarMw} MW</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={solarMw}
                onChange={(e) => setSolarMw(Number(e.target.value))}
                className="w-full accent-yellow-500 cursor-pointer h-2 bg-slate-900 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0 MW</span>
                <span>5 MW</span>
                <span>10 MW</span>
              </div>
            </div>

            {/* 5. Water Recycling */}
            <div className="space-y-2 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-bold flex items-center">
                  <Droplets className="h-4 w-4 mr-1.5 text-cyan-400" />
                  Treated Water Reuse
                </span>
                <span className="font-mono font-bold text-cyan-400">+{waterRecycled} MLD</span>
              </div>
              <input
                type="range"
                min="0"
                max="20"
                step="0.5"
                value={waterRecycled}
                onChange={(e) => setWaterRecycled(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-900 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0 MLD</span>
                <span>10 MLD</span>
                <span>20 MLD</span>
              </div>
            </div>

            {/* 6. Traffic Reduction */}
            <div className="space-y-2 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-bold flex items-center">
                  <Car className="h-4 w-4 mr-1.5 text-purple-400" />
                  Traffic Demand Management
                </span>
                <span className="font-mono font-bold text-purple-400">-{trafficRed}% Traffic</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                step="2"
                value={trafficRed}
                onChange={(e) => setTrafficRed(Number(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer h-2 bg-slate-900 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0%</span>
                <span>15%</span>
                <span>30% Cut</span>
              </div>
            </div>

          </div>

          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-center space-x-2">
            <Info className="h-4 w-4 text-blue-400 shrink-0" />
            <span>Sensitivity models use environmental engineering response coefficients calibrated to urban atmospheric dispersion.</span>
          </div>
        </div>

        {/* Right Col: Live Simulated Outcome Card */}
        {simResult && (
          <div className="glass-panel p-6 rounded-2xl border border-blue-500/40 shadow-2xl flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-white text-base">Projected Outcome</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  ESTIMATED
                </span>
              </div>

              {/* Score Transition */}
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Simulated Green Score</span>
                <div className="flex items-baseline justify-center space-x-3 my-2">
                  <span className="text-2xl font-black text-slate-400">{simResult.base_green_score}</span>
                  <span className="text-slate-500 font-bold">→</span>
                  <span className="text-4xl font-black text-emerald-400">{simResult.simulated_green_score}</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  +{simResult.score_delta} pts Improvement
                </span>
              </div>

              {/* Sub-deltas */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-400">AQI Impact:</span>
                  <span className="font-bold text-amber-400">
                    {simResult.base_aqi} → {simResult.simulated_aqi} ({simResult.aqi_delta} AQI)
                  </span>
                </div>

                <div className="flex justify-between items-center p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-400">Waste Collection:</span>
                  <span className="font-bold text-emerald-400">
                    {simResult.base_waste_eff}% → {simResult.simulated_waste_eff}% (+{simResult.waste_eff_delta}%)
                  </span>
                </div>

                <div className="flex justify-between items-center p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-400">CO2 Abatement:</span>
                  <span className="font-bold text-cyan-300">
                    -{simResult.projected_co2_reduction_tons} Tons / Year
                  </span>
                </div>

                <div className="flex justify-between items-center p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-400">Est. Implementation Cost:</span>
                  <span className="font-bold text-white font-mono">
                    ₹{simResult.estimated_implementation_cost.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('budget')}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-glow-emerald text-center"
            >
              Test in Budget Optimizer
            </button>
          </div>
        )}

      </div>

    </div>
  );
};
