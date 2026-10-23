import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CustomFormGroup, RSEmailFormControlComponent, RSPasswordFormControlComponent, RSTextFormControl } from '@LeeZX24/forms';
import { BaseAuthComponent } from '../../../../shared/components/base-auth-component/base-auth-component';
import { LoginRequestDto } from '../../../../shared/models/dtos/auth/login.dto';
import { ControlService } from '../../../../shared/services/control.service';



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
})
export class LoginComponent extends BaseAuthComponent {
  private readonly controlService = inject(ControlService);

  createForm(): CustomFormGroup {
    const fg = new CustomFormGroup();
    fg._addCustomControl('email',this.controlService.NonLabelEmail('Email', true, ''));
    fg._addCustomControl('password', this.controlService.NonLabelPassword('Password', true, '', { isNewPassword: false }));
    return fg;
  }

  get emailFC() { return this.getFormControl('email') as RSTextFormControl; }
  get passwordFC() { return this.getFormControl('password') as RSTextFormControl; }

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

    const ref = this.dialogService.showLoadingDialog('Login User ...', false, false, { loading: true });

    ref.afterOpened().subscribe(() => {
      this.authService.login(request).subscribe({
        next: async (response) => {
          await this.handleSuccess(ref, response, 'Login successful.', 'Success');
          await this.authService.setAuthSession(response);
        },
        error: (err) => {
          this.handleError(err, 'Login Failed');
        }
      });
    });
  }

  redirectRegister() {
    this.routerService.gotoMemberRegister();
  }
}
