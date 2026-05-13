export interface NavItem {
  label: string;
  icon: string;
  route?: string;
  isHeader?: boolean;
  children?: NavItem[]; // For the tree structure
}

export const NAV_DATA: NavItem[] = [
  { label: 'Dashboard', icon: 'dashboard', route: '/admin/dashboard' },
  {
    label: 'Maintenance',
    icon: 'build_circle',
    children: [
      { label: 'Staff Maintenance', icon: 'person_apron', route: '/admin/maintenance/staff' },
    ],
  },
  {
    label: 'Reports',
    icon: 'bar_chart',
    children: [
      { label: 'Sales', icon: 'payments', route: '/admin/reports/sales' },
      { label: 'Inventory', icon: 'inventory', route: '/admin/reports/inventory' },
      {
        label: 'Product',
        icon: 'inventory_2',
        children: [
          { label: 'Food', icon: 'fork_spoon', route: '/admin/reports/product/food' },
          { label: 'Beverage', icon: 'glass_cup', route: '/admin/reports/product/beverage' },
        ],
      },
    ],
  },
  { label: 'Settings', icon: 'settings', route: '/admin/settings' },
];
