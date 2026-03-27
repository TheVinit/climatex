import { Droplets, Waves, Thermometer } from 'lucide-react';
import { DistrictData, Hazard, RiskLevel } from '@/lib/types';
import { getRiskColor, getRiskBg, getRiskBorder } from '@/lib/data';
import { useCountAnimation } from '@/hooks/useCountAnimation';
import { cn } from '@/lib/utils';

interface RiskScoreStripProps {
  data: DistrictData;
  hazard: Hazard;
  district: string;
  onHazardChange: (h: Hazard) => void;
}

function RiskCard({ label, icon: Icon, pct, level, isActive, onClick, district }: {
  label: string; icon: typeof Droplets; pct: number; level: RiskLevel; isActive: boolean; onClick: () => void; district: string;
}) {
  const color = getRiskColor(level);
  const animatedValue = useCountAnimation(pct, 1200);

  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-bg-surface border rounded-[20px] p-6 relative overflow-hidden cursor-pointer transition-all duration-500",
        isActive ? 'ring-2 ring-brand scale-[1.01] shadow-xl' : 'hover:bg-bg-hover hover:border-bdr2 border-bdr shadow-sm'
      )}
      style={{ borderColor: isActive ? 'var(--brand)' : getRiskBorder(level) }}
    >
      <div className="absolute w-24 h-24 -top-8 -right-8 rounded-full pointer-events-none opacity-[0.05]" style={{ background: color }} />

      <div className="flex items-center gap-2 mb-4">
        <Icon size={14} style={{ color: isActive ? 'var(--brand)' : color }} />
        <span className="font-mono text-[9px] tracking-[0.2em] text-t-dim uppercase leading-none">{label} Surveillance</span>
      </div>

      <div key={district + label} className="flex items-baseline gap-1">
        <span className={cn("font-display italic transition-all duration-500", isActive ? 'text-7xl text-brand' : 'text-6xl text-t-primary')} style={{ color: isActive ? '' : color }}>
          {animatedValue}%
        </span>
      </div>

      <div className="flex items-center justify-between mt-6">
        <span
          className="inline-block text-[9px] font-mono px-3 py-1 rounded-full border uppercase tracking-widest font-bold"
          style={{ color: isActive ? 'var(--brand)' : color, backgroundColor: getRiskBg(level), borderColor: isActive ? 'rgba(76,166,28,0.2)' : getRiskBorder(level) }}
        >
          {level} RISK
        </span>
        
        {isActive && (
           <div className="flex gap-1.5">
              {[1,2,3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />)}
           </div>
        )}
      </div>

      <div className="h-1 bg-bg-panel rounded-full mt-5 overflow-hidden">
        <div 
           className="h-full rounded-full transition-all duration-1000 ease-out" 
           style={{ width: `${pct}%`, backgroundColor: isActive ? 'var(--brand)' : color }} 
        />
      </div>
    </div>
  );
}

export default function RiskScoreStrip({ data, hazard, district, onHazardChange }: RiskScoreStripProps) {
  const cards: { key: Hazard; label: string; icon: typeof Droplets; pct: number; level: RiskLevel }[] = [
    { key: 'drought', label: 'Drought', icon: Droplets, pct: data.drought, level: data.droughtLevel },
    { key: 'flood', label: 'Inundation', icon: Waves, pct: data.flood, level: data.floodLevel },
    { key: 'heat', label: 'Thermal Heat', icon: Thermometer, pct: data.heat, level: data.heatLevel },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map(c => (
        <RiskCard
          key={c.key}
          label={c.label}
          icon={c.icon}
          pct={c.pct}
          level={c.level}
          isActive={hazard === c.key}
          onClick={() => onHazardChange(c.key)}
          district={district}
        />
      ))}
    </div>
  );
}
