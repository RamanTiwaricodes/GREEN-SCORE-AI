import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Zone } from '../types';
import { DigitalTwinMap } from '../components/maps/DigitalTwinMap';
import { 
  Map, 
  Layers, 
  Sparkles, 
  Wind, 
  Trash2, 
  Droplets, 
  Trees, 
  ShieldCheck, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

interface DigitalTwinPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const DigitalTwinPage: React.FC<DigitalTwinPageProps> = ({ onNavigate }) => {
  const [zones, setZones] = useState<Zone[]>([]);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadZones() {
      try {
        const res = await api.getZones();
        setZones(res);
        if (res.length > 0) setSelectedZone(res[0]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadZones();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 text-emerald-400 text-sm">
        <div className="animate-spin mr-2 h-5 w-5 border-2 border-emerald-400 border-t-transparent rounded-full" />
        Rendering Digital Twin Spatial GIS Layers...
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Map className="h-5 w-5 text-emerald-400" />
            <h1 className="text-2xl font-black text-white">Urban Digital Twin GIS Cockpit</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              LUCKNOW SPATIAL TWIN
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time geospatial visualization of zone sustainability, air pollutant dispersion, waste accumulation hotspots, and citizen grievances.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onNavigate('simulation', { zoneId: selectedZone?.id })}
            className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 rounded-xl text-xs font-bold transition-all"
          >
            Simulate Selected Zone
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div className="h-[620px]">
        <DigitalTwinMap
          zones={zones}
          selectedZone={selectedZone}
          onSelectZone={(z) => setSelectedZone(z)}
          onNavigateToSimulator={(zid) => onNavigate('simulation', { zoneId: zid })}
          onNavigateToExplorer={(zid) => onNavigate('zones', { zoneId: zid })}
        />
      </div>

      {/* Zone Fast Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {zones.map((z) => (
          <button
            key={z.id}
            onClick={() => setSelectedZone(z)}
            className={`p-3 rounded-xl border text-left transition-all ${
              selectedZone?.id === z.id
                ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-glow-emerald'
                : 'glass-panel border-slate-800 text-slate-300 hover:bg-slate-850'
            }`}
          >
            <p className="text-xs font-bold truncate">{z.name}</p>
            <div className="flex items-baseline justify-between mt-1">
              <span className={`text-base font-black ${
                z.current_green_score >= 80 ? 'text-emerald-400' : (z.current_green_score >= 60 ? 'text-blue-400' : (z.current_green_score >= 40 ? 'text-amber-400' : 'text-red-400'))
              }`}>
                {z.current_green_score}
              </span>
              <span className="text-[10px] text-slate-400">AQI: {z.aqi}</span>
            </div>
          </button>
        ))}
      </div>

    </div>
  );
};
