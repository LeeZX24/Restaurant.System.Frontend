import { RSLabelPasswordFormControl, RSLabelTextFormControl } from '@rs/forms';
import { StaffDto } from '../../../models/dtos/staff.dto';
import { Validators } from '@angular/forms';
import { MaintenanceFormGroup } from './maintenance.form-group';
import { MaintenanceConfig } from './maintenance.entity';
import { RoleDto } from '../../../models/dtos/role.dto';

export const STAFF_CONFIG: MaintenanceConfig<StaffDto> = {
  route: 'maintenance/staff',
  title: 'Staff Management',

  columns: [
    { key: 'username', label: 'Username', width:'70px' },
    { key: 'email', label: 'Email', width: '150px' },
    { label: 'Full Name',
      columnValue: (row) => {
        return `${row.firstName} ${row.lastName}`;
      },
      width: '150px'
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
  createForm: () => {
    const fg = new MaintenanceFormGroup<StaffDto>(STAFF_CONFIG);

    fg._addCustomControl(
      'username',
      new RSLabelTextFormControl(
        'Username',
        { required: true, inputType: 'text', autoComplete: 'username' },
        '',
        [Validators.required],
      ),
    );

    fg._addCustomControl(
      'password',
      new RSLabelPasswordFormControl(
        'Password',
        { required: true, inputType: 'password', autoComplete: 'current-password' },
        '',
        [Validators.required],
      ),
    );

    fg._addCustomControl(
      'firstName',
      new RSLabelTextFormControl(
        'First Name',
        { required: true, inputType: 'text' },
        '',
        [Validators.required],
      ),
    );

    fg._addCustomControl(
      'lastName',
      new RSLabelTextFormControl(
        'Last Name',
        {
          required: false,
          inputType: 'text'
        },
        ''),
    );

    fg._addCustomControl(
      'email',
      new RSLabelTextFormControl(
        'Email',
        { required: true, inputType: 'email', autoComplete: 'username' },
        '',
        [Validators.required, Validators.email],
      ),
    );

    return fg;
  },

  endpoints: {
    list: 'list',
    create: 'create',
    update: 'update',
    delete: 'delete',
  },
};

export const ROLE_CONFIG: MaintenanceConfig<RoleDto> = {
  route: 'maintenance/role',
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
      row.roleCode.toLowerCase().includes(term) ||
      row.roleName.toLowerCase().includes(term),
  },
  createForm: () => {
    const fg = new MaintenanceFormGroup<RoleDto>(ROLE_CONFIG);

    fg._addCustomControl(
      'roleCode',
      new RSLabelTextFormControl('Code', { required: true, inputType: 'text' }, '', [
        Validators.required,
      ]),
    );
    fg._addCustomControl(
      'roleName',
      new RSLabelTextFormControl('Name', { required: false, inputType: 'text' }, ''),
    );

    return fg;
  },

  endpoints: {
    list: 'list',
    create: 'create',
    update: 'update',
    delete: 'delete',
  },
};
