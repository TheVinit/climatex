import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Role } from '@/lib/types';
import { Sprout, Shield, Building2, Leaf, Activity, ChevronRight } from 'lucide-react';

const ROLES: { key: Role; label: string; icon: typeof Sprout; desc: string; path: string }[] = [
  { key: 'farmer',   icon: Sprout,    label: 'Farmer',  desc: 'Crop advisory & early warning', path: '/farmer' },
  { key: 'insurer',  icon: Shield,    label: 'Insurer', desc: 'PMFBY trigger monitoring', path: '/insurer' },
  { key: 'nabard',   icon: Building2, label: 'NABARD',  desc: 'Credit risk & KCC underwriting', path: '/nabard' },
  { key: 'supplier', icon: Leaf,      label: 'Supplier', desc: 'Seed demand forecasting', path: '/supplier' },
];

export default function RoleSelector() {
  const [hoveredRole, setHoveredRole] = useState<Role | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex flex-col justify-center p-4 md:p-8">
      <div className="max-w-6xl w-full mx-auto">
        {/* Premium Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center gap-3 mb-6 px-4 py-2 rounded-full bg-gradient-to-r from-green-50 to-blue-50 border border-green-200/30">
            <Activity size={20} className="text-green-600" />
            <span className="text-xs font-semibold text-green-700 tracking-wider uppercase">Climate Intelligence Platform</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-green-800 to-blue-900 mb-4">
            KisanSuraksha
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 mb-2 font-light">
            AI-Powered Agricultural Climate Forecasting & Risk Management
          </p>
          
          <p className="text-sm md:text-base text-gray-500 max-w-2xl mx-auto">
            Select your stakeholder role to access real-time climate intelligence, automated risk triggers, and actionable insights for Maharashtra
          </p>
        </div>

        {/* Professional Role Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {ROLES.map((role) => {
            const Icon = role.icon;
            const isHovered = hoveredRole === role.key;
            
            const colorSchemes = {
              farmer: {
                bg: 'bg-gradient-to-br from-green-50 to-emerald-50',
                border: 'border-green-200',
                icon: 'bg-green-100 text-green-600',
                accent: 'from-green-400 to-emerald-600',
                hover: 'hover:border-green-300 hover:shadow-lg'
              },
              insurer: {
                bg: 'bg-gradient-to-br from-blue-50 to-cyan-50',
                border: 'border-blue-200',
                icon: 'bg-blue-100 text-blue-600',
                accent: 'from-blue-400 to-cyan-600',
                hover: 'hover:border-blue-300 hover:shadow-lg'
              },
              nabard: {
                bg: 'bg-gradient-to-br from-purple-50 to-violet-50',
                border: 'border-purple-200',
                icon: 'bg-purple-100 text-purple-600',
                accent: 'from-purple-400 to-violet-600',
                hover: 'hover:border-purple-300 hover:shadow-lg'
              },
              supplier: {
                bg: 'bg-gradient-to-br from-amber-50 to-orange-50',
                border: 'border-amber-200',
                icon: 'bg-amber-100 text-amber-600',
                accent: 'from-amber-400 to-orange-600',
                hover: 'hover:border-amber-300 hover:shadow-lg'
              }
            };

            const colors = colorSchemes[role.key];

            return (
              <Link
                key={role.key}
                to={role.path}
                onMouseEnter={() => setHoveredRole(role.key)}
                onMouseLeave={() => setHoveredRole(null)}
                className={`group relative ${colors.bg} rounded-2xl border-2 ${colors.border} ${colors.hover} shadow-md transition-all duration-300 overflow-hidden`}
              >
                {/* Top accent line */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${colors.accent} opacity-50 group-hover:opacity-100 transition-opacity duration-300`} />
                
                <div className="p-8 h-full flex flex-col">
                  {/* Icon Container */}
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${colors.icon} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={28} />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{role.label}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">{role.desc}</p>
                  </div>

                  {/* CTA */}
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors pt-4 border-t border-gray-200/50">
                    <span>Access Dashboard</span>
                    <ChevronRight size={16} className="transition-transform group-hover:translate-x-1 duration-300" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Stats Footer */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 px-4 py-8 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-green-600 mb-1">36</div>
            <p className="text-xs md:text-sm text-gray-600">Districts Covered</p>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-1">3</div>
            <p className="text-xs md:text-sm text-gray-600">Hazard Types</p>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-purple-600 mb-1">1.6M+</div>
            <p className="text-xs md:text-sm text-gray-600">Data Records</p>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-amber-600 mb-1">99%+</div>
            <p className="text-xs md:text-sm text-gray-600">Model Accuracy</p>
          </div>
        </div>

        {/* Minimal Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Powered by DiCRA, IMD & Sentinel-2 satellite data • Machine Learning models: Random Forest • 34-year training dataset
          </p>
        </div>
      </div>
    </div>
  );
}