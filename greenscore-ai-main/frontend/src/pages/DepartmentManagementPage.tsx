import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Department } from '../types';
import { 
  Building2, 
  Coins, 
  CheckSquare, 
  Phone, 
  Mail, 
  Users, 
  TrendingUp, 
  ArrowRight
} from 'lucide-react';

interface DepartmentManagementPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const DepartmentManagementPage: React.FC<DepartmentManagementPageProps> = ({ onNavigate }) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.getDepartments();
        setDepartments(res);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Building2 className="h-5 w-5 text-cyan-400" />
            <h1 className="text-2xl font-black text-white">Municipal Department Management</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              7 ACTIVE DEPARTMENTS
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Departmental workload distribution, execution capacity, project SLAs, and budget utilization.
          </p>
        </div>

        <button
          onClick={() => onNavigate('actions')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <CheckSquare className="h-4 w-4" />
          <span>Action Assignments</span>
        </button>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {departments.map((dept) => {
          const utilization = Math.round((dept.budget_spent / Math.max(1, dept.budget_allocated)) * 100);

          return (
            <div key={dept.id} className="glass-panel glass-panel-hover p-6 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                    CODE: {dept.code}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-slate-300">
                    {dept.active_projects_count} Active Projects
                  </span>
                </div>

                <h3 className="font-bold text-white text-base leading-tight mt-2">{dept.name}</h3>
                <p className="text-xs text-slate-400 mt-1">Department Head: <strong className="text-slate-200">{dept.head_name}</strong></p>

                <div className="space-y-1.5 text-xs text-slate-400 mt-3 pt-3 border-t border-slate-800">
                  <p className="flex items-center"><Mail className="h-3.5 w-3.5 mr-1.5 text-slate-500" /> {dept.contact_email}</p>
                  <p className="flex items-center"><Phone className="h-3.5 w-3.5 mr-1.5 text-slate-500" /> {dept.contact_phone || '+91-522-2287100'}</p>
                </div>

                {/* Budget Utilization */}
                <div className="mt-4 pt-3 border-t border-slate-800 space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Budget Spent:</span>
                    <span className="font-mono font-bold text-white">
                      ₹{(dept.budget_spent / 100000).toFixed(1)}L / ₹{(dept.budget_allocated / 100000).toFixed(1)}L ({utilization}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${utilization}%` }} />
                  </div>
                </div>
              </div>

              <button
                onClick={() => onNavigate('actions', { departmentId: dept.id })}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-800 rounded-xl text-xs font-bold transition-all text-center"
              >
                View Department Actions
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
};
