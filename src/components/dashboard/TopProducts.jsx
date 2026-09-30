import React from 'react';
import { topProductsData } from '../../mock/ecommerceData';
import { TrendingUp, ArrowUpRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function TopProducts() {
  const { setCurrentView } = useApp();

  return (
    <div className="dashboard-card flex flex-col h-full">
      <div className="dashboard-card-header flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-white tracking-tight">
            Top Products
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Best performing items by revenue
          </p>
        </div>

        <button
          type="button"
          onClick={() => setCurrentView('products')}
          className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors flex items-center gap-0.5"
        >
          <span>View all</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        {topProductsData.map((product) => (
          <div
            key={product.id}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/40 transition-colors group"
          >
            <div className="flex items-center gap-3 min-w-0">
              {/* Product Thumbnail with consistent aspect ratio & rounded corners */}
              <div className="w-11 h-11 rounded-lg bg-slate-900 border border-[#202938] overflow-hidden shrink-0 flex items-center justify-center p-1 group-hover:border-slate-600 transition-colors">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    // Fallback if image fails
                    e.target.style.display = 'none';
                  }}
                />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate group-hover:text-blue-400 transition-colors">
                  {product.name}
                </p>
                <p className="text-[11px] text-slate-400 truncate">
                  {product.subtitle}
                </p>
              </div>
            </div>

            <div className="text-right shrink-0 ml-3">
              <p className="text-xs font-bold text-white">
                {product.revenue}
              </p>
              <div className="flex items-center justify-end gap-1 mt-0.5">
                <span className="text-[10px] font-semibold text-emerald-400 flex items-center">
                  <TrendingUp className="w-2.5 h-2.5 inline mr-0.5" />
                  {product.change}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
