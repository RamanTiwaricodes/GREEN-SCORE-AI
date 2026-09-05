import React, { useState } from 'react';
import { api } from '../services/api';
import { 
  MessageSquarePlus, 
  Upload, 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  Shield,
  Camera,
  Loader2
} from 'lucide-react';

interface CitizenReportPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const CitizenReportPage: React.FC<CitizenReportPageProps> = ({ onNavigate }) => {
  const [name, setName] = useState('Amit Trivedi');
  const [phone, setPhone] = useState('+91-9876543210');
  const [category, setCategory] = useState('Garbage Dump');
  const [zoneId, setZoneId] = useState(5); // Chowk default
  const [address, setAddress] = useState('Gol Darwaza Market, Chowk, Lucknow');
  const [description, setDescription] = useState('Huge commercial garbage pile overflowing for 4 days near market entrance. Stinking and blocking drainage.');
  const [photoUrl, setPhotoUrl] = useState('https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=500');
  
  const [submitting, setSubmitting] = useState(false);
  const [submittedReport, setSubmittedReport] = useState<any>(null);

  // Live AI Preview simulation based on text
  const getAIPreview = () => {
    const d = description.toLowerCase();
    if (d.includes('garbage') || d.includes('kachra') || d.includes('waste') || d.includes('dump')) {
      return {
        cat: 'Garbage Dump',
        sev: 'High',
        dept: 'Municipal Sanitation & Solid Waste',
        reason: 'Persistent municipal solid waste accumulation creates public health hazards.'
      };
    }
    if (d.includes('water') || d.includes('pipe') || d.includes('leak')) {
      return {
        cat: 'Water Leakage',
        sev: 'Medium',
        dept: 'Water Supply & Jal Sansthan',
        reason: 'Potable water distribution loss exacerbates local groundwater stress.'
      };
    }
    return {
      cat: category,
      sev: 'Medium',
      dept: 'Public Works & Municipal Services',
      reason: 'Standard urban maintenance ticket.'
    };
  };

  const aiPreview = getAIPreview();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setSubmitting(true);
    try {
      const res = await api.submitCitizenReport({
        citizen_name: name,
        citizen_phone: phone,
        category: category,
        description: description,
        zone_id: Number(zoneId),
        latitude: 26.8680,
        longitude: 80.9020,
        address: address,
        photo_url: photoUrl
      });
      setSubmittedReport(res);
    } catch (err: any) {
      alert(`Error submitting report: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (submittedReport) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="glass-panel p-8 rounded-2xl border border-emerald-500/40 text-center shadow-2xl space-y-6">
          <div className="h-16 w-16 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-glow-emerald">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-white">Report Successfully Registered!</h2>
            <p className="text-xs text-slate-300 mt-1">
              Your environmental complaint has been classified by AI and queued for departmental action.
            </p>
          </div>

          <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-700 max-w-md mx-auto text-left space-y-2 text-xs">
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Tracking ID:</span>
              <span className="font-mono font-bold text-emerald-400 text-sm">{submittedReport.tracking_id}</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">AI Classification:</span>
              <span className="font-bold text-white">{submittedReport.ai_category}</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Assigned Department:</span>
              <span className="font-bold text-cyan-300">{submittedReport.ai_suggested_dept}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Initial Status:</span>
              <span className="font-bold text-amber-400">{submittedReport.status}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              onClick={() => onNavigate('track-report', { trackingId: submittedReport.tracking_id })}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-all shadow-glow-emerald"
            >
              Track Real-Time Progress
            </button>
            <button
              onClick={() => setSubmittedReport(null)}
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs transition-all"
            >
              Submit Another Issue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      
      <div>
        <div className="flex items-center space-x-2">
          <MessageSquarePlus className="h-5 w-5 text-emerald-400" />
          <h1 className="text-2xl font-black text-white">Citizen Environmental Grievance Portal</h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Report municipal environmental issues. Our AI engine automatically triages, estimates severity, and routes tickets to municipal teams.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Form Column */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Your Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Issue Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Garbage Dump">Garbage Dump / Overflow</option>
                <option value="Water Leakage">Water Pipeline Leakage</option>
                <option value="Drainage">Drainage & Sewage Blockage</option>
                <option value="Air Pollution">Air Pollution / Open Burning</option>
                <option value="Road Problem">Road / Pavement Problem</option>
                <option value="Illegal Dumping">Illegal Debris Dumping</option>
                <option value="Green Area Damage">Green Area / Tree Damage</option>
                <option value="Other">Other Environmental Issue</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Municipal Zone</label>
              <select
                value={zoneId}
                onChange={(e) => setZoneId(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="1">Gomti Nagar</option>
                <option value="2">Hazratganj</option>
                <option value="3">Aliganj</option>
                <option value="4">Indira Nagar</option>
                <option value="5">Chowk (Critical Zone)</option>
                <option value="6">Alambagh</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Specific Location / Landmark</label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. Near Gol Darwaza Market, Chowk"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Describe the Problem</label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what happened, how long it has been lying, and severity..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Evidence Photo URL (Optional)</label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="https://..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={() => setPhotoUrl('https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=500')}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs text-slate-300 font-bold"
              >
                Sample Photo
              </button>
            </div>
          </div>

          {photoUrl && (
            <div className="relative rounded-xl overflow-hidden border border-slate-700 h-32 w-full">
              <img src={photoUrl} alt="Evidence Preview" className="w-full h-full object-cover" />
              <span className="absolute bottom-2 left-2 bg-black/70 px-2 py-0.5 rounded text-[10px] text-white font-mono">
                Evidence Attached
              </span>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-all shadow-glow-emerald flex items-center justify-center space-x-2 mt-4"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Running AI Classification & Submitting...</span>
              </>
            ) : (
              <>
                <MessageSquarePlus className="h-4 w-4" />
                <span>Submit Grievance to Municipal Authority</span>
              </>
            )}
          </button>
        </form>

        {/* AI Live Preview Card */}
        <div className="space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-purple-500/30 shadow-xl space-y-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-purple-400" />
              <h3 className="font-bold text-white text-sm">AI Automated Triage Preview</h3>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              As you type, our NLP & Vision models estimate severity, impact risk, and routing:
            </p>

            <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 space-y-2.5 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Detected Category</span>
                <p className="font-bold text-emerald-400">{aiPreview.cat}</p>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Estimated Severity</span>
                <p className="font-bold text-amber-400">{aiPreview.sev}</p>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Routing Department</span>
                <p className="font-bold text-cyan-300">{aiPreview.dept}</p>
              </div>

              <div className="pt-1 border-t border-slate-800 text-[11px] text-slate-300 italic">
                "{aiPreview.reason}"
              </div>
            </div>

            <div className="p-2.5 bg-purple-500/10 border border-purple-500/20 rounded-xl text-[10px] text-purple-300 flex items-center space-x-1.5">
              <Shield className="h-4 w-4 shrink-0" />
              <span>Grounded Decision Support • No confidential internal data exposed</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
