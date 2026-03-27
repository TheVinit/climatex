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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Activity size={32} className="text-brand" />
            <h1 className="text-4xl font-bold text-gray-900">KisanSuraksha</h1>
          </div>
          <p className="text-xl text-gray-600 mb-2">Climate Hazard Forecasting System</p>
          <p className="text-gray-500">Select your role to access personalized climate intelligence</p>
        </div>

        {/* Role Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ROLES.map((role) => {
            const Icon = role.icon;
            const isHovered = hoveredRole === role.key;

            return (
              <Link
                key={role.key}
                to={role.path}
                onMouseEnter={() => setHoveredRole(role.key)}
                onMouseLeave={() => setHoveredRole(null)}
                className="group relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden"
              >
                {/* Background gradient on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300 ${
                  role.key === 'farmer' ? 'from-green-400 to-green-600' :
                  role.key === 'insurer' ? 'from-blue-400 to-blue-600' :
                  role.key === 'nabard' ? 'from-purple-400 to-purple-600' :
                  'from-orange-400 to-orange-600'
                }`} />

                <div className="p-6">
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 transition-colors duration-300 ${
                    role.key === 'farmer' ? 'bg-green-100 text-green-600 group-hover:bg-green-200' :
                    role.key === 'insurer' ? 'bg-blue-100 text-blue-600 group-hover:bg-blue-200' :
                    role.key === 'nabard' ? 'bg-purple-100 text-purple-600 group-hover:bg-purple-200' :
                    'bg-orange-100 text-orange-600 group-hover:bg-orange-200'
                  }`}>
                    <Icon size={24} />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{role.label}</h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">{role.desc}</p>

                  {/* CTA */}
                  <div className="flex items-center text-sm font-medium text-brand group-hover:text-brand-dark transition-colors">
                    Access Dashboard
                    <ChevronRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>

                {/* Bottom accent */}
                <div className={`h-1 bg-gradient-to-r transition-all duration-300 ${
                  role.key === 'farmer' ? 'from-green-400 to-green-600' :
                  role.key === 'insurer' ? 'from-blue-400 to-blue-600' :
                  role.key === 'nabard' ? 'from-purple-400 to-purple-600' :
                  'from-orange-400 to-orange-600'
                } ${isHovered ? 'opacity-100' : 'opacity-60'}`} />
              </Link>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-sm text-gray-500">
            Powered by AI/ML models trained on DiCRA, IMD, and Sentinel-2 data
          </p>
        </div>
      </div>
    </div>
  );
}