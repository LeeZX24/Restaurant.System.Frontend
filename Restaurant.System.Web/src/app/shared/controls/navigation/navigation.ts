export interface NavItem {
  label: string;
  type: NavMenuType;
  icon: string;
  route: string;
  isHeader?: boolean;
  children?: NavItem[];
}

export enum NavMenuType {
  item = 'ITEM',
  group = 'GROUP'
}

export const NAV_DATA: NavItem[] = [
  { label: 'Dashboard', type: NavMenuType.item, icon: 'dashboard', route: 'dashboard' },
  {
    label: 'Maintenance',
    type: NavMenuType.group,
    icon: 'build_circle',
    route: 'maintenance',
    children: [
      { label: 'Staff Maintenance', type: NavMenuType.item, icon: 'person_apron', route: 'staff' },
      { label: 'Role Maintenance', type: NavMenuType.item, icon: 'shield_person', route: 'role' },
    ],
  },
  {
    label: 'Reports',
    type: NavMenuType.group,
    icon: 'bar_chart',
    route: 'reports',
    children: [
      { label: 'Sales', type: NavMenuType.item, icon: 'payments', route: 'sales' },
      { label: 'Inventory', type: NavMenuType.item, icon: 'inventory', route: 'inventory' },
      {
        label: 'Products',
        type: NavMenuType.group,
        icon: 'inventory_2',
        route: 'products',
        children: [
          { label: 'Food', type: NavMenuType.item, icon: 'fork_spoon', route: 'food' },
          { label: 'Beverage', type: NavMenuType.item, icon: 'glass_cup', route: 'beverage' },
        ],
      },
    ],
  },
  { label: 'Settings', type: NavMenuType.item, icon: 'settings', route: 'settings' },
];
