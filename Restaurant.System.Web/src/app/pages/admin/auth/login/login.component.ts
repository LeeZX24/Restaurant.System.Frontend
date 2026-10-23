import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CustomFormGroup, RSPasswordFormControlComponent, RSTextFormControl, RSTextFormControlComponent } from '@LeeZX24/forms';
import { BaseAuthComponent } from '../../../../shared/components/base-auth-component/base-auth-component';
import { LoginRequestDto } from '../../../../shared/models/dtos/auth/login.dto';
import { DialogVariant } from '@LeeZX24/dialogs';
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
    RSPasswordFormControlComponent,
    RSTextFormControlComponent
  ],
})
export class LoginComponent extends BaseAuthComponent {
  private readonly controlService = inject(ControlService);

  createForm(): CustomFormGroup {
    const fg = new CustomFormGroup();

    fg._addCustomControl('username', this.controlService.NonLabelText('Username', true, '', { autocomplete: 'username' }));
    fg._addCustomControl('password', this.controlService.NonLabelPassword('Password', true, '', { isNewPassword:false }));
    return fg;
  }

  get usernameFC() { return this.getFormControl('username') as RSTextFormControl; }
  get passwordFC() { return this.getFormControl('password') as RSTextFormControl; }

  protected override onValidateForm(): boolean {
    if (this.form.valid) {
      return true;
    }

    this.showFormControlsValidationErrors();
    return false;
  }

  onSubmitLogin() {
    if (!this.onValidateForm()) return;

    const request = { identifier: this.usernameFC.value, password: this.passwordFC.value } as LoginRequestDto;

    const ref = this.dialogService.showLoadingDialog('Login User ...', false, false, { loading: true });

    ref.afterOpened().subscribe(() => {
      this.authService.login(request).subscribe({
        next: async (response) => {
          await this.handleSuccess(ref, response, 'Login successful.', 'Success');

          await this.wait(1000);
          
          await this.authService.setAuthSession(response);
          
          await ref.update({
            message: 'Check First Time Login ...', 
            title: 'Info - Login', 
            variant: DialogVariant.Info,
            extraConfig: { loading: true }
          })
          
          await this.wait(1000);

          if(response.userInfo?.securityInfo?.mustChangePassword){
            await ref.update({
              message: 'Redirect to Change Password', 
              title: 'Info - Login', 
              variant: DialogVariant.Info,
              extraConfig: { loading: true }
            })

            await this.wait(1000);

            await this.routerService.navigateTo('/admin/auth/change-password');

            ref.close();
          }
            
          else {
            await ref.update({
              message: 'Redirect to Dashboard', 
              title: 'Info - Login', 
              variant: DialogVariant.Info,
              extraConfig: { loading: true }
            })

            await this.wait(1000);

            await this.routerService.navigateTo('/admin/dashboard');

            ref.close();
          }
            
        },
        error: (error) => {
          this.handleError(ref, error, 'Login failed.');
        }
      });
    });
  }
}
