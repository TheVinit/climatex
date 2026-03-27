import { Droplets, Waves, Thermometer, Sprout, Building2, Shield, Leaf, ExternalLink, ChevronDown } from 'lucide-react';
import { Hazard, Role } from '@/lib/types';
import { DISTRICT_NAMES } from '@/lib/data';
import { cn } from '@/lib/utils';

interface ControlBarProps {
  district: string;
  year: number;
  hazard: Hazard;
  role: Role;
  onDistrictChange: (d: string) => void;
  onYearChange: (y: number) => void;
  onHazardChange: (h: Hazard) => void;
  onRoleChange: (r: Role) => void;
}

const hazards: { key: Hazard; icon: typeof Droplets; label: string }[] = [
  { key: 'drought', icon: Droplets, label: 'Drought' },
  { key: 'flood', icon: Waves, label: 'Flood' },
  { key: 'heat', icon: Thermometer, label: 'Heat' },
];

const roles: { key: Role; icon: typeof Sprout; label: string }[] = [
  { key: 'farmer', icon: Sprout, label: 'Farmer' },
  { key: 'nabard', icon: Building2, label: 'NABARD' },
  { key: 'insurer', icon: Shield, label: 'Insurer' },
  { key: 'supplier', icon: Leaf, label: 'Supplier' },
];

export default function ControlBar({ district, year, hazard, role, onDistrictChange, onYearChange, onHazardChange, onRoleChange }: ControlBarProps) {
  return (
    <div className="sticky top-14 z-40 bg-white border-b border-bdr px-6 py-4 flex gap-10 items-center flex-wrap shadow-sm">
      {/* Selection Control Node */}
      <div className="flex items-center gap-10">
        <div className="flex flex-col gap-1.5 text-left">
           <span className="font-mono text-[9px] text-t-dim uppercase tracking-[0.25em] leading-none font-bold">District Node</span>
           <div className="relative group/sel">
              <select
                value={district}
                onChange={e => onDistrictChange(e.target.value)}
                className="bg-transparent border-0 text-t-primary font-display italic text-xl focus:outline-none appearance-none cursor-pointer hover:text-brand transition-colors pr-8 font-black"
              >
                {DISTRICT_NAMES.map(d => (
                  <option key={d} value={d} className="bg-white text-t-primary">{d}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 text-t-dim pointer-events-none group-hover/sel:text-brand transition-colors" size={16} />
           </div>
        </div>

        <div className="h-12 w-px bg-bdr" />

        <div className="flex flex-col gap-3 text-left">
          <div className="flex items-center gap-2 leading-none">
            <span className="font-mono text-[9px] text-t-dim uppercase tracking-[0.25em] leading-none font-bold">Forecast Horizon / </span>
            <span className="font-mono text-xs text-brand leading-none font-black italic"> {year}</span>
          </div>
          <input
            type="range"
            min={2025}
            max={2039}
            step={1}
            value={year}
            onChange={e => onYearChange(Number(e.target.value))}
            className="w-[200px] h-1.5 bg-bg-panel rounded-full appearance-none cursor-pointer focus:outline-none"
            style={{
              background: `linear-gradient(to right, var(--brand) ${((year - 2025) / 14) * 100}%, #e2e8e2 ${((year - 2025) / 14) * 100}%)`,
            }}
          />
        </div>
      </div>

      <div className="h-12 w-px bg-bdr" />

      {/* Hazard Selector Hub */}
      <div className="flex items-center gap-4">
        <div className="flex bg-bg-panel p-1 rounded-2xl border border-bdr shadow-inner">
          {hazards.map((h, i) => {
            const active = hazard === h.key;
            const Icon = h.icon;
            return (
              <button
                key={h.key}
                onClick={() => onHazardChange(h.key)}
                className={cn(
                  "flex items-center gap-2.5 px-5 py-2 rounded-xl text-[11px] font-mono transition-all duration-500 font-bold tracking-tight",
                  active
                    ? "bg-white text-brand shadow-lg border border-brand/10 translate-y-[-1px]"
                    : "bg-transparent text-t-secondary hover:text-t-primary"
                )}
              >
                <Icon size={12} className={active ? 'text-brand' : 'text-t-dim'} />
                {h.label.toUpperCase()}
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-12 w-px bg-bdr" />

      {/* Unified Role Hub */}
      <div className="flex items-center gap-4">
        <div className="flex gap-2.5">
          {roles.map(r => {
            const active = role === r.key;
            const Icon = r.icon;
            return (
              <button
                key={r.key}
                onClick={() => onRoleChange(r.key)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-2 text-[10px] font-mono transition-all duration-500 border-2 font-black tracking-widest",
                  active
                    ? "bg-brand border-brand text-white shadow-xl translate-y-[-2px]"
                    : "bg-white border-bdr text-t-secondary hover:border-brand-border hover:text-brand"
                )}
              >
                <Icon size={14} className={active ? 'text-white' : 'text-t-dim'} />
                {r.label.toUpperCase()}
              </button>
            );
          })}
        </div>
      </div>

      {/* External Authority Hub */}
      <a href="https://dicra.nabard.org" target="_blank" rel="noopener noreferrer" className="ml-auto flex items-center gap-2 px-5 py-2.5 bg-bg-panel border border-bdr rounded-2xl text-[10px] font-mono text-t-primary uppercase tracking-[0.2em] font-black hover:border-brand-border hover:bg-white hover:text-brand transition-all shadow-sm">
        Authority: DiCRA <ExternalLink size={12} />
      </a>
    </div>
  );
}
