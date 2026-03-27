import { Building2, TrendingUp, ShieldAlert, BadgeInfo } from 'lucide-react';
import { DistrictData } from '@/lib/types';
import { DISTRICT_DATA_MAP } from '@/lib/data';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface Props {
  data: DistrictData;
  district: string;
  year: number;
}

export default function NabardView({ data, district, year }: Props) {
  const [portfolio, setPortfolio] = useState(100);

  const flagColor = data.kccRisk === 'HIGH' ? '#ef4444' : data.kccRisk === 'MEDIUM' ? '#f59e0b' : '#10b981';
  const flagText = data.kccRisk === 'HIGH' ? 'CRITICAL RISK NODE' : data.kccRisk === 'MEDIUM' ? 'SYSTEMIC MONITOR' : 'STABLE PORTFOLIO';

  const atRisk = (portfolio * data.drought / 100 * 0.4).toFixed(1);
  const saved = (portfolio * data.drought / 100 * 0.4 * data.kccReduction / 100).toFixed(1);

  const sorted = Object.entries(DISTRICT_DATA_MAP).sort(([, a], [, b]) => b.drought - a.drought);

  return (
    <div className="grid lg:grid-cols-2 grid-cols-1 gap-6 animate-fade-slide">
      {/* Institutional Credit Assessment */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col gap-6">
        
        {/* Target UI Hero Replacement */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-8 text-white relative overflow-hidden">
          <div className="flex items-center justify-between relative z-10">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">KCC Risk Surveillance</h1>
              <p className="text-purple-100 mb-4">Audit status for {district} - {year} Horizon</p>
            </div>
            <Building2 size={80} className="text-purple-200 opacity-80" />
          </div>
        </div>

        <div className="space-y-2">
           <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Institutional Flag</span>
           <div className="text-3xl font-bold tracking-tight uppercase" style={{ color: flagColor }}>{flagText}</div>
        </div>

        <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 mt-2">
          <div className="flex items-center gap-2 mb-4">
             <ShieldAlert size={16} className="text-gray-500" />
             <span className="text-[10px] tracking-widest text-gray-500 uppercase font-bold">Automated KCC Protocols</span>
          </div>
          {[
            { label: 'KCC ceiling adjustment', value: `-${data.kccReduction}%`, color: data.kccReduction > 20 ? '#ef4444' : '#10b981' },
            { label: 'Diversification mandate', value: data.kccReduction > 15 ? 'ENFORCED' : 'VOLUNTARY', color: data.kccReduction > 15 ? '#f59e0b' : '#6b7280' },
            { label: 'Climate resilience buffer', value: `+${data.stressBuffer}%`, color: '#9333ea' },
            { label: 'Audit frequency', value: data.kccRisk === 'HIGH' ? 'Quarterly' : 'Annual', color: '#4b5563' },
          ].map((row, i) => (
            <div key={i} className="flex justify-between items-center py-3 border-b border-gray-200 last:border-0">
              <span className="text-gray-600 font-semibold uppercase tracking-wide text-sm">{row.label}</span>
              <span className="font-bold text-sm" style={{ color: row.color }}>{row.value}</span>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm mt-2">
          <div className="flex items-center justify-between mb-4">
             <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Exposure Simulation</span>
             <span className="text-xl text-purple-600 font-bold tracking-tight">₹{portfolio}Cr</span>
          </div>
          <input
            type="range" min={10} max={500} step={10} value={portfolio}
            onChange={e => setPortfolio(Number(e.target.value))}
            className="w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer mb-6"
            style={{ background: `linear-gradient(to right, #9333ea ${((portfolio - 10) / 490) * 100}%, #e5e7eb ${((portfolio - 10) / 490) * 100}%)` }}
          />
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-red-50 rounded-lg p-4 border border-red-100 text-center">
               <div className="text-red-600 text-2xl font-bold uppercase tracking-tight">₹{atRisk}Cr</div>
               <div className="text-[10px] text-red-600 uppercase tracking-wider mt-1 font-semibold">Capital At Risk</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-100 text-center">
               <div className="text-green-600 text-2xl font-bold uppercase tracking-tight">₹{saved}Cr</div>
               <div className="text-[10px] text-green-600 uppercase tracking-wider mt-1 font-semibold">Loss Avoidance</div>
            </div>
          </div>
        </div>
      </div>

      {/* Regional Exposure Grid */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-purple-50 text-purple-600 border border-purple-100">
            <TrendingUp size={20} />
          </div>
          <span className="text-lg font-semibold text-gray-900">Regional Stress Ranking</span>
        </div>

        <div className="flex-1 overflow-auto pr-2">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-white z-20">
              <tr className="text-[10px] text-gray-500 uppercase tracking-wider border-b border-gray-200">
                <th className="py-3 px-2 font-semibold">Rank</th>
                <th className="py-3 px-2 font-semibold">District</th>
                <th className="py-3 px-2 font-semibold">Drought</th>
                <th className="py-3 px-2 font-semibold text-right">Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sorted.slice(0, 15).map(([name, d], i) => {
                const isSelected = name === district;
                return (
                  <tr key={name} className={cn(
                    "group transition-all hover:bg-gray-50",
                    isSelected ? "bg-purple-50/50" : ""
                  )}>
                    <td className="py-3 px-2 text-xs text-gray-500 font-semibold">{(i + 1).toString().padStart(2, '0')}</td>
                    <td className={cn("py-3 px-2 text-sm font-bold", isSelected ? "text-purple-600" : "text-gray-900")}>{name}</td>
                    <td className="py-3 px-2">
                       <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden hidden sm:block">
                             <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${d.drought}%`, backgroundColor: d.drought > 60 ? '#ef4444' : d.drought > 30 ? '#f59e0b' : '#10b981' }} />
                          </div>
                          <span className="text-xs font-semibold" style={{ color: d.drought > 60 ? '#ef4444' : d.drought > 30 ? '#f59e0b' : '#10b981' }}>{d.drought}%</span>
                       </div>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <span className="text-[10px] px-2 py-1 rounded-md uppercase font-bold" style={{ 
                        color: d.kccRisk === 'HIGH' ? '#ef4444' : d.kccRisk === 'MEDIUM' ? '#f59e0b' : '#10b981', 
                        backgroundColor: d.kccRisk === 'HIGH' ? '#fef2f2' : d.kccRisk === 'MEDIUM' ? '#fffbeb' : '#ecfdf5',
                        border: `1px solid ${d.kccRisk === 'HIGH' ? '#fee2e2' : d.kccRisk === 'MEDIUM' ? '#fef3c7' : '#d1fae5'}`
                      }}>
                        {d.kccRisk}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-center gap-2 opacity-60">
           <BadgeInfo size={14} className="text-gray-500" />
           <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold flex-grow flex pb-1">
             Cross-referenced with nabard dicra regional datasets
           </p>
        </div>
      </div>
    </div>
  );
}
