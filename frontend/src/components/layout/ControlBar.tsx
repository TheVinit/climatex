import { Droplets, Waves, Thermometer, ChevronDown } from 'lucide-react';
import { Hazard } from '@/lib/types';
import { DISTRICT_NAMES } from '@/lib/data';
import { cn } from '@/lib/utils';

interface ControlBarProps {
  district: string;
  year: number;
  hazard: Hazard;
  onDistrictChange: (d: string) => void;
  onYearChange: (y: number) => void;
  onHazardChange: (h: Hazard) => void;
}

const hazards: { key: Hazard; icon: typeof Droplets; label: string }[] = [
  { key: 'drought', icon: Droplets, label: 'Drought' },
  { key: 'flood', icon: Waves, label: 'Flood' },
  { key: 'heat', icon: Thermometer, label: 'Heat' },
];

export default function ControlBar({ district, year, hazard, onDistrictChange, onYearChange, onHazardChange }: ControlBarProps) {
  return (
    <div className="sticky top-[64px] z-40 bg-white/90 backdrop-blur-xl border-b border-gray-200 px-6 py-4 flex gap-6 md:gap-10 items-center flex-wrap shadow-sm">
      
      {/* Node Selector */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Node</span>
        <div className="relative group/sel bg-gray-50 border border-gray-200 rounded-lg overflow-hidden hover:border-green-300 transition-all">
           <select
             value={district}
             onChange={e => onDistrictChange(e.target.value)}
             className="w-full bg-transparent text-gray-900 text-sm font-semibold focus:outline-none appearance-none cursor-pointer hover:text-green-600 pl-4 pr-10 py-2"
           >
             {DISTRICT_NAMES.map(d => (
               <option key={d} value={d} className="bg-white">{d}</option>
             ))}
           </select>
           <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover/sel:text-green-600" size={14} />
        </div>
      </div>

      <div className="h-8 w-px bg-gray-200 hidden sm:block" />

      {/* Projection Timeline slider */}
      <div className="flex flex-col gap-2 flex-grow max-w-sm">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Timeline Projection</span>
          <span className="text-base text-green-600 font-bold tracking-tight">{year}</span>
        </div>
        <input
          type="range"
          min={2025}
          max={2039}
          step={1}
          value={year}
          onChange={e => onYearChange(Number(e.target.value))}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-gray-200 shadow-inner"
          style={{ background: `linear-gradient(to right, #16a34a ${((year - 2025) / 14) * 100}%, transparent ${((year - 2025) / 14) * 100}%)` }}
        />
      </div>

      <div className="h-8 w-px bg-gray-200 hidden md:block" />

      {/* Parametric Filters */}
      <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-200 shadow-inner">
        {hazards.map((h, i) => {
          const active = hazard === h.key;
          const Icon = h.icon;
          return (
            <button
              key={h.key}
              onClick={() => onHazardChange(h.key)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 text-xs transition-all duration-300 font-semibold tracking-wide rounded-lg",
                active
                  ? "bg-white text-green-600 shadow-sm border border-gray-100"
                  : "bg-transparent text-gray-500 hover:text-gray-900"
              )}
            >
              <Icon size={14} className={active ? 'text-green-600' : 'text-gray-400'} />
              {h.label}
            </button>
          );
        })}
      </div>

      <div className="flex-1" />
    </div>
  );
}
