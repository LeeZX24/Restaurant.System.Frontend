import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { provideNgxMask } from 'ngx-mask';
import { CommonModule } from '@angular/common';
import { CustomFormGroup, RSEmailFormControlComponent, RSPasswordFormControlComponent, RSTextFormControl } from '@rs/forms';
import { v4 as uuidv4 } from 'uuid';
import { BaseAuthComponent } from 'src/app/shared/components/base-auth-component/base-auth-component';
import { ActivityState } from 'src/app/shared/enums/activity-state';
import { UserDto } from 'src/app/shared/models/dtos/user.dto';

@Component({
  selector: 'rs-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RSEmailFormControlComponent,
    RSPasswordFormControlComponent
  ],
  providers: [
    provideNgxMask()
  ]
})
export class LoginComponent extends BaseAuthComponent<UserDto> {
  _request!: UserDto;
  get request(): UserDto { return this._request; }
  set request(value: UserDto) { this._request = value; }

  createForm(): CustomFormGroup {
    const fg = new CustomFormGroup();

    fg._addCustomControl('email', new RSTextFormControl({ required: true, inputType: 'email', autoComplete: 'username' }, '', [ Validators.required, Validators.email ]));
    fg._addCustomControl('password', new RSTextFormControl({ required: true, inputType: 'password', autoComplete: 'current-password' }, '', [ Validators.required ]));
    return fg;
  }

  get emailFC() { return this.getFormControl('email') as RSTextFormControl; }
  get passwordFC() { return this.getFormControl('password') as RSTextFormControl; }

  getFormControl(name: string) {
    return this.form.get(name);
  }

  RequestDetails(): UserDto {
    const req: UserDto =
    {
      ...this.form.getRawValue(),
      identifier: this.emailFC.value,
      state: ActivityState.Login,
      customerId: uuidv4()
    };
    return req;
  }

  onValidateForm(): boolean {
    if(this.form.valid) {
      return true;
    }

    this.showFormControlsValidationErrors();
    return false;
  }
}
