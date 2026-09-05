import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polygon } from 'react-leaflet';
import L from 'leaflet';
import { Zone } from '../../types';
import { 
  Layers, 
  MapPin, 
  Wind, 
  Trash2, 
  Droplets, 
  Trees, 
  AlertTriangle, 
  TrendingDown, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';

// Fix Leaflet marker icon issue in bundlers
const createCustomIcon = (color: string, score: number) => {
  return L.divIcon({
    className: 'custom-map-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 38px;
        height: 38px;
        border-radius: 50%;
        border: 3px solid #ffffff;
        box-shadow: 0 0 15px ${color};
        display: flex;
        align-items: center;
        justify-content: center;
        color: #ffffff;
        font-weight: 800;
        font-size: 11px;
        font-family: sans-serif;
      ">
        ${score}
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 19]
  });
};

interface DigitalTwinMapProps {
  zones: Zone[];
  selectedZone: Zone | null;
  onSelectZone: (zone: Zone) => void;
  onNavigateToSimulator?: (zoneId: number) => void;
  onNavigateToExplorer?: (zoneId: number) => void;
}

export const DigitalTwinMap: React.FC<DigitalTwinMapProps> = ({
  zones,
  selectedZone,
  onSelectZone,
  onNavigateToSimulator,
  onNavigateToExplorer
}) => {
  const [activeLayer, setActiveLayer] = useState<'score' | 'air' | 'waste' | 'water' | 'citizen'>('score');

  const getZoneColor = (score: number) => {
    if (score >= 80) return '#10B981'; // Green
    if (score >= 60) return '#3B82F6'; // Blue
    if (score >= 40) return '#F59E0B'; // Amber
    return '#EF4444'; // Red
  };

  // Lucknow coordinates center
  const centerLat = 26.8500;
  const centerLon = 80.9500;

  return (
    <div className="relative w-full h-[520px] rounded-2xl overflow-hidden border border-[#1F293D] shadow-2xl glass-panel">
      
      {/* Top Map Layer Controls */}
      <div className="absolute top-4 left-4 z-[1000] bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-700/80 flex items-center space-x-1 text-xs shadow-xl">
        <span className="text-[10px] font-bold text-slate-400 uppercase px-2 py-1 flex items-center">
          <Layers className="h-3.5 w-3.5 mr-1 text-emerald-400" />
          Layers:
        </span>
        
        <button
          onClick={() => setActiveLayer('score')}
          className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
            activeLayer === 'score' ? 'bg-emerald-500 text-white font-bold' : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          Green Score
        </button>

        <button
          onClick={() => setActiveLayer('air')}
          className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
            activeLayer === 'air' ? 'bg-amber-500 text-white font-bold' : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          AQI Heatmap
        </button>

        <button
          onClick={() => setActiveLayer('waste')}
          className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
            activeLayer === 'waste' ? 'bg-orange-500 text-white font-bold' : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          Waste Hotspots
        </button>

        <button
          onClick={() => setActiveLayer('citizen')}
          className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
            activeLayer === 'citizen' ? 'bg-blue-500 text-white font-bold' : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          Citizen Reports
        </button>
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-700 text-[11px] shadow-xl space-y-1">
        <p className="font-bold text-slate-300 text-[10px] uppercase tracking-wider">Sustainability Tiers</p>
        <div className="flex items-center space-x-3">
          <span className="flex items-center"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500 mr-1"></span> ≥80 Excellent</span>
          <span className="flex items-center"><span className="h-2.5 w-2.5 rounded-full bg-blue-500 mr-1"></span> 60-79 Good</span>
          <span className="flex items-center"><span className="h-2.5 w-2.5 rounded-full bg-amber-500 mr-1"></span> 40-59 Moderate</span>
          <span className="flex items-center"><span className="h-2.5 w-2.5 rounded-full bg-red-500 mr-1"></span> &lt;40 Critical</span>
        </div>
      </div>

      {/* Leaflet Map */}
      <MapContainer
        center={[centerLat, centerLon]}
        zoom={12}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {zones.map((zone) => {
          const color = getZoneColor(zone.current_green_score);
          const icon = createCustomIcon(color, Math.round(zone.current_green_score));

          return (
            <React.Fragment key={zone.id}>
              {/* Radial heat glow around zone */}
              <Circle
                center={[zone.latitude, zone.longitude]}
                radius={activeLayer === 'air' ? zone.aqi * 18 : 1800}
                pathOptions={{
                  color: activeLayer === 'air' ? (zone.aqi > 150 ? '#EF4444' : '#F59E0B') : color,
                  fillColor: activeLayer === 'air' ? (zone.aqi > 150 ? '#EF4444' : '#F59E0B') : color,
                  fillOpacity: selectedZone?.id === zone.id ? 0.35 : 0.18,
                  weight: selectedZone?.id === zone.id ? 3 : 1
                }}
              />

              {/* Zone Score Marker */}
              <Marker
                position={[zone.latitude, zone.longitude]}
                icon={icon}
                eventHandlers={{
                  click: () => onSelectZone(zone)
                }}
              >
                <Popup>
                  <div className="p-1 min-w-[200px]">
                    <div className="flex items-center justify-between border-b border-slate-700 pb-1.5 mb-2">
                      <h4 className="font-bold text-white text-sm">{zone.name}</h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        zone.risk_level === 'Critical' ? 'bg-red-500/20 text-red-400' : (zone.risk_level === 'High' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400')
                      }`}>
                        {zone.risk_level} Risk
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 text-xs text-slate-300 mb-2">
                      <div>Green Score: <strong className="text-emerald-400">{zone.current_green_score}</strong></div>
                      <div>AQI: <strong className={zone.aqi > 150 ? 'text-red-400' : 'text-amber-400'}>{zone.aqi}</strong></div>
                      <div>Waste Eff: <strong>{zone.waste_efficiency}%</strong></div>
                      <div>Pop: <strong>{zone.population.toLocaleString()}</strong></div>
                    </div>

                    <button
                      onClick={() => onSelectZone(zone)}
                      className="w-full text-center py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold transition-colors"
                    >
                      Inspect Zone
                    </button>
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          );
        })}
      </MapContainer>

      {/* Selected Zone Quick Drawer */}
      {selectedZone && (
        <div className="absolute top-4 right-4 z-[1000] w-80 bg-slate-900/95 backdrop-blur-md p-4 rounded-2xl border border-slate-700 shadow-2xl animate-in slide-in-from-right duration-200">
          <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
            <div>
              <h3 className="font-bold text-white text-base leading-tight">{selectedZone.name}</h3>
              <p className="text-[11px] text-slate-400">Catchment: {selectedZone.population.toLocaleString()} Residents</p>
            </div>
            <div className="text-right">
              <span className={`text-xl font-black ${
                selectedZone.current_green_score >= 80 ? 'text-emerald-400' : (selectedZone.current_green_score >= 60 ? 'text-blue-400' : (selectedZone.current_green_score >= 40 ? 'text-amber-400' : 'text-red-400'))
              }`}>
                {selectedZone.current_green_score}
              </span>
              <p className="text-[9px] text-slate-400 uppercase font-bold">Green Score</p>
            </div>
          </div>

          <div className="space-y-2 text-xs mb-4">
            <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
              <span className="text-slate-400 flex items-center"><Wind className="h-3.5 w-3.5 mr-1 text-blue-400" /> Air Quality (AQI)</span>
              <span className={`font-bold ${selectedZone.aqi > 150 ? 'text-red-400' : 'text-amber-400'}`}>{selectedZone.aqi}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
              <span className="text-slate-400 flex items-center"><Trash2 className="h-3.5 w-3.5 mr-1 text-orange-400" /> Waste Efficiency</span>
              <span className="font-bold text-slate-200">{selectedZone.waste_efficiency}%</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
              <span className="text-slate-400 flex items-center"><Droplets className="h-3.5 w-3.5 mr-1 text-cyan-400" /> Water Health</span>
              <span className="font-bold text-slate-200">{selectedZone.water_score}%</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
              <span className="text-slate-400 flex items-center"><Trees className="h-3.5 w-3.5 mr-1 text-emerald-400" /> Green Canopy</span>
              <span className="font-bold text-slate-200">{selectedZone.green_cover_pct}%</span>
            </div>
          </div>

          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 mb-3 text-[11px]">
            <div className="flex items-center justify-between font-bold mb-1">
              <span className="text-purple-300">30-Day Forecast:</span>
              <span className={selectedZone.predicted_green_score < selectedZone.current_green_score ? 'text-red-400' : 'text-emerald-400'}>
                {selectedZone.predicted_green_score} pts
              </span>
            </div>
            <p className="text-slate-400 text-[10px]">
              {selectedZone.predicted_green_score < selectedZone.current_green_score
                ? '⚠️ Risk of score degradation due to seasonal congestion and waste accumulation.'
                : '✅ Positive sustainability trajectory expected.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onNavigateToSimulator && onNavigateToSimulator(selectedZone.id)}
              className="px-3 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 rounded-xl text-xs font-bold transition-all text-center"
            >
              Simulate
            </button>
            <button
              onClick={() => onNavigateToExplorer && onNavigateToExplorer(selectedZone.id)}
              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all text-center shadow-glow-emerald"
            >
              Full Deep-Dive
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
