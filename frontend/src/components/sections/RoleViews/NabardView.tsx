import { Building2, TrendingUp, ShieldAlert, BadgeInfo } from 'lucide-react';
import { DistrictData } from '@/lib/types';
import { DISTRICT_DATA_MAP, getRiskColor } from '@/lib/data';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface Props {
  data: DistrictData;
  district: string;
  year: number;
}

export default function NabardView({ data, district, year }: Props) {
  const [portfolio, setPortfolio] = useState(100);

  const flagColor = getRiskColor(data.kccRisk);
  const flagText = data.kccRisk === 'HIGH' ? 'CRITICAL RISK NODE' : data.kccRisk === 'MEDIUM' ? 'SYSTEMIC MONITOR' : 'STABLE PORTFOLIO';

  const atRisk = (portfolio * data.drought / 100 * 0.4).toFixed(1);
  const saved = (portfolio * data.drought / 100 * 0.4 * data.kccReduction / 100).toFixed(1);

  const sorted = Object.entries(DISTRICT_DATA_MAP).sort(([, a], [, b]) => b.drought - a.drought);

  return (
    <div className="grid lg:grid-cols-2 grid-cols-1 gap-8 animate-fade-slide">
      {/* Institutional Credit Assessment */}
      <div className="bg-white border-2 border-bdr rounded-[32px] p-10 shadow-xl relative overflow-hidden text-left">
        <div className="flex items-center gap-4 mb-10">
          <div className="p-3 rounded-2xl bg-bg-panel text-brand border border-bdr shadow-sm">
            <Building2 size={20} />
          </div>
          <span className="font-outfit font-black text-t-primary text-sm uppercase tracking-[0.2em]">KCC Risk Surveillance</span>
        </div>

        <div className="relative mb-10">
           <span className="font-mono text-[11px] text-t-dim uppercase tracking-[0.3em] font-black">INSTITUTIONAL FLAG</span>
           <div className="font-display italic text-5xl mt-3 uppercase tracking-tight font-black" style={{ color: flagColor }}>{flagText}</div>
           <p className="text-base text-t-secondary mt-3 italic font-bold">Audit status for {district} - {year} Horizon</p>
        </div>

        <div className="h-0.5 bg-bdr w-full mb-10 rounded-full" />

        <div className="bg-bg-panel/40 border-2 border-bdr rounded-3xl p-8 mb-10 shadow-inner">
          <div className="flex items-center gap-3 mb-6">
             <ShieldAlert size={16} className="text-t-dim" />
             <span className="font-mono text-[10px] tracking-[0.3em] text-t-dim uppercase font-black">Automated KCC Protocols</span>
          </div>
          {[
            { label: 'KCC ceiling adjustment', value: `-${data.kccReduction}%`, color: data.kccReduction > 20 ? 'var(--risk-h)' : 'var(--risk-l)' },
            { label: 'Diversification mandate', value: data.kccReduction > 15 ? 'ENFORCED' : 'VOLUNTARY', color: data.kccReduction > 15 ? 'var(--risk-m)' : 'var(--t-dim)' },
            { label: 'Climate resilience buffer', value: `+${data.stressBuffer}%`, color: 'var(--brand)' },
            { label: 'Audit frequency', value: data.kccRisk === 'HIGH' ? 'Quarterly' : 'Annual', color: 'var(--t-secondary)' },
          ].map((row, i) => (
            <div key={i} className="flex justify-between items-center py-4 border-b border-bdr last:border-0 text-base">
              <span className="text-t-secondary font-bold uppercase tracking-tight text-sm">{row.label}</span>
              <span className="font-mono text-sm font-black" style={{ color: row.color }}>{row.value}</span>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl p-8 border-2 border-bdr shadow-xl hover:translate-y-[-4px] transition-all">
          <div className="flex items-center justify-between mb-6">
             <span className="font-mono text-[10px] text-t-dim uppercase tracking-[0.3em] font-black leading-none">Exposure Simulation</span>
             <span className="font-mono text-xl text-brand font-black italic tracking-tighter">₹{portfolio}Cr</span>
          </div>
          <input
            type="range" min={10} max={500} step={10} value={portfolio}
            onChange={e => setPortfolio(Number(e.target.value))}
            className="w-full h-2 bg-bg-panel rounded-full appearance-none cursor-pointer mb-8"
            style={{ background: `linear-gradient(to right, var(--brand) ${((portfolio - 10) / 490) * 100}%, #e2e8e2 ${((portfolio - 10) / 490) * 100}%)` }}
          />
          <div className="grid grid-cols-2 gap-6 mt-6">
            <div className="bg-risk-hbg rounded-[2rem] p-6 border-2 border-risk-hb text-center">
               <div className="text-risk-h font-display italic text-3xl font-black uppercase tracking-tighter">₹{atRisk}Cr</div>
               <div className="text-[10px] font-mono text-risk-h uppercase tracking-[0.2em] mt-2 font-black">Capital At Risk</div>
            </div>
            <div className="bg-risk-lbg rounded-[2rem] p-6 border-2 border-risk-lb text-center">
               <div className="text-risk-l font-display italic text-3xl font-black uppercase tracking-tighter">₹{saved}Cr</div>
               <div className="text-[10px] font-mono text-risk-l uppercase tracking-[0.2em] mt-2 font-black">Loss Avoidance</div>
            </div>
          </div>
        </div>
      </div>

      {/* Regional Exposure Grid */}
      <div className="bg-white border-2 border-bdr rounded-[32px] p-10 shadow-xl overflow-hidden flex flex-col relative text-left">
        <div className="flex items-center gap-4 mb-10">
          <div className="p-3 rounded-2xl bg-bg-panel text-brand border border-bdr shadow-sm">
            <TrendingUp size={20} />
          </div>
          <span className="font-outfit font-black text-t-primary text-sm uppercase tracking-[0.2em] leading-none">Regional Stress Ranking</span>
        </div>

        <div className="flex-1 overflow-auto custom-scrollbar pr-4 -mx-2">
          <table className="w-full border-separate border-spacing-y-2">
            <thead className="sticky top-0 bg-white z-20 pb-4">
              <tr className="font-mono text-[10px] text-t-dim uppercase tracking-[0.25em] border-b-2 border-bdr font-black">
                <th className="text-left py-4 px-4 font-black">Rank</th>
                <th className="text-left py-4 px-4 font-black">District</th>
                <th className="text-left py-4 px-4 font-black">Drought</th>
                <th className="text-left py-4 px-4 font-black text-right pr-6">Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bdr/50">
              {sorted.slice(0, 15).map(([name, d], i) => {
                const isSelected = name === district;
                return (
                  <tr key={name} className={cn(
                    "group transition-all hover:bg-bg-panel/40",
                    isSelected ? "bg-brand/5 shadow-inner" : ""
                  )}>
                    <td className="py-4 px-4 text-[11px] font-mono text-t-dim font-black">{(i + 1).toString().padStart(2, '0')}</td>
                    <td className={cn("py-4 px-4 text-sm font-black tracking-tight", isSelected ? "text-brand" : "text-t-primary")}>{name.toUpperCase()}</td>
                    <td className="py-4 px-4">
                       <div className="flex items-center gap-3">
                          <div className="w-20 h-2 bg-bg-panel rounded-full overflow-hidden hidden md:block border border-bdr">
                             <div className="h-full rounded-full transition-all duration-1000 shadow-sm" style={{ width: `${d.drought}%`, backgroundColor: getRiskColor(d.droughtLevel) }} />
                          </div>
                          <span className="font-mono text-[11px] font-black italic" style={{ color: getRiskColor(d.droughtLevel) }}>{d.drought}%</span>
                       </div>
                    </td>
                    <td className="py-4 px-4 text-right pr-6">
                      <span className="text-[10px] font-mono px-3 py-1 rounded-xl border-2 uppercase tracking-tighter font-black shadow-sm" style={{ 
                        color: getRiskColor(d.kccRisk), 
                        backgroundColor: d.kccRisk === 'HIGH' ? 'rgba(211,47,47,0.08)' : d.kccRisk === 'MEDIUM' ? 'rgba(249,168,37,0.08)' : 'rgba(46,125,50,0.08)',
                        borderColor: d.kccRisk === 'HIGH' ? 'rgba(211,47,47,0.15)' : 'rgba(0,0,0,0.05)'
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
        
        <div className="mt-8 pt-8 border-t-2 border-bdr flex items-center gap-3 opacity-60">
           <BadgeInfo size={18} className="text-t-dim" />
           <p className="text-[10px] font-mono text-t-dim uppercase tracking-[0.2em] leading-relaxed font-bold">Cross-referenced with nabard dicra regional datasets · alpha security stack v4.2</p>
        </div>
      </div>
    </div>
  );
}
