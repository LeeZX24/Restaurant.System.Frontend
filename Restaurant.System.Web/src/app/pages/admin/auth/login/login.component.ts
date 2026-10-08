import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { provideNgxMask } from 'ngx-mask';
import { CommonModule } from '@angular/common';
import {
  CustomFormGroup,
  RSPasswordFormControlComponent,
  RSTextFormControl,
  RSTextFormControlComponent,
} from '@LeeZX24/forms';
import { BaseAuthComponent } from '../../../../shared/components/base-auth-component/base-auth-component';
import { LoginRequestDto } from '../../../../shared/models/dtos/auth/login.dto';

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
export class LoginComponent extends BaseAuthComponent {

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

  onValidateForm(): boolean {
    if (this.form.valid) {
      return true;
    }

    this.showFormControlsValidationErrors();
    return false;
  }

  onSubmitLogin() {
    if (!this.onValidateForm) return;

    const request = { identifier: this.usernameFC.value, password: this.passwordFC.value } as LoginRequestDto;
    this.authService.login(request);
  }
}
