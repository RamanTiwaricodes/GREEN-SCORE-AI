import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Users, 
  Shield, 
  Building2, 
  CheckCircle2, 
  Key,
  Mail,
  UserCheck
} from 'lucide-react';

export const UserManagementPage: React.FC = () => {
  const { role, switchDemoRole } = useAuth();

  const demoUsers = [
    {
      id: 1,
      name: 'Dr. Anand Verma',
      email: 'commissioner@lucknowmc.gov.in',
      role: 'SUPER_ADMIN',
      title: 'Municipal Commissioner (Super Admin)',
      department: 'Municipal Corporation HQ',
      access: 'Full Administrative & Policy Override'
    },
    {
      id: 2,
      name: 'Rajesh Kumar Singh',
      email: 'rajesh.singh@lucknowmc.gov.in',
      role: 'DEPARTMENT_OFFICER',
      title: 'Sanitation Lead Officer',
      department: 'Municipal Sanitation & Solid Waste',
      access: 'Assigned Zones, Execution & Evidence Submission'
    },
    {
      id: 3,
      name: 'Priya Sharma',
      email: 'priya.sharma@lucknowmc.gov.in',
      role: 'DEPARTMENT_OFFICER',
      title: 'Urban Transport Officer',
      department: 'Urban Mobility & Transport',
      access: 'Mobility Telemetry & Fleet Project Updates'
    },
    {
      id: 4,
      name: 'Amit Trivedi',
      email: 'amit.trivedi@example.com',
      role: 'CITIZEN',
      title: 'Lucknow Resident',
      department: 'Public Catchment (Hazratganj)',
      access: 'Public Portal, Grievance Submission & Ticket Tracking'
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-purple-400" />
            <h1 className="text-2xl font-black text-white">Staff Directory & Role-Based Access Control (RBAC)</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage municipal authority, department officers, and public access credentials.
          </p>
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {demoUsers.map((u) => {
          const isSuper = u.role === 'SUPER_ADMIN';
          const isOfficer = u.role === 'DEPARTMENT_OFFICER';

          return (
            <div
              key={u.id}
              className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2.5 rounded-xl border ${
                      isSuper ? 'bg-purple-500/10 border-purple-500/30 text-purple-400' : (isOfficer ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400')
                    }`}>
                      {isSuper ? <Shield className="h-5 w-5" /> : (isOfficer ? <Building2 className="h-5 w-5" /> : <Users className="h-5 w-5" />)}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base leading-tight">{u.name}</h3>
                      <p className="text-xs text-slate-400">{u.title}</p>
                    </div>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    isSuper ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' : (isOfficer ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40')
                  }`}>
                    {u.role}
                  </span>
                </div>

                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1.5 text-xs">
                  <p className="text-slate-300"><span className="text-slate-500">Department:</span> {u.department}</p>
                  <p className="text-slate-300"><span className="text-slate-500">Email:</span> {u.email}</p>
                  <p className="text-slate-300"><span className="text-slate-500">Permissions:</span> {u.access}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <button
                  onClick={() => switchDemoRole(u.role as any, u.department)}
                  className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                    isSuper
                      ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-glow-blue'
                      : (isOfficer ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-white')
                  }`}
                >
                  Log In As This Persona (1-Click Switch)
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
