import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  MapPin,
  TrendingUp,
  BarChart3,
  ListOrdered,
  Sparkles,
  Coins,
  Cpu,
  Layers,
  Map,
  FileText,
  Building2,
  CheckSquare,
  Award,
  Bell,
  Bot,
  Users,
  History,
  Sliders,
  Home,
  MessageSquarePlus,
  Search,
  Globe,
  Wind
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate }) => {
  const { role } = useAuth();

  const publicNavItems = [
    { key: 'landing', label: 'Landing Page', icon: Home },
    { key: 'public-dashboard', label: 'Public City Dashboard', icon: Globe },
    { key: 'citizen-report', label: 'Report Issue', icon: MessageSquarePlus },
    { key: 'track-report', label: 'Track Report', icon: Search }
  ];

  const adminNavSections = [
    {
      title: 'Command Center',
      items: [
        { key: 'dashboard', label: 'Command Dashboard', icon: LayoutDashboard },
        { key: 'city-overview', label: 'City Overview', icon: Globe },
        { key: 'zones', label: 'Zone Explorer', icon: MapPin },
        { key: 'sustainability-score', label: 'Green Score Engine', icon: BarChart3 },
        { key: 'environmental-intel', label: 'Environmental Intel', icon: Wind }
      ]
    },
    {
      title: 'AI Decision Engines',
      items: [
        { key: 'predictions', label: 'AI Predictions', icon: TrendingUp },
        { key: 'priority', label: 'AI Priority Engine', icon: ListOrdered },
        { key: 'recommendations', label: 'AI Recommendations', icon: Sparkles },
        { key: 'budget', label: 'Smart Budget Optimizer', icon: Coins },
        { key: 'simulation', label: 'What-If Simulator', icon: Cpu },
        { key: 'scenario-comparison', label: 'Scenario Comparison', icon: Layers },
        { key: 'digital-twin', label: 'Digital Twin Map', icon: Map }
      ]
    },
    {
      title: 'Execution & Verification',
      items: [
        { key: 'citizen-reports-admin', label: 'Citizen Reports Queue', icon: MessageSquarePlus },
        { key: 'actions', label: 'Action Management', icon: CheckSquare },
        { key: 'departments', label: 'Department Management', icon: Building2 },
        { key: 'projects', label: 'Project Tracking', icon: Layers },
        { key: 'impact', label: 'Impact Verification', icon: Award }
      ]
    },
    {
      title: 'Governance & Assistant',
      items: [
        { key: 'alerts', label: 'Early Warnings & Alerts', icon: Bell },
        { key: 'reports', label: 'Municipal Reports', icon: FileText },
        { key: 'assistant', label: 'AI Municipal Assistant', icon: Bot },
        { key: 'users', label: 'User Directory', icon: Users },
        { key: 'audit-logs', label: 'Audit Logs', icon: History },
        { key: 'settings', label: 'Engine Settings', icon: Sliders }
      ]
    }
  ];

  return (
    <aside className="w-64 bg-[#0A0E1A] border-r border-[#1F293D] flex flex-col h-[calc(100vh-61px)] sticky top-[61px] overflow-y-auto">
      <div className="p-3 space-y-6">
        
        {/* Public Views Section (Visible to Everyone) */}
        <div>
          <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Public Portal
          </p>
          <div className="space-y-1">
            {publicNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => onNavigate(item.key)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Admin & Department Sections */}
        {role !== 'CITIZEN' && (
          <>
            {adminNavSections.map((sec) => (
              <div key={sec.title}>
                <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  {sec.title}
                </p>
                <div className="space-y-1">
                  {sec.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentPage === item.key;
                    return (
                      <button
                        key={item.key}
                        onClick={() => onNavigate(item.key)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                          isActive
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                        }`}
                      >
                        <Icon className={`h-4 w-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </>
        )}

        {role === 'CITIZEN' && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs">
            <p className="font-bold text-emerald-400 mb-1">Citizen Portal Mode</p>
            <p className="text-[11px] text-slate-400 mb-2">
              Viewing public data. Switch to Municipal Authority from the top right to access command center features.
            </p>
          </div>
        )}

      </div>
    </aside>
  );
};
