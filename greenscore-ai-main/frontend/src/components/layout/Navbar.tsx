import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Shield, 
  Activity, 
  Sparkles, 
  Bell, 
  User as UserIcon, 
  ChevronDown, 
  ExternalLink,
  Bot,
  AlertTriangle,
  Building2
} from 'lucide-react';

interface NavbarProps {
  onOpenAssistant: () => void;
  activeAlertsCount?: number;
  onNavigate: (page: string) => void;
  currentPage: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAssistant,
  activeAlertsCount = 3,
  onNavigate,
  currentPage
}) => {
  const { user, role, switchDemoRole } = useAuth();
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0B0F19]/90 backdrop-blur-md border-b border-[#1F293D] px-4 lg:px-6 py-3">
      <div className="flex items-center justify-between">
        
        {/* Brand & Tagline */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('landing')}>
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-glow-emerald border border-emerald-400/30">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                GREENScore AI
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded">
                v1.0
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block tracking-wider uppercase font-medium">
              Predict • Prioritize • Optimize • Act • Measure
            </p>
          </div>
        </div>

        {/* Center Live Ticker */}
        <div className="hidden md:flex items-center space-x-4 bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-800 text-xs">
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-slate-300">Lucknow LMC</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center space-x-1.5">
            <span className="text-slate-400">Green Score:</span>
            <span className="font-bold text-emerald-400">72.0/100</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center space-x-1.5">
            <span className="text-slate-400">Avg AQI:</span>
            <span className="font-bold text-amber-400">118</span>
            <span className="text-[10px] text-slate-500">(Moderate)</span>
          </div>
        </div>

        {/* Right Tools & Role Switcher */}
        <div className="flex items-center space-x-3">
          
          {/* AI Municipal Assistant Quick Trigger */}
          <button
            onClick={onOpenAssistant}
            className="flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/20 hover:to-teal-500/20 border border-emerald-500/30 text-emerald-300 rounded-lg text-xs font-medium transition-all shadow-glow-emerald"
          >
            <Bot className="h-4 w-4 text-emerald-400 animate-pulse" />
            <span className="hidden sm:inline">AI Municipal Assistant</span>
          </button>

          {/* Alerts Bell */}
          <button
            onClick={() => onNavigate('alerts')}
            className="relative p-2 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-300 transition-colors"
            title="System Alerts"
          >
            <Bell className="h-4 w-4" />
            {activeAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                {activeAlertsCount}
              </span>
            )}
          </button>

          {/* Quick Persona Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center space-x-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs transition-colors"
            >
              <div className={`h-2 w-2 rounded-full ${role === 'SUPER_ADMIN' ? 'bg-purple-400' : (role === 'DEPARTMENT_OFFICER' ? 'bg-blue-400' : 'bg-emerald-400')}`} />
              <div className="text-left hidden sm:block">
                <p className="font-semibold text-slate-200 leading-none">
                  {role === 'SUPER_ADMIN' ? 'Municipal Authority' : (role === 'DEPARTMENT_OFFICER' ? 'Dept. Officer' : 'Citizen Portal')}
                </p>
                <p className="text-[10px] text-slate-400 leading-tight">
                  {user?.full_name?.split('(')[0] || 'User'}
                </p>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {/* Dropdown Menu */}
            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 text-xs">
                <p className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Switch Demo Persona (RBAC)
                </p>
                <div className="space-y-1 mt-1">
                  <button
                    onClick={() => {
                      switchDemoRole('SUPER_ADMIN');
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center space-x-2.5 transition-colors ${role === 'SUPER_ADMIN' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'hover:bg-slate-800 text-slate-300'}`}
                  >
                    <Shield className="h-4 w-4 text-purple-400" />
                    <div>
                      <p className="font-bold">Super Admin / Authority</p>
                      <p className="text-[10px] text-slate-400">Dr. Anand Verma (Commissioner)</p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      switchDemoRole('DEPARTMENT_OFFICER', 'Municipal Sanitation');
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center space-x-2.5 transition-colors ${role === 'DEPARTMENT_OFFICER' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'hover:bg-slate-800 text-slate-300'}`}
                  >
                    <Building2 className="h-4 w-4 text-blue-400" />
                    <div>
                      <p className="font-bold">Sanitation Officer</p>
                      <p className="text-[10px] text-slate-400">Rajesh Kumar (Field Lead)</p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      switchDemoRole('CITIZEN');
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center space-x-2.5 transition-colors ${role === 'CITIZEN' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'hover:bg-slate-800 text-slate-300'}`}
                  >
                    <UserIcon className="h-4 w-4 text-emerald-400" />
                    <div>
                      <p className="font-bold">Citizen (Public Portal)</p>
                      <p className="text-[10px] text-slate-400">Amit Trivedi (Resident)</p>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
