import React from 'react';
import TopProducts from '../dashboard/TopProducts';
import { Package, Plus } from 'lucide-react';

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Product Catalog</h2>
          <p className="text-xs text-slate-400">All available inventory and SKU performance metrics</p>
        </div>
        <button
          type="button"
          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Product</span>
        </button>
      </div>

      <TopProducts />
    </div>
  );
}
