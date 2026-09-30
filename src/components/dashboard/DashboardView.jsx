import React from 'react';
import MetricCard from './MetricCard';
import RevenueChart from './RevenueChart';
import TopProducts from './TopProducts';
import OrdersTable from './OrdersTable';
import SalesByLocation from './SalesByLocation';
import { metricCardsData } from '../../mock/ecommerceData';

export default function DashboardView() {
  return (
    <div className="space-y-6">
      {/* 1. Top Row: 4 Metric Cards */}
      <section aria-label="Key Metrics" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCardsData.map((metric) => (
          <MetricCard
            key={metric.id}
            label={metric.label}
            value={metric.value}
            change={metric.change}
            changeType={metric.changeType}
            comparison={metric.comparison}
            icon={metric.icon}
          />
        ))}
      </section>

      {/* 2. Main Analytics Area: Revenue Overview (2 cols) & Top Products (1 col) */}
      <section aria-label="Analytics Overview" className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div className="lg:col-span-1">
          <TopProducts />
        </div>
      </section>

      {/* 3. Lower Content: Recent Orders Table (2 cols) & Sales by Location (1 col) */}
      <section aria-label="Orders and Distribution" className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <OrdersTable />
        </div>
        <div className="lg:col-span-1">
          <SalesByLocation />
        </div>
      </section>
    </div>
  );
}
