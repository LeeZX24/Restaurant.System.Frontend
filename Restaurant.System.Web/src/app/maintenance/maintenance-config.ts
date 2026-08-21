import { StaffDto } from '../shared/models/dtos/staff.dto';
import { MaintenanceConfig } from './maintenance.entity';
import { RoleDto } from '../shared/models/dtos/role.dto';
import { DropdownDto } from '../shared/models/dtos/dropdown.dto';
import { DropdownMaintenanceFormComponent } from './forms/dropdown-maintenance-form/dropdown-maintenance-form.component';
import { DropdownMaintenanceFormGroup } from './forms/dropdown-maintenance-form/dropdown-maintenance-form';
import { MaintenanceFormGroup } from './maintenance.form-group';
import { StaffMaintenanceFormComponent } from './forms/staff-maintenance-form/staff-maintenance-form.component';
import { RoleMaintenanceFormComponent } from './forms/role-maintenance-form/role-maintenance-form.component';

export const STAFF_CONFIG: MaintenanceConfig<MaintenanceFormGroup<StaffDto>, StaffDto> = {
  route: 'staff',
  title: 'Staff Management',

  columns: [
    { key: 'username', label: 'Username', width: '70px' },
    { key: 'email', label: 'Email', width: '150px' },
    {
      label: 'Full Name',
      columnValue: (row) => {
        return `${row.firstName} ${row.lastName}`;
      },
      width: '150px',
    },
  ],

  actions: [
    { key: 'edit', label: 'Edit', icon: 'edit' },
    { key: 'delete', label: 'Delete', icon: 'delete' },
  ],
  search: {
    enabled: true,
    placeholder: 'Search staff ...',
    predicate: (row, term) =>
      row.username.toLowerCase().includes(term) ||
      row.email.toLowerCase().includes(term) ||
      row.firstName.toLowerCase().includes(term) ||
      row.lastName.toLowerCase().includes(term),
  },
  formComponent: StaffMaintenanceFormComponent,
  endpoints: {
    list: 'list',
    create: 'create',
    update: 'update',
    delete: 'delete',
  },
};

export const ROLE_CONFIG: MaintenanceConfig<MaintenanceFormGroup<RoleDto>, RoleDto> = {
  route: 'role',
  title: 'Role Maintenance',

  columns: [
    { key: 'roleCode', label: 'Code' },
    { key: 'roleName', label: 'Name' },
  ],

  actions: [
    { key: 'edit', label: 'Edit', icon: 'edit' },
    { key: 'delete', label: 'Delete', icon: 'delete' },
  ],
  search: {
    enabled: true,
    placeholder: 'Search role ...',
    predicate: (row, term) =>
      row.roleCode?.toLowerCase().includes(term) || row.roleName?.toLowerCase().includes(term),
  },
  formComponent: RoleMaintenanceFormComponent,
  endpoints: {
    list: 'list',
    create: 'create',
    update: 'update',
    delete: 'delete',
  },
};

export const DROPDOWN_CONFIG: MaintenanceConfig<DropdownMaintenanceFormGroup, DropdownDto> = {
  route: 'dropdown',
  title: 'Dropdown Maintenance',

  columns: [
    { key: 'category', label: 'Category' },
    { key: 'code', label: 'Code' },
    { key: 'description', label: 'Description' },
  ],

  actions: [
    { key: 'edit', label: 'Edit', icon: 'edit' },
    { key: 'delete', label: 'Delete', icon: 'delete' },
  ],
  search: {
    enabled: true,
    placeholder: 'Search role ...',
    predicate: (row, term) =>
      row.category?.toLowerCase().includes(term) ||
      row.code?.toLowerCase().includes(term) ||
      row.description?.toLowerCase().includes(term),
  },
  formComponent: DropdownMaintenanceFormComponent,
  endpoints: {
    list: 'list',
    create: 'create',
    update: 'update',
    delete: 'delete',
  },
};
