import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { provideNgxMask } from 'ngx-mask';
import { CommonModule } from '@angular/common';
import {
  CustomFormGroup,
  RSEmailFormControlComponent,
  RSPasswordFormControlComponent,
  RSTextFormControl,
} from '@LeeZX24/forms';
import { v7 as uuidv7 } from 'uuid';
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
    RSEmailFormControlComponent,
    RSPasswordFormControlComponent,
  ],
  providers: [provideNgxMask()],
})
export class LoginComponent extends BaseAuthComponent {
  createForm(): CustomFormGroup {
    const fg = new CustomFormGroup();

    fg._addCustomControl(
      'email',
      new RSTextFormControl({ required: true, inputType: 'email', autoComplete: 'username' }, '', [
        Validators.required,
        Validators.email,
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

  get emailFC() {
    return this.getFormControl('email') as RSTextFormControl;
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

    const request = { identifier: this.emailFC.value, password: this.passwordFC.value } as LoginRequestDto;
    this.authService.login(request);
  }

  redirectRegister() {
    this.routerService.gotoRegister();
  }
}
