import { Link } from 'react-router-dom';
import { 
  Leaf, ShieldCheck, Landmark, Package, 
  ArrowRight, Sparkles, Activity, Shield,
  CheckCircle2, Globe, Users, FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';

const ROLES = [
  {
    id: 'farmer',
    title: 'Farmer',
    subtitle: 'Agricultural Services',
    description: 'Access crop-specific advisories, weather resilience data, and market linkages.',
    icon: Leaf,
    path: '/farmer',
    color: 'emerald',
    accent: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    tag: 'KRISHI SEVA'
  },
  {
    id: 'insurer',
    title: 'Insurer',
    subtitle: 'Risk Management',
    description: 'Monitor hazard triggers and automate insurance claim processing for farmers.',
    icon: ShieldCheck,
    path: '/insurer',
    color: 'blue',
    accent: 'text-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    tag: 'SURA KSHA'
  },
  {
    id: 'nabard',
    title: 'NABARD',
    subtitle: 'Financial Credit',
    description: 'District-wise credit score analysis and agricultural loan support monitoring.',
    icon: Landmark,
    path: '/nabard',
    color: 'purple',
    accent: 'text-purple-700',
    bg: 'bg-purple-50',
    border: 'border-purple-100',
    tag: 'VITHIYA'
  },
  {
    id: 'supplier',
    title: 'Supplier',
    subtitle: 'Supply Chain',
    description: 'Optimize seed and fertilizer inventory dispatch based on regional demand.',
    icon: Package,
    path: '/supplier',
    color: 'orange',
    accent: 'text-orange-700',
    bg: 'bg-orange-50',
    border: 'border-orange-100',
    tag: 'AOPURTI'
  }
];

export default function RoleSelector() {
  return (
    <div className="min-h-screen bg-[#FDFEFE] flex flex-col items-center justify-center p-6 lg:p-12 relative overflow-hidden text-left">
      {/* Professional Government Background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at center, #000 1.2px, transparent 0)', backgroundSize: '40px 40px' }} />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-white to-green-500" />

      <div className="relative z-10 w-full max-w-7xl">
        <header className="text-center mb-16 animate-in slide-in-from-top-8 duration-500 text-left">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-xl">
              <Globe size={32} />
            </div>
            <div className="h-12 w-px bg-slate-200" />
            <div className="text-left">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] leading-none mb-1">State Department of Agriculture</p>
              <h2 className="text-3xl font-black text-slate-900 outfit tracking-tighter uppercase whitespace-nowrap italic">Kisan<span className="text-blue-600">Suraksha</span></h2>
            </div>
          </div>
          
          <h1 className="text-6xl font-black text-slate-900 outfit tracking-tighter mb-6 leading-none text-center">
            Integrated Agricultural <br/><span className="text-blue-600 italic">Command Center</span>
          </h1>
          <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed text-center">
            Real-time geospatial monitoring and decision support system for 
            resilient Maharashtra agriculture.
          </p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {ROLES.map((role, idx) => (
            <Link 
              key={role.id} 
              to={role.path}
              className={cn(
                "group relative bg-white border border-slate-100 p-10 rounded-[2.5rem] transition-all duration-300 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] hover:-translate-y-2 animate-in fade-in slide-in-from-bottom-6",
                `delay-${idx * 100}`
              )}
            >
              <div className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-transform duration-300 group-hover:scale-110",
                role.bg, role.accent
              )}>
                <role.icon size={28} strokeWidth={2.5} />
              </div>

              <div className="space-y-3 mb-10 text-left text-left">
                <span className={cn("text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest border", role.accent, role.border)}>
                  {role.tag}
                </span>
                <h3 className="text-2xl font-black text-slate-900 outfit tracking-tight">
                  {role.title}
                </h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed text-left">
                  {role.description}
                </p>
              </div>

              <div className="flex items-center justify-between mt-auto text-left">
                <div className="flex -space-x-2">
                   {[1,2,3].map(i => (
                     <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-50 flex items-center justify-center text-[8px] font-bold text-slate-400">
                        {i}
                     </div>
                   ))}
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center transition-all duration-300 group-hover:bg-blue-600">
                  <ArrowRight size={18} />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <footer className="mt-20 flex flex-col md:flex-row items-center justify-between gap-12 border-t border-slate-100 pt-12 animate-in fade-in duration-700 text-left">
           <div className="flex items-center gap-12 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-left">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={16} className="text-emerald-500" /> SECURE ACCESS
              </div>
              <div className="flex items-center gap-3">
                <Activity size={16} className="text-blue-500" /> NODE STABLE
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck size={16} className="text-orange-500" /> CERTIFIED
              </div>
           </div>
           
           <div className="flex gap-8 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left text-left">
             <a href="#" className="hover:text-slate-900 transition-colors">Privacy Policy</a>
             <a href="#" className="hover:text-slate-900 transition-colors">Terms of Use</a>
             <a href="#" className="hover:text-slate-900 transition-colors">System Status</a>
           </div>
        </footer>
      </div>
    </div>
  );
}