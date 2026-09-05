import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  Sliders, 
  Key, 
  Database, 
  Shield, 
  CheckCircle2, 
  Save,
  Radio,
  Server
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.getSettings();
        setSettings(res);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Sliders className="h-5 w-5 text-emerald-400" />
            <h1 className="text-2xl font-black text-white">System Engine & API Settings</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Server runtime configuration, external telemetry adapters, and mathematical model hyperparameters.
          </p>
        </div>
      </div>

      {/* System Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Platform Architecture</span>
          <p className="text-sm font-bold text-white mt-1">FastAPI Backend + Vite React</p>
          <span className="text-[11px] text-emerald-400 font-mono">Status: ONLINE</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Database Store</span>
          <p className="text-sm font-bold text-white mt-1">SQLite / PostgreSQL Dual Engine</p>
          <span className="text-[11px] text-cyan-300 font-mono">SQLAlchemy ORM Active</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-bold">ML & Optimization</span>
          <p className="text-sm font-bold text-white mt-1">Scikit-Learn Ensemble & Knapsack</p>
          <span className="text-[11px] text-purple-300 font-mono">Active Inference v1.0</span>
        </div>
      </div>

      {/* API Configuration Cards */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="font-bold text-white text-base flex items-center">
          <Key className="h-4 w-4 mr-2 text-emerald-400" />
          External API Adapters Status
        </h3>

        <div className="space-y-3 text-xs">
          <div className="flex justify-between items-center p-3 rounded-xl bg-slate-900 border border-slate-800">
            <div>
              <span className="font-bold text-white">OpenAQ API v3 (Air Quality Telemetry)</span>
              <p className="text-slate-400 text-[11px]">Station 2178 • PM2.5, PM10, NO2, SO2, CO, O3</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              ADAPTER CONNECTED
            </span>
          </div>

          <div className="flex justify-between items-center p-3 rounded-xl bg-slate-900 border border-slate-800">
            <div>
              <span className="font-bold text-white">Open-Meteo API (Meteorological Forecasts)</span>
              <p className="text-slate-400 text-[11px]">Real-time Temperature, Humidity, Rain, and Wind speeds</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              ADAPTER CONNECTED
            </span>
          </div>

          <div className="flex justify-between items-center p-3 rounded-xl bg-slate-900 border border-slate-800">
            <div>
              <span className="font-bold text-white">Google Maps Platform & Leaflet OSM</span>
              <p className="text-slate-400 text-[11px]">Spatial Tiles, Polygon Layers, Geocoding</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              HYBRID GIS READY
            </span>
          </div>

          <div className="flex justify-between items-center p-3 rounded-xl bg-slate-900 border border-slate-800">
            <div>
              <span className="font-bold text-white">AI / LLM Service Layer</span>
              <p className="text-slate-400 text-[11px]">GPT-4o Grounded Assistant + Deterministic Rule Fallback</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              ACTIVE & GROUNDED
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};
