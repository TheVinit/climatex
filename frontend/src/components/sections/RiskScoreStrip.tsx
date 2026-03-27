import { Droplets, Waves, Thermometer } from 'lucide-react';
import { DistrictData, Hazard, RiskLevel } from '@/lib/types';
import { useCountAnimation } from '@/hooks/useCountAnimation';
import { cn } from '@/lib/utils';

interface RiskScoreStripProps {
  data: DistrictData;
  hazard: Hazard;
  district: string;
  onHazardChange: (h: Hazard) => void;
}

function getLevelColors(level: RiskLevel, isActive: boolean) {
  const base = {
    text: level === 'HIGH' ? 'text-red-500' : level === 'MEDIUM' ? 'text-yellow-500' : 'text-green-500',
    bg: level === 'HIGH' ? 'bg-red-500' : level === 'MEDIUM' ? 'bg-yellow-500' : 'bg-green-500',
    border: level === 'HIGH' ? 'border-red-500' : level === 'MEDIUM' ? 'border-yellow-500' : 'border-green-500',
    tagText: level === 'HIGH' ? 'text-red-700' : level === 'MEDIUM' ? 'text-yellow-700' : 'text-green-700',
    tagBg: level === 'HIGH' ? 'bg-red-50' : level === 'MEDIUM' ? 'bg-yellow-50' : 'bg-green-50',
    tagBorder: level === 'HIGH' ? 'border-red-200' : level === 'MEDIUM' ? 'border-yellow-200' : 'border-green-200'
  };

  return {
    ...base,
    ring: isActive 
      ? `ring-4 ${base.border.replace('border-', 'ring-')} ring-opacity-30 shadow-xl border-2 ${base.border}` 
      : 'hover:border-gray-300 border-gray-100 shadow-sm'
  };
}

function RiskCard({ label, icon: Icon, pct, level, isActive, onClick, district }: {
  label: string; icon: typeof Droplets; pct: number; level: RiskLevel; isActive: boolean; onClick: () => void; district: string;
}) {
  const colors = getLevelColors(level, isActive);
  const animatedValue = useCountAnimation(pct, 1200);

  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-white rounded-xl p-6 relative overflow-hidden cursor-pointer transition-all duration-300",
        colors.ring
      )}
    >
      <div className={cn("absolute w-32 h-32 -top-12 -right-12 rounded-full pointer-events-none opacity-[0.03] transition-colors", colors.bg)} />

      <div className="flex items-center gap-2 mb-4">
        <Icon size={16} className={colors.text} />
        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{label} Surveillance</span>
      </div>

      <div key={district + label} className="flex items-baseline gap-1 mt-2 mb-2">
        <span className={cn("text-5xl font-bold transition-all duration-500", colors.text)}>
          {animatedValue}%
        </span>
      </div>

      <div className="flex items-center justify-between mt-6">
        <span
          className={cn("px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border transition-colors", colors.tagBg, colors.tagText, colors.tagBorder)}
        >
          {level} RISK
        </span>
        
        {isActive && (
           <div className="flex gap-1.5">
              {[1,2,3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />)}
           </div>
        )}
      </div>

      <div className="h-1.5 bg-gray-100 rounded-full mt-5 overflow-hidden">
        <div 
           className={cn("h-full rounded-full transition-all duration-1000 ease-out", colors.bg)} 
           style={{ width: `${pct}%` }} 
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
