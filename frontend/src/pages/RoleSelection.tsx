import { Sprout, Building2, Shield, Leaf, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Role } from '@/lib/types';
import { cn } from '@/lib/utils';

const roles: { id: Role; title: string; desc: string; icon: typeof Sprout; color: string; borderFocus: string; iconBg: string }[] = [
  {
    id: 'farmer', title: 'Farmer Node', desc: 'Access localized climate alerts, optimal crop modeling, and seasonal advisory.',
    icon: Sprout, color: 'text-green-600', borderFocus: 'hover:border-green-500', iconBg: 'bg-green-100 group-hover:bg-green-600 group-hover:text-white'
  },
  {
    id: 'nabard', title: 'NABARD Command', desc: 'Monitor systemic risk, allocate district resources, and track KCC exposure.',
    icon: Building2, color: 'text-purple-600', borderFocus: 'hover:border-purple-500', iconBg: 'bg-purple-100 group-hover:bg-purple-600 group-hover:text-white'
  },
  {
    id: 'insurer', title: 'Insurance Provider', desc: 'Assess parametric triggers, validate claims, and analyze regional exposure.',
    icon: Shield, color: 'text-blue-600', borderFocus: 'hover:border-blue-500', iconBg: 'bg-blue-100 group-hover:bg-blue-600 group-hover:text-white'
  },
  {
    id: 'supplier', title: 'Input Supplier', desc: 'Forecast structural demand for seeds and fertilizers using risk projections.',
    icon: Leaf, color: 'text-amber-600', borderFocus: 'hover:border-amber-500', iconBg: 'bg-amber-100 group-hover:bg-amber-600 group-hover:text-white'
  }
];

export default function RoleSelection() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-gray-900 font-sans selection:bg-green-600 selection:text-white relative overflow-hidden">

      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-500 rounded-full opacity-[0.03] blur-[100px] pointer-events-none" />

      <div className="max-w-5xl w-full z-10 animate-fade-slide">

        {/* Header Block */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center py-2 px-5 bg-white rounded-full shadow-sm border border-gray-200 mb-8">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-600" />
              <span className="text-sm font-bold text-gray-700 tracking-widest uppercase">KisanSuraksha </span>
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-5">Select Your Workspace</h2>
          <p className="text-lg text-gray-500 font-medium max-w-2xl mx-auto">
            Choose your institutional profile to access tailored climate intelligence and predictive analytics for your region.
          </p>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {roles.map((r) => {
            const Icon = r.icon;
            return (
              <button
                key={r.id}
                onClick={() => navigate(`/dashboard/${r.id}`)}
                className={cn(
                  "group relative bg-white border border-gray-200 rounded-2xl p-8 text-left transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-1",
                  r.borderFocus
                )}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className={cn("p-4 rounded-xl transition-colors duration-300", r.color, r.iconBg)}>
                    <Icon size={28} />
                  </div>
                  <div className="p-2 border border-gray-100 rounded-full bg-gray-50 text-gray-400 group-hover:bg-gray-100 group-hover:text-gray-900 transition-colors">
                    <ArrowRight size={20} />
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-3">{r.title}</h3>
                <p className="text-sm font-medium text-gray-500 leading-relaxed pr-8">
                  {r.desc}
                </p>

              </button>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="mt-20 text-center flex flex-col items-center justify-center gap-2 opacity-60">
          <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Secure Environment</span>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Build 4.2.1-RELEASE</span>
          </div>
        </div>

      </div>
    </div>
  );
}
