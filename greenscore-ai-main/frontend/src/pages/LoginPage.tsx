import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { 
  Shield, 
  Key, 
  User, 
  ArrowRight, 
  Building2, 
  Sparkles, 
  Lock,
  Globe
} from 'lucide-react';

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { login, switchDemoRole } = useAuth();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStandardLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.login(username, password);
      localStorage.setItem('greenscore_token', res.access_token);
      localStorage.setItem('greenscore_user', JSON.stringify(res.user));
      onNavigate('dashboard');
    } catch (err: any) {
      // Graceful demo login fallback
      login(username, username.includes('officer') ? 'DEPARTMENT_OFFICER' : (username.includes('citizen') ? 'CITIZEN' : 'SUPER_ADMIN'));
      onNavigate('dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPersona = (role: 'SUPER_ADMIN' | 'DEPARTMENT_OFFICER' | 'CITIZEN', dept?: string) => {
    switchDemoRole(role, dept);
    if (role === 'CITIZEN') {
      onNavigate('public-dashboard');
    } else {
      onNavigate('dashboard');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-glow-emerald border border-emerald-400/30 mx-auto">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-black text-white">Municipal Command Login</h2>
          <p className="text-xs text-slate-400">
            GREENScore AI • "Predict. Prioritize. Optimize. Act. Measure."
          </p>
        </div>

        {/* Form Card */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl space-y-5">
          <form onSubmit={handleStandardLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Username / LMC ID</label>
              <div className="relative">
                <User className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-all shadow-glow-emerald"
            >
              {loading ? 'Authenticating...' : 'Sign In to Command Center'}
            </button>
          </form>

          {/* Quick 1-Click Demo Persona Launcher */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">
              Or Instant 1-Click Demo Persona:
            </p>

            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => handleQuickPersona('SUPER_ADMIN')}
                className="p-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 text-left text-xs font-bold transition-all flex items-center justify-between"
              >
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-purple-400" />
                  <span>Super Admin (Municipal Commissioner)</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>

              <button
                type="button"
                onClick={() => handleQuickPersona('DEPARTMENT_OFFICER', 'Municipal Sanitation')}
                className="p-2.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-300 text-left text-xs font-bold transition-all flex items-center justify-between"
              >
                <div className="flex items-center space-x-2">
                  <Building2 className="h-4 w-4 text-blue-400" />
                  <span>Sanitation Lead Officer</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>

              <button
                type="button"
                onClick={() => handleQuickPersona('CITIZEN')}
                className="p-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-left text-xs font-bold transition-all flex items-center justify-between"
              >
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-emerald-400" />
                  <span>Citizen (Public Portal View)</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
