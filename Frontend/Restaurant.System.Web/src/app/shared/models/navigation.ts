export interface NavItem {
  label: string;
  icon: string;
  route?: string;
  children?: NavItem[]; // For the tree structure
}

export const NAV_DATA: NavItem[] = [
  { label: 'Dashboard', icon: 'dashboard', route: '/admin/dashboard' },
  {
    label: 'Reports',
    icon: 'bar_chart',
    children: [
      { label: 'Sales', icon: 'payments', route: '/admin/reports/sales' },
      { label: 'Inventory', icon: 'inventory', route: '/admin/reports/inventory' },
    ],
  },
  { label: 'Settings', icon: 'settings', route: '/admin/settings' },
];
