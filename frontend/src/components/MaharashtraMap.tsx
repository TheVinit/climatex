import type { Hazard } from '@/lib/types';
import { DISTRICT_NAMES, DISTRICT_DATA_MAP, getRiskColor } from '@/lib/data';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { ShieldCheck, Crosshair, Map as MapIcon, Layers, Info } from 'lucide-react';

interface Props {
  district: string;
  hazard: Hazard;
  onSelect: (d: string) => void;
}

/**
 * AGRIGUARD CONNECT GEOSPATIAL ENGINE - MAHARASHTRA MATRIX
 * Premium Light-Mode GIS dashboard aligned with team's brand.
 */
export default function MaharashtraMap({ district: selectedDistrict, hazard, onSelect }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);
  const districts = DISTRICT_NAMES;

  // Geographic mapping for a professional GIS dashboard
  const mapLayout: Record<string, { labelX: number, labelY: number, path: string }> = {
    'Palghar': { labelX: 105, labelY: 135, path: "M 95,115 L 125,120 L 130,155 L 90,165 Z" },
    'Thane': { labelX: 115, labelY: 185, path: "M 100,165 L 135,160 L 145,210 L 105,215 Z" },
    'Mumbai': { labelX: 95, labelY: 215, path: "M 85,195 L 105,190 L 110,240 L 85,245 Z" },
    'Raigad': { labelX: 110, labelY: 275, path: "M 100,240 L 140,230 L 150,310 L 100,320 Z" },
    'Ratnagiri': { labelX: 115, labelY: 345, path: "M 105,315 L 145,305 L 155,390 L 110,400 Z" },
    'Sindhudurg': { labelX: 125, labelY: 415, path: "M 115,395 L 150,385 L 160,435 L 120,445 Z" },
    'Nashik': { labelX: 165, labelY: 145, path: "M 145,120 L 200,125 L 210,185 L 150,200 Z" },
    'Pune': { labelX: 175, labelY: 245, path: "M 155,210 L 210,195 L 225,290 L 160,305 Z" },
    'Satara': { labelX: 185, labelY: 325, path: "M 165,300 L 220,285 L 230,365 L 175,380 Z" },
    'Sangli': { labelX: 235, labelY: 385, path: "M 205,360 L 270,335 L 285,420 L 220,440 Z" },
    'Kolhapur': { labelX: 180, labelY: 415, path: "M 160,385 L 205,375 L 215,445 L 165,455 Z" },
    'Nandurbar': { labelX: 160, labelY: 85,  path: "M 140,65 L 180,60 L 185,110 L 145,115 Z" },
    'Dhule': { labelX: 205, labelY: 105, path: "M 185,85 L 235,80 L 240,135 L 190,145 Z" },
    'Jalgaon': { labelX: 255, labelY: 115, path: "M 240,105 L 290,110 L 300,165 L 250,175 Z" },
    'Aurangabad': { labelX: 245, labelY: 185, path: "M 220,165 L 280,155 L 290,225 L 230,240 Z" },
    'Jalna': { labelX: 295, labelY: 205, path: "M 275,185 L 325,180 L 335,255 L 285,270 Z" },
    'Ahmednagar': { labelX: 215, labelY: 225, path: "M 195,200 L 245,190 L 255,270 L 205,285 Z" },
    'Beed': { labelX: 275, labelY: 275, path: "M 255,255 L 305,245 L 315,315 L 265,335 Z" },
    'Latur': { labelX: 325, labelY: 325, path: "M 305,305 L 360,295 L 375,365 L 315,385 Z" },
    'Osmanabad': { labelX: 285, labelY: 345, path: "M 265,325 L 315,315 L 325,385 L 275,405 Z" },
    'Solapur': { labelX: 245, labelY: 315, path: "M 225,295 L 280,270 L 295,355 L 240,375 Z" },
    'Nanded': { labelX: 365, labelY: 285, path: "M 345,260 L 405,250 L 415,340 L 355,360 Z" },
    'Parbhani': { labelX: 335, labelY: 245, path: "M 315,225 L 365,215 L 375,285 L 325,300 Z" },
    'Hingoli': { labelX: 355, labelY: 205, path: "M 335,185 L 385,175 L 395,235 L 345,250 Z" },
    'Washim': { labelX: 385, labelY: 185, path: "M 365,165 L 415,155 L 425,225 L 375,240 Z" },
    'Buldhana': { labelX: 325, labelY: 145, path: "M 305,125 L 355,120 L 365,180 L 315,195 Z" },
    'Akola': { labelX: 365, labelY: 135, path: "M 345,115 L 395,110 L 405,170 L 355,185 Z" },
    'Amravati': { labelX: 425, labelY: 125, path: "M 405,105 L 455,100 L 465,170 L 415,180 Z" },
    'Wardha': { labelX: 475, labelY: 165, path: "M 455,145 L 505,135 L 515,205 L 465,220 Z" },
    'Nagpur': { labelX: 525, labelY: 135, path: "M 505,115 L 555,110 L 565,180 L 515,195 Z" },
    'Gondia': { labelX: 585, labelY: 115, path: "M 565,95 L 615,90 L 625,160 L 575,175 Z" },
    'Bhandara': { labelX: 555, labelY: 155, path: "M 535,135 L 585,130 L 595,195 L 545,210 Z" },
    'Chandrapur': { labelX: 545, labelY: 235, path: "M 525,215 L 585,205 L 600,295 L 540,315 Z" },
    'Yavatmal': { labelX: 465, labelY: 225, path: "M 445,205 L 505,195 L 515,285 L 455,305 Z" },
    'Gadchiroli': { labelX: 615, labelY: 255, path: "M 590,195 L 660,185 L 675,345 L 605,365 Z" },
    'Gadchiroli_E': { labelX: 685, labelY: 285, path: "M 665,225 L 725,215 L 735,375 L 675,395 Z" },
  };

  return (
    <div className="w-full h-full relative group overflow-visible">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-10">
        <div className="relative">
          <div className="flex items-center gap-2 mb-1">
            <MapIcon size={14} className="text-t-dim" />
            <p className="text-[10px] font-mono text-t-dim uppercase tracking-[0.25em] font-bold">Geospatial Surveillance Node</p>
          </div>
          <h3 className="text-4xl font-display italic text-t-primary leading-none uppercase tracking-tight font-black">Maharashtra Matrix</h3>
        </div>
        
        <div className="flex items-center gap-8 p-5 px-10 bg-white border border-bdr rounded-3xl shadow-sm">
          {['LOW', 'MEDIUM', 'HIGH'].map(key => (
            <div key={key} className="flex items-center gap-3">
              <div className={cn(
                "w-3 h-3 rounded-full",
                key === 'LOW' ? "bg-risk-l shadow-[0_0_12px_rgba(46,125,50,0.3)]" :
                key === 'MEDIUM' ? "bg-risk-m shadow-[0_0_12px_rgba(249,168,37,0.3)]" : 
                "bg-risk-h shadow-[0_0_12px_rgba(211,47,47,0.3)]"
              )} />
              <span className="text-[10px] font-mono text-t-secondary uppercase tracking-widest font-bold">{key}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative aspect-[16/7] w-full bg-white border border-bdr rounded-[2.5rem] p-10 overflow-visible group/map shadow-xl transition-all duration-1000 border-b-4">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #000 1px, transparent 0)', backgroundSize: '48px 48px' }} />

        <svg viewBox="50 50 720 420" className="w-full h-full transition-transform duration-500 ease-out group-hover/map:scale-[1.002]">
          {districts.map(d => {
            const layout = mapLayout[d];
            if (!layout) return null;

            const data = DISTRICT_DATA_MAP[d];
            const level = hazard === 'drought' ? data.droughtLevel : hazard === 'flood' ? data.floodLevel : data.heatLevel;
            const color = getRiskColor(level);
            const isSelected = d === selectedDistrict;
            const isHovered = d === hovered;

            return (
              <g 
                key={d} 
                onClick={() => onSelect(d)}
                onMouseEnter={() => setHovered(d)}
                onMouseLeave={() => setHovered(null)}
                className="cursor-pointer"
              >
                {/* Geological Background Shape */}
                <path
                  d={layout.path}
                  className={cn(
                    "transition-all duration-300 stroke-[1.5]",
                    isSelected 
                      ? "fill-brand-dim stroke-brand translate-y-[-3px]" 
                      : "fill-[#f8faf8] stroke-bdr hover:fill-white hover:stroke-brand/40"
                  )}
                />
                
                {/* Deep risk overlay */}
                <path
                  d={layout.path}
                  fill={color}
                  className={cn(
                    "transition-opacity duration-300 pointer-events-none",
                    isSelected || isHovered ? "opacity-20" : "opacity-[0.1]"
                  )}
                />

                {(isHovered || isSelected) && (
                  <g className="pointer-events-none animate-in fade-in duration-300">
                     <rect 
                        x={layout.labelX - 50} 
                        y={layout.labelY - 60} 
                        width="100" 
                        height="36" 
                        rx="10" 
                        className="fill-white stroke-brand/20 shadow-2xl" 
                     />
                     <text x={layout.labelX} y={layout.labelY - 37} textAnchor="middle" className="font-mono text-[10px] fill-t-primary uppercase tracking-tight font-black">{d}: {hazard === 'drought' ? data.drought : hazard === 'flood' ? data.flood : data.heat}%</text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* HUD Data Overlay */}
        <div className="absolute top-10 left-10 p-8 bg-white/95 backdrop-blur-xl rounded-[2.5rem] border border-bdr shadow-2xl flex flex-col gap-5 max-w-[260px] animate-in slide-in-from-left-6 duration-700 border-l-8 border-brand">
           <div>
             <div className="flex items-center gap-2 mb-2">
                <Crosshair size={14} className="text-brand" />
                <span className="text-[10px] font-mono text-t-dim uppercase tracking-widest leading-none font-bold">Focus Node</span>
             </div>
             <p className="text-4xl font-display italic text-t-primary leading-none whitespace-nowrap overflow-hidden text-ellipsis font-black">{selectedDistrict}</p>
           </div>
           
           <div className="h-px bg-bdr w-full" />
           
           <div className="space-y-4">
             <div className="flex justify-between items-center text-[10px] font-mono uppercase font-bold">
               <span className="text-t-dim leading-none">Risk Profile</span>
               <span className="text-brand leading-none">{hazard.toUpperCase()}</span>
             </div>
             <div className="w-full h-2 bg-bg-panel rounded-full overflow-hidden">
               <div className="h-full bg-brand w-4/6 rounded-full shadow-[0_0_12px_rgba(76,166,28,0.4)]" />
             </div>
           </div>
        </div>

        {/* Status Indicator */}
        <div className="absolute bottom-10 right-10 p-4 px-8 bg-white rounded-full border border-bdr flex items-center gap-4 shadow-lg">
           <div className="w-2 h-2 rounded-full bg-brand animate-pulse" />
           <p className="text-[11px] font-mono text-t-primary uppercase tracking-widest leading-none font-black">Satellite Linked</p>
        </div>
      </div>
      
      {/* Footer Sync Info */}
      <div className="mt-10 flex items-center justify-center gap-16 text-[10px] font-mono text-t-dim uppercase tracking-widest animate-pulse font-bold">
         <div className="flex items-center gap-3"><ShieldCheck size={18} className="text-brand" /> BR-07 SECURE LINK</div>
         <div className="flex items-center gap-3"><Layers size={18} className="text-t-secondary" /> GIS SYNC STABLE</div>
         <div className="flex items-center gap-3"><Info size={18} /> MODEL V4.2.1</div>
      </div>
    </div>
  );
}
