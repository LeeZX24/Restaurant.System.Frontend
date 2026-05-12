import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  RSLabelTextFormControlComponent,
  RSLabelPasswordFormControlComponent,
  CustomFormGroup,
  RSLabelTextFormControl,
  RSLabelPasswordFormControl,
} from '@rs/forms';
import { BaseComponent } from '../../../../shared/components/base-component';
import { StaffDto } from '../../../../shared/models/dtos/staff.dto';
import { CommonModule } from '@angular/common';
import { provideNgxMask } from 'ngx-mask';
import { ActivityState } from '../../../../shared/enums/activity-state';
import {
  MaintenanceColumn,
  TableAction,
} from '../../../../shared/controls/maintenance/maintenance/maintenance.entity';
// import { MaintenanceTableComponent } from '../../../../shared/controls/maintenance/maintenance-table/maintenance-table.component';
import { CoreService } from '../../../../core/services/core.service';

@Component({
  selector: 'app-staff-maintenance',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RSLabelTextFormControlComponent,
    RSLabelPasswordFormControlComponent,
    // MaintenanceTableComponent,
  ],
  templateUrl: './staff-maintenance.component.html',
  styleUrl: './staff-maintenance.component.css',
  providers: [provideNgxMask()],
})
export class StaffMaintenanceComponent extends BaseComponent<StaffDto> implements OnInit {
  private coreService = inject(CoreService);

  _request!: StaffDto;

  columns: MaintenanceColumn<StaffDto>[] = [
    {
      key: 'username',
      label: 'Username',
    },
    {
      key: 'email',
      label: 'Email',
    },
    {
      key: 'fullName',
      label: 'Full Name',
    },
  ];

  rows = signal<StaffDto[]>([]);

  loading = signal(false);

  actions: TableAction[] = [
    {
      key: 'edit',
      label: 'Edit',
    },
    {
      key: 'delete',
      label: 'Delete',
    },
  ];

  get request(): StaffDto {
    return this._request;
  }
  set request(value: StaffDto) {
    this._request = value;
  }

  async ngOnInit() {
    this.form = this.createForm();
    this.loading.set(true);
    await this.coreService.getList<StaffDto>('maintenance/staff', 'list').subscribe({
      next: (res) => {
        this.rows.set(res);
        console.log(this.rows);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  createForm(): CustomFormGroup {
    const fg = new CustomFormGroup();

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
  }

  get usernameFC() {
    return this.getFormControl('username') as RSLabelTextFormControl;
  }
  get passwordFC() {
    return this.getFormControl('password') as RSLabelPasswordFormControl;
  }
  get firstNameFC() {
    return this.getFormControl('firstName') as RSLabelTextFormControl;
  }
  get lastNameFC() {
    return this.getFormControl('lastName') as RSLabelTextFormControl;
  }
  get emailFC() {
    return this.getFormControl('email') as RSLabelTextFormControl;
  }

  getFormControl(name: string) {
    return this.form.get(name);
  }

  RequestDetails(): StaffDto {
    const req: StaffDto = {
      ...this.form.getRawValue(),
      identifier: this.usernameFC.value,
      state: ActivityState.Others,
      route: 'maintenance/staff',
      action: 'add',
    };

    return req;
  }

  onValidateForm(): boolean {
    if (this.form.valid) {
      return true;
    } else {
      this.showFormControlsValidationErrors();
      return false;
    }
  }
}
