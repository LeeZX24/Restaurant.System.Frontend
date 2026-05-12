import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { provideNgxMask } from 'ngx-mask';
import { CommonModule } from '@angular/common';
import {
  CustomFormGroup,
  RSPasswordFormControlComponent,
  RSTextFormControl,
  RSTextFormControlComponent,
} from '@rs/forms';
import { BaseAuthComponent } from '../../../../shared/components/base-auth-component/base-auth-component';
import { ActivityState } from '../../../../shared/enums/activity-state';
import { UserDto } from '../../../../shared/models/dtos/user.dto';

@Component({
  selector: 'rs-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RSPasswordFormControlComponent,
    RSTextFormControlComponent,
  ],
  providers: [provideNgxMask()],
})
export class LoginComponent extends BaseAuthComponent<UserDto> {
  _request!: UserDto;
  get request(): UserDto {
    return this._request;
  }
  set request(value: UserDto) {
    this._request = value;
  }

  createForm(): CustomFormGroup {
    const fg = new CustomFormGroup();

    fg._addCustomControl(
      'username',
      new RSTextFormControl({ required: true, inputType: 'text', autoComplete: 'username' }, '', [
        Validators.required,
      ]),
    );
    fg._addCustomControl(
      'password',
      new RSTextFormControl(
        { required: true, inputType: 'password', autoComplete: 'current-password' },
        '',
        [Validators.required],
      ),
    );
    return fg;
  }

  get usernameFC() {
    return this.getFormControl('username') as RSTextFormControl;
  }
  get passwordFC() {
    return this.getFormControl('password') as RSTextFormControl;
  }

  getFormControl(name: string) {
    return this.form.get(name);
  }

  RequestDetails(): UserDto {
    const req: UserDto = {
      ...this.form.getRawValue(),
      identifier: this.usernameFC.value,
      state: ActivityState.Login,
    };
    return req;
  }

  onValidateForm(): boolean {
    if (this.form.valid) {
      return true;
    }

    this.showFormControlsValidationErrors();
    return false;
  }
}
