import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import {
  DollarSign,
  ShoppingCart,
  Users,
  RotateCcw,
  Calendar,
  Upload,
  Ellipsis,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FolderGit2,
  Cpu,
  ChevronUp
} from 'lucide-react';

export default function DashboardView() {
  const { kpis, navigateToCase, navigateToSupport, setCurrentView, addToast } = useApp();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredMonth, setHoveredMonth] = useState(null);
  const [showArgusDrawer, setShowArgusDrawer] = useState(false);

  useEffect(() => {
    let isMounted = true;
    api.getCases()
      .then(data => {
        if (isMounted) {
          setCases(data);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error(err);
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  // 12-Month Profit & Revenue Dataset matching reference chart structure
  const monthlyData = [
    { month: 'Jan', sales: 42, revenue: 58 },
    { month: 'Feb', sales: 50, revenue: 72 },
    { month: 'Mar', sales: 65, revenue: 85 },
    { month: 'Apr', sales: 58, revenue: 78 },
    { month: 'May', sales: 74, revenue: 95 },
    { month: 'Jun', sales: 88, revenue: 110 },
    { month: 'Jul', sales: 68, revenue: 84 },
    { month: 'Aug', sales: 82, revenue: 104 },
    { month: 'Sep', sales: 75, revenue: 92 },
    { month: 'Oct', sales: 90, revenue: 118 },
    { month: 'Nov', sales: 85, revenue: 108 },
    { month: 'Dec', sales: 96, revenue: 125 }
  ];

  // 12-month Customer Orders dataset for the mini chart
  const ordersMiniData = [24, 32, 28, 45, 40, 56, 52, 64, 58, 70, 68, 85];

  // Top Products from reference
  const topProducts = [
    {
      id: 'ARG-1042',
      name: 'Adidas Ultraboost 22',
      category: 'Running Shoes',
      price: '$180',
      image: '/adidas-ultraboost-running-shoe.svg'
    },
    {
      id: 'ARG-1043',
      name: 'Samsung Galaxy Watch 6',
      category: 'Smartwatch',
      price: '$299',
      image: '/samsung-galaxy-watch-smartwatch.svg'
    },
    {
      id: 'ARG-1044',
      name: 'Sony WH-1000XM5',
      category: 'Noise-Canceling Headphones',
      price: '$399',
      image: '/sony-wh1000xm5-headphones.svg'
    },
    {
      id: 'ARG-1047',
      name: 'Apple AirPods Pro (2nd G...',
      category: 'Wireless Earbuds',
      price: '$249',
      image: '/apple-airpods-pro-earbuds.svg'
    }
  ];

  return (
    <div>
      {/* 1. Subheader Row matching reference */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Welcome, Sajibur 👋</h1>
          <p className="text-sm text-muted-foreground">
            An overview of customer insights, sales performance, and revenue analytics.
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-3">
          <button
            type="button"
            className="justify-center whitespace-nowrap rounded-md font-medium transition-all border border-border shadow-xs hover:bg-accent h-9 px-4 py-2 flex items-center gap-2 bg-transparent text-sm cursor-pointer text-foreground"
            onClick={() => addToast({ type: 'info', title: 'Time Window', message: 'Current analytics filtered by This Week.' })}
          >
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span>This Week</span>
          </button>

          <button
            type="button"
            className="justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all border border-border shadow-xs hover:bg-accent h-9 px-4 py-2 flex items-center gap-2 bg-transparent cursor-pointer text-foreground"
            onClick={() => addToast({ type: 'info', title: 'Report Exported', message: 'Exporting complete audit report...' })}
          >
            <Upload className="w-4 h-4 text-muted-foreground" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* 2. Overview Metrics Cards matching reference (4 columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Card 1: Total Revenue */}
        <div
          className="text-card-foreground flex flex-col gap-6 rounded-xl py-6 shadow-sm bg-card border border-border cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setCurrentView('cases')}
        >
          <div className="p-5">
            <div className="flex items-start justify-between mb-2">
              <span className="text-sm text-muted-foreground">Total Revenue</span>
              <div className="p-2 bg-muted rounded-lg">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
            <p className="text-3xl font-semibold mb-2 text-foreground">$68,837</p>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-[var(--color-positive)]">+2.4% WoW</span>
            </div>
          </div>
        </div>

        {/* Card 2: Total Orders */}
        <div
          className="text-card-foreground flex flex-col gap-6 rounded-xl py-6 shadow-sm bg-card border border-border cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setCurrentView('cases')}
        >
          <div className="p-5">
            <div className="flex items-start justify-between mb-2">
              <span className="text-sm text-muted-foreground">Total Orders</span>
              <div className="p-2 bg-muted rounded-lg">
                <ShoppingCart className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
            <p className="text-3xl font-semibold mb-2 text-foreground">12,485</p>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-[var(--color-positive)]">+3.1% WoW</span>
            </div>
          </div>
        </div>

        {/* Card 3: Active Customers */}
        <div
          className="text-card-foreground flex flex-col gap-6 rounded-xl py-6 shadow-sm bg-card border border-border cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setCurrentView('cases')}
        >
          <div className="p-5">
            <div className="flex items-start justify-between mb-2">
              <span className="text-sm text-muted-foreground">Active Customers</span>
              <div className="p-2 bg-muted rounded-lg">
                <Users className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
            <p className="text-3xl font-semibold mb-2 text-foreground">4,263</p>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-[var(--color-positive)]">+1.8% WoW</span>
            </div>
          </div>
        </div>

        {/* Card 4: Refund Rate */}
        <div
          className="text-card-foreground flex flex-col gap-6 rounded-xl py-6 shadow-sm bg-card border border-border cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigateToCase('ARG-1043')}
        >
          <div className="p-5">
            <div className="flex items-start justify-between mb-2">
              <span className="text-sm text-muted-foreground">Refund Rate</span>
              <div className="p-2 bg-muted rounded-lg">
                <RotateCcw className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
            <p className="text-3xl font-semibold mb-2 text-foreground">1.5%</p>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-[var(--color-positive)]">-0.6% WoW</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Grid Row 1: Total Profit Overview (2 cols) + Top Products (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Left: Total Profit Overview (lg:col-span-2) */}
        <div className="lg:col-span-2">
          <div className="text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm bg-card border-border">
            {/* Card Header */}
            <div className="flex flex-row items-center justify-between pb-2 px-6">
              <div>
                <div className="text-base font-medium text-foreground">Total Profit Overview</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-3xl font-semibold text-foreground">$98,643.24</span>
                  <span className="text-xs bg-[var(--color-accent)] text-foreground px-2 py-0.5 rounded-full flex items-center gap-1 border border-border">
                    +8.4%<span className="text-[10px]">↗</span>
                  </span>
                </div>
              </div>
              <button
                className="inline-flex items-center justify-center size-9 h-8 w-8 rounded-md text-sm font-medium hover:bg-accent text-muted-foreground hover:text-foreground cursor-pointer border-none bg-transparent"
                aria-label="More options"
                onClick={() => addToast({ type: 'info', title: 'Telemetry Options', message: 'Shopify OMS & Stripe Settlement channels synchronized.' })}
              >
                <Ellipsis className="w-4 h-4" />
              </button>
            </div>

            {/* Sub-Legend & Gateway Integrations */}
            <div className="px-6">
              <div className="flex items-center gap-6 mb-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[var(--color-chart-gray)]"></div>
                  <span className="text-xs text-muted-foreground">Total Sales</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[var(--color-chart-orange)]"></div>
                  <span className="text-xs text-muted-foreground">Total Revenue</span>
                </div>

                <div className="ml-auto flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-green-100 flex items-center justify-center">
                      <span className="text-[10px] text-green-600 font-bold">S</span>
                    </div>
                    <div>
                      <p className="text-xs font-medium leading-none text-foreground">Shopify</p>
                      <p className="text-[10px] text-muted-foreground leading-none mt-0.5">206 Payment</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-orange-100 flex items-center justify-center">
                      <span className="text-[10px] text-orange-600 font-bold">a</span>
                    </div>
                    <div>
                      <p className="text-xs font-medium leading-none text-foreground">Amazon</p>
                      <p className="text-[10px] text-muted-foreground leading-none mt-0.5">400 Payment</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Exact 12-Month Dual Bar Chart matching reference */}
              <div className="h-[200px] w-full relative">
                <svg viewBox="0 0 720 180" className="w-full h-full overflow-visible">
                  {/* Subtle Grid Guidelines */}
                  <line x1="0" y1="20" x2="720" y2="20" stroke="#f4f4f5" strokeDasharray="3 3" />
                  <line x1="0" y1="65" x2="720" y2="65" stroke="#f4f4f5" strokeDasharray="3 3" />
                  <line x1="0" y1="110" x2="720" y2="110" stroke="#f4f4f5" strokeDasharray="3 3" />
                  <line x1="0" y1="155" x2="720" y2="155" stroke="#e4e4e7" strokeWidth="1" />

                  {monthlyData.map((item, index) => {
                    const colWidth = 720 / monthlyData.length;
                    const xCenter = index * colWidth + colWidth / 2;
                    const maxVal = 130;
                    const grayH = (item.sales / maxVal) * 135;
                    const orangeH = (item.revenue / maxVal) * 135;
                    const isHovered = hoveredMonth === index;

                    return (
                      <g
                        key={item.month}
                        onMouseEnter={() => setHoveredMonth(index)}
                        onMouseLeave={() => setHoveredMonth(null)}
                        className="cursor-pointer"
                      >
                        {/* Gray Bar (Total Sales) */}
                        <rect
                          x={xCenter - 14}
                          y={155 - grayH}
                          width="11"
                          height={grayH}
                          rx="4"
                          fill={isHovered ? '#cbd5e1' : '#e4e4e7'}
                          style={{ transition: 'all 0.15s ease' }}
                        />

                        {/* Orange Bar (Total Revenue) */}
                        <rect
                          x={xCenter}
                          y={155 - orangeH}
                          width="11"
                          height={orangeH}
                          rx="4"
                          fill={isHovered ? '#ea580c' : '#f97316'}
                          style={{ transition: 'all 0.15s ease' }}
                        />

                        {/* Month Label */}
                        <text
                          x={xCenter - 3}
                          y="172"
                          textAnchor="middle"
                          fontSize="11"
                          fill={isHovered ? '#09090b' : '#71717a'}
                          fontWeight={isHovered ? '600' : '400'}
                        >
                          {item.month}
                        </text>

                        {/* Hover Tooltip */}
                        {isHovered && (
                          <g>
                            <rect
                              x={xCenter - 48}
                              y={155 - orangeH - 42}
                              width="96"
                              height="34"
                              rx="6"
                              fill="#09090b"
                              opacity="0.95"
                            />
                            <text
                              x={xCenter}
                              y={155 - orangeH - 26}
                              textAnchor="middle"
                              fontSize="10"
                              fill="#ffffff"
                              fontWeight="600"
                            >
                              Sales: ${item.sales}k
                            </text>
                            <text
                              x={xCenter}
                              y={155 - orangeH - 14}
                              textAnchor="middle"
                              fontSize="9"
                              fill="#f97316"
                              fontWeight="500"
                            >
                              Revenue: ${item.revenue}k
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Top Products (lg:col-span-1) */}
        <div>
          <div className="text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm bg-card border-border h-full">
            {/* Card Header */}
            <div className="flex flex-row items-center justify-between pb-2 px-6">
              <div className="text-base font-medium text-foreground">Top Products</div>
              <button
                className="inline-flex items-center justify-center size-9 h-8 w-8 rounded-md text-sm font-medium hover:bg-accent text-muted-foreground hover:text-foreground cursor-pointer border-none bg-transparent"
                aria-label="More options"
                onClick={() => addToast({ type: 'info', title: 'Product Catalog', message: 'All 4 SKUs verified with OMS consignment.' })}
              >
                <Ellipsis className="w-4 h-4" />
              </button>
            </div>

            {/* List of 4 Products matching reference */}
            <div className="px-6 space-y-4">
              {topProducts.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between cursor-pointer group"
                  onClick={() => navigateToCase(p.id)}
                  title="Click to view related investigation"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden flex items-center justify-center p-1 border border-border group-hover:border-foreground transition-colors">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground group-hover:text-cyan-700 transition-colors">
                        {p.name}
                      </p>
                      <p className="text-xs text-muted-foreground">{p.category}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-foreground">{p.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Grid Row 2: Customer Orders (1 col) + Sales by Countries (2 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Left: Customer Orders (1 col) */}
        <div className="h-full">
          <div className="text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm bg-card border-border h-full">
            <div className="flex flex-row items-center justify-between pb-2 px-6">
              <div>
                <div className="text-base font-medium text-foreground">Customer Orders</div>
                <p className="text-xs text-muted-foreground">1 Jan - 12 Dec 2026</p>
              </div>
              <button
                className="inline-flex items-center justify-center size-9 h-8 w-8 rounded-md text-sm font-medium hover:bg-accent text-muted-foreground hover:text-foreground cursor-pointer border-none bg-transparent"
                aria-label="More options"
                onClick={() => addToast({ type: 'info', title: 'Order Trends', message: '45,637 completed orders verified across hubs.' })}
              >
                <Ellipsis className="w-4 h-4" />
              </button>
            </div>

            <div className="px-6">
              <div className="mb-4">
                <p className="text-3xl font-semibold text-foreground">45,6370</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs bg-[var(--color-accent)] text-foreground px-2 py-0.5 rounded-full border border-border">
                    +9.4% ↗
                  </span>
                  <span className="text-xs text-muted-foreground">+245</span>
                </div>
              </div>

              {/* Mini Sparkline Bar Chart */}
              <div className="h-[120px] w-full relative">
                <svg viewBox="0 0 300 100" className="w-full h-full overflow-visible">
                  {ordersMiniData.map((val, i) => {
                    const barWidth = 300 / ordersMiniData.length;
                    const x = i * barWidth + barWidth / 2 - 5;
                    const h = (val / 90) * 80;
                    return (
                      <rect
                        key={i}
                        x={x}
                        y={90 - h}
                        width="10"
                        height={h}
                        rx="3"
                        fill="#09090b"
                        opacity={i === ordersMiniData.length - 1 ? 1 : 0.25 + (i / ordersMiniData.length) * 0.65}
                      />
                    );
                  })}
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Sales by Countries (2 cols) */}
        <div className="lg:col-span-2 h-full">
          <div className="text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm bg-card border-border h-full">
            <div className="flex flex-row items-center justify-between pb-2 px-6">
              <div>
                <div className="text-base font-medium text-foreground">Sales by Countries</div>
                <p className="text-xs text-muted-foreground">Revenue distribution by region</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="border border-border shadow-xs hover:bg-accent rounded-md px-3 h-7 text-xs bg-transparent flex items-center gap-1.5 cursor-pointer text-foreground"
                >
                  <span>All Products</span>
                  <ChevronDown className="w-3 h-3 ml-1 text-muted-foreground" />
                </button>
                <button
                  type="button"
                  className="border border-border shadow-xs hover:bg-accent rounded-md px-3 h-7 text-xs bg-transparent flex items-center gap-1.5 cursor-pointer text-foreground"
                >
                  <span>Top Countries</span>
                  <ChevronDown className="w-3 h-3 ml-1 text-muted-foreground" />
                </button>
              </div>
            </div>

            <div className="px-6">
              <div className="grid grid-cols-2 gap-6">
                {/* Left Stats */}
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Top Performing Country</p>
                    <p className="text-2xl font-semibold text-foreground">$1,245,680</p>
                    <p className="text-xs text-muted-foreground">United States</p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Revenue Growth</p>
                    <p className="text-2xl font-semibold text-[var(--color-positive)]">+34%</p>
                    <p className="text-xs text-muted-foreground">United States and Canada</p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-semibold text-foreground">$2,401,420</p>
                  </div>
                </div>

                {/* Right: Donut Chart with Legend Chips */}
                <div className="flex flex-col items-center">
                  <div className="h-[180px] w-full flex items-center justify-center relative">
                    <svg viewBox="0 0 160 160" width="160" height="160">
                      {/* Segment 1: US (Blue 42%) */}
                      <circle
                        cx="80"
                        cy="80"
                        r="55"
                        fill="transparent"
                        stroke="#3b82f6"
                        strokeWidth="22"
                        strokeDasharray="145 200"
                        strokeDashoffset="0"
                      />
                      {/* Segment 2: Brazil (Green 28%) */}
                      <circle
                        cx="80"
                        cy="80"
                        r="55"
                        fill="transparent"
                        stroke="#22c55e"
                        strokeWidth="22"
                        strokeDasharray="96 250"
                        strokeDashoffset="-145"
                      />
                      {/* Segment 3: Finland (Purple 18%) */}
                      <circle
                        cx="80"
                        cy="80"
                        r="55"
                        fill="transparent"
                        stroke="#8b5cf6"
                        strokeWidth="22"
                        strokeDasharray="62 280"
                        strokeDashoffset="-241"
                      />
                      {/* Segment 4: Bangladesh (Orange 12%) */}
                      <circle
                        cx="80"
                        cy="80"
                        r="55"
                        fill="transparent"
                        stroke="#f97316"
                        strokeWidth="22"
                        strokeDasharray="42 300"
                        strokeDashoffset="-303"
                      />
                    </svg>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-2 w-full">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#3b82f6' }}></div>
                      <span className="text-xs text-muted-foreground truncate">United States</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#22c55e' }}></div>
                      <span className="text-xs text-muted-foreground truncate">Brazil</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#8b5cf6' }}></div>
                      <span className="text-xs text-muted-foreground truncate">Finland</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#f97316' }}></div>
                      <span className="text-xs text-muted-foreground truncate">Bangladesh</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Connected ARGUS Operational Hub (Expandable Multi-Agent Cases & Activity) */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden mb-6">
        <button
          className="w-full p-4 flex items-center justify-between bg-muted/40 hover:bg-muted/70 transition-colors border-none text-left cursor-pointer"
          onClick={() => setShowArgusDrawer(!showArgusDrawer)}
        >
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-sm font-semibold text-foreground">
              ARGUS Autonomous Multi-Agent Operations & Active Cases ({cases.length})
            </span>
            <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full border border-border">
              Live Neural Swarm
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{showArgusDrawer ? 'Collapse Case Ledger' : 'Expand Case Ledger & Audit Telemetry'}</span>
            {showArgusDrawer ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {showArgusDrawer && (
          <div className="p-6 border-t border-border animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Cases Table (2 cols) */}
              <div className="lg:col-span-2 overflow-x-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-foreground">Active Case Investigations</h3>
                  <button
                    className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer bg-transparent border-none"
                    onClick={() => setCurrentView('cases')}
                  >
                    <span>View all cases</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground">
                      <th className="pb-2.5 font-medium">Case ID</th>
                      <th className="pb-2.5 font-medium">Customer</th>
                      <th className="pb-2.5 font-medium">Issue</th>
                      <th className="pb-2.5 font-medium">Status</th>
                      <th className="pb-2.5 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {cases.slice(0, 5).map((c) => (
                      <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3 font-mono font-semibold text-foreground">{c.id}</td>
                        <td className="py-3 text-muted-foreground">{c.customer?.name}</td>
                        <td className="py-3 max-w-[220px] truncate text-foreground">{c.title}</td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                              c.status === 'Resolved'
                                ? 'bg-green-50 text-green-700 border-green-200'
                                : c.status === 'Contradiction Detected'
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : 'bg-sky-50 text-sky-700 border-sky-200'
                            }`}
                          >
                            {c.status}
                          </span>
                        </td>
                        <td className="py-3">
                          <button
                            className="text-xs font-medium text-foreground hover:underline cursor-pointer bg-transparent border-none"
                            onClick={() => navigateToCase(c.id)}
                          >
                            Investigate →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Agent Swarm Activity (1 col) */}
              <div className="border-l border-border pl-6 space-y-3">
                <h3 className="text-sm font-semibold text-foreground mb-3">Live Multi-Agent Stream</h3>
                {[
                  { text: 'Billing Agent queried Stripe ledger: ch_3M4zZ confirmed', time: '2m ago' },
                  { text: 'Carrier FastTrack e-POD retrieved for ORD-99124', time: '5m ago' },
                  { text: 'Contradiction Check verified against warehouse weight scale', time: '12m ago' },
                  { text: 'Coordinator synthesized non-fraud resolution for ARG-1042', time: '18m ago' }
                ].map((act, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-muted/50 border border-border text-xs">
                    <p className="text-foreground leading-snug">{act.text}</p>
                    <span className="text-[10px] text-muted-foreground mt-1 block">{act.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
