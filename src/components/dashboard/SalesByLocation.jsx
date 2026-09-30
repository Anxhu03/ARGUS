import React from 'react';
import { salesByLocationData } from '../../mock/ecommerceData';
import { Globe, TrendingUp } from 'lucide-react';

export default function SalesByLocation() {
  return (
    <div className="dashboard-card flex flex-col h-full">
      {/* Header */}
      <div className="dashboard-card-header flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-white tracking-tight">
            Sales by Location
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Geographic revenue and regional concentration
          </p>
        </div>
        <div className="p-1.5 rounded-md bg-slate-900 border border-[#202938]">
          <Globe className="w-4 h-4 text-blue-400" />
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        {/* World Map Visual Vector representation */}
        <div className="relative w-full h-32 rounded-lg bg-slate-900/60 border border-[#202938] overflow-hidden flex items-center justify-center p-2">
          {/* Subtle world map grid silhouette */}
          <svg
            className="w-full h-full opacity-40"
            viewBox="0 0 400 160"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* World Landmasses simplified abstract dots */}
            <path
              d="M70 45Q110 35 130 65T90 100T50 80Z"
              fill="#1e293b"
            />
            <path
              d="M100 110Q120 105 135 125T110 150T90 130Z"
              fill="#1e293b"
            />
            <path
              d="M190 35Q230 30 250 50T220 85T180 65Z"
              fill="#1e293b"
            />
            <path
              d="M200 90Q230 85 240 115T210 145T190 120Z"
              fill="#1e293b"
            />
            <path
              d="M260 40Q330 30 350 65T310 100T250 75Z"
              fill="#1e293b"
            />
            <path
              d="M320 115Q350 110 360 130T335 150T310 135Z"
              fill="#1e293b"
            />

            {/* Glowing Active Sales Hotspots */}
            {/* US Hotspot */}
            <circle cx="95" cy="55" r="4.5" fill="#3b82f6" />
            <circle cx="95" cy="55" r="8" stroke="#3b82f6" strokeWidth="1" opacity="0.6" className="animate-ping" />
            
            {/* UK Hotspot */}
            <circle cx="195" cy="48" r="3.5" fill="#60a5fa" />
            
            {/* Germany Hotspot */}
            <circle cx="215" cy="52" r="3.5" fill="#a78bfa" />
            
            {/* Canada Hotspot */}
            <circle cx="85" cy="40" r="3.5" fill="#818cf8" />
            
            {/* Australia Hotspot */}
            <circle cx="335" cy="130" r="3.5" fill="#38bdf8" />
          </svg>

          {/* Top Region Overlay Tag */}
          <div className="absolute bottom-2 left-2.5 px-2 py-1 rounded bg-slate-900/90 border border-[#202938] text-[10px] text-slate-300 flex items-center gap-1.5 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>North America leads (+18.4% YoY)</span>
          </div>
        </div>

        {/* Ranked Countries List with Bars */}
        <div className="space-y-3">
          {salesByLocationData.map((loc) => (
            <div key={loc.code} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: loc.color }} />
                  <span className="font-medium text-slate-200">{loc.country}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-mono text-[11px]">{loc.amount}</span>
                  <span className="font-bold text-white text-xs">{loc.percentage}%</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 rounded-full bg-slate-900 border border-[#202938]/80 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${loc.percentage}%`,
                    backgroundColor: loc.color
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
