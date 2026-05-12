import { RSLabelPasswordFormControl, RSLabelTextFormControl } from '@rs/forms';
import { StaffDto } from '../../../models/dtos/staff.dto';
import { Validators } from '@angular/forms';
import { MaintenanceFormGroup } from './maintenance.form-group';
import { MaintenanceConfig } from './maintenance.entity';

export const STAFF_CONFIG: MaintenanceConfig<StaffDto> = {
  route: 'maintenance/staff',
  title: 'Staff Management',

  columns: [
    { key: 'username', label: 'Username' },
    { key: 'email', label: 'Email' },
    { key: 'fullName', label: 'Full Name' },
  ],

  actions: [
    { key: 'edit', label: 'Edit', icon: 'edit' },
    { key: 'delete', label: 'Delete', icon: 'delete' },
  ],

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
      new RSLabelTextFormControl('First Name', { required: true, inputType: 'text' }, '', [
        Validators.required,
      ]),
    );
    fg._addCustomControl(
      'lastName',
      new RSLabelTextFormControl('Last Name', { required: false, inputType: 'text' }, ''),
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
