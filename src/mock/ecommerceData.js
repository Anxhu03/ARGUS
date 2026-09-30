export const metricCardsData = [
  {
    id: 'total-revenue',
    label: 'Total Revenue',
    value: '$128,430.00',
    change: '+12.5%',
    changeType: 'positive',
    comparison: 'vs last month',
    icon: 'DollarSign'
  },
  {
    id: 'total-orders',
    label: 'Total Orders',
    value: '2,847',
    change: '+8.2%',
    changeType: 'positive',
    comparison: 'vs last month',
    icon: 'ShoppingCart'
  },
  {
    id: 'total-customers',
    label: 'Total Customers',
    value: '18,492',
    change: '+14.6%',
    changeType: 'positive',
    comparison: 'vs last month',
    icon: 'Users'
  },
  {
    id: 'conversion-rate',
    label: 'Conversion Rate',
    value: '4.8%',
    change: '+2.1%',
    changeType: 'positive',
    comparison: 'vs last month',
    icon: 'Activity'
  }
];

export const revenueOverviewData = [
  { month: 'Jan', revenue: 64200, profit: 42100 },
  { month: 'Feb', revenue: 78500, profit: 54300 },
  { month: 'Mar', revenue: 86400, profit: 61200 },
  { month: 'Apr', revenue: 72900, profit: 49800 },
  { month: 'May', revenue: 95400, profit: 68700 },
  { month: 'Jun', revenue: 112800, profit: 82400 },
  { month: 'Jul', revenue: 104200, profit: 75600 },
  { month: 'Aug', revenue: 118900, profit: 89300 },
  { month: 'Sep', revenue: 122400, profit: 92800 },
  { month: 'Oct', revenue: 128430, profit: 98643 },
  { month: 'Nov', revenue: 135800, profit: 104200 },
  { month: 'Dec', revenue: 148200, profit: 115600 }
];

export const topProductsData = [
  {
    id: 'prod-1',
    name: 'Adidas Ultraboost Running Shoe',
    subtitle: 'Running Shoes • SKU-8821',
    image: '/adidas-ultraboost-running-shoe.svg',
    revenue: '$32,450',
    sales: '180 sold',
    change: '+12.4%',
    changeType: 'positive'
  },
  {
    id: 'prod-2',
    name: 'Samsung Galaxy Watch',
    subtitle: 'Smartwatch • SKU-4412',
    image: '/samsung-galaxy-watch-smartwatch.svg',
    revenue: '$28,920',
    sales: '96 sold',
    change: '+8.1%',
    changeType: 'positive'
  },
  {
    id: 'prod-3',
    name: 'Sony WH-1000XM5 Headphones',
    subtitle: 'Noise-Canceling • SKU-3301',
    image: '/sony-wh1000xm5-headphones.svg',
    revenue: '$24,180',
    sales: '60 sold',
    change: '+15.3%',
    changeType: 'positive'
  },
  {
    id: 'prod-4',
    name: 'Apple AirPods Pro',
    subtitle: 'Wireless Earbuds • SKU-1092',
    image: '/apple-airpods-pro-earbuds.svg',
    revenue: '$19,450',
    sales: '78 sold',
    change: '+5.2%',
    changeType: 'positive'
  },
  {
    id: 'prod-5',
    name: 'Nike Pegasus 40',
    subtitle: 'Performance Gear • SKU-7721',
    image: '/nike-pegasus-running-shoe.svg',
    revenue: '$14,210',
    sales: '109 sold',
    change: '+9.8%',
    changeType: 'positive'
  }
];

export const recentOrdersData = [
  {
    id: 'ORD-9281',
    customer: {
      name: 'Sarah Jenkins',
      email: 'sarah.j@gmail.com',
      avatar: 'SJ'
    },
    product: 'Sony WH-1000XM5 Headphones (1x)',
    date: 'Oct 24, 2026',
    amount: '$399.00',
    status: 'Completed'
  },
  {
    id: 'ORD-9280',
    customer: {
      name: 'Michael Chang',
      email: 'm.chang@outlook.com',
      avatar: 'MC'
    },
    product: 'Samsung Galaxy Watch 6 (1x)',
    date: 'Oct 24, 2026',
    amount: '$299.00',
    status: 'Processing'
  },
  {
    id: 'ORD-9279',
    customer: {
      name: 'Emma Watson',
      email: 'emma.w@icloud.com',
      avatar: 'EW'
    },
    product: 'Apple AirPods Pro (2nd Gen) (1x)',
    date: 'Oct 23, 2026',
    amount: '$249.00',
    status: 'Completed'
  },
  {
    id: 'ORD-9278',
    customer: {
      name: 'David Miller',
      email: 'david.miller@work.com',
      avatar: 'DM'
    },
    product: 'Adidas Ultraboost 22 (1x)',
    date: 'Oct 23, 2026',
    amount: '$180.00',
    status: 'Pending'
  },
  {
    id: 'ORD-9277',
    customer: {
      name: 'Jessica Taylor',
      email: 'jtaylor@design.co',
      avatar: 'JT'
    },
    product: 'Nike Pegasus 40 (1x)',
    date: 'Oct 22, 2026',
    amount: '$130.00',
    status: 'Cancelled'
  },
  {
    id: 'ORD-9276',
    customer: {
      name: 'Lucas Vance',
      email: 'lucas.v@argus.io',
      avatar: 'LV'
    },
    product: 'Sony WH-1000XM5 + AirPods Pro bundle',
    date: 'Oct 22, 2026',
    amount: '$648.00',
    status: 'Completed'
  }
];

export const salesByLocationData = [
  {
    country: 'United States',
    code: 'US',
    amount: '$54,230',
    percentage: 42.2,
    color: '#3b82f6',
    growth: '+18.4%'
  },
  {
    country: 'United Kingdom',
    code: 'GB',
    amount: '$28,450',
    percentage: 22.1,
    color: '#60a5fa',
    growth: '+12.1%'
  },
  {
    country: 'Canada',
    code: 'CA',
    amount: '$18,920',
    percentage: 14.7,
    color: '#818cf8',
    growth: '+9.5%'
  },
  {
    country: 'Germany',
    code: 'DE',
    amount: '$14,350',
    percentage: 11.2,
    color: '#a78bfa',
    growth: '+14.8%'
  },
  {
    country: 'Australia',
    code: 'AU',
    amount: '$12,480',
    percentage: 9.8,
    color: '#38bdf8',
    growth: '+6.2%'
  }
];

export const notificationsData = [
  {
    id: 'notif-1',
    title: 'Order ORD-9281 Delivered',
    message: 'Package signed by Sarah Jenkins in Seattle, WA.',
    time: '5m ago',
    unread: true,
    type: 'success'
  },
  {
    id: 'notif-2',
    title: 'Conversion Spike Detected',
    message: 'Store conversion rate climbed to 4.8% (+2.1% DoD).',
    time: '42m ago',
    unread: true,
    type: 'info'
  },
  {
    id: 'notif-3',
    title: 'ARGUS Case #ARG-1049 Resolved',
    message: 'Contradiction flagged and automated $79.99 refund issued.',
    time: '2h ago',
    unread: false,
    type: 'agent'
  },
  {
    id: 'notif-4',
    title: 'Inventory Alert: AirPods Pro',
    message: 'Stock levels fallen below safety threshold (14 units remaining).',
    time: '5h ago',
    unread: false,
    type: 'warning'
  }
];
