import { Component, OnInit } from '@angular/core';
import { CustomFormGroup, RSLabelTextFormControl, RSLabelPasswordFormControlComponent } from '@LeeZX24/forms';
import { BaseAuthComponent } from '../../../../shared/components/base-auth-component/base-auth-component';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChangePasswordRequestDto } from '../../../../shared/models/dtos/auth/change-password.dto';
import { DialogVariant } from '@LeeZX24/dialogs';

@Component({
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RSLabelPasswordFormControlComponent],
  selector: 'app-change-password',
  styleUrl: './change-password.component.css',
  templateUrl: './change-password.component.html',
})
export class ChangePasswordComponent extends BaseAuthComponent implements OnInit {
  override ngOnInit(): void {
    super.ngOnInit();

    this.confirmPasswordFC.valueChanges.subscribe(() => {
      this.OnCheckingPasswordMismatch();
    });
  }

  protected override createForm(): CustomFormGroup {
    const fg = new CustomFormGroup();

    fg._addCustomControl('password', new RSLabelTextFormControl('New Password', { required: true, inputType: 'password', autoComplete: 'current-password' }, '', [Validators.required]));
    fg._addCustomControl('confirmPassword', new RSLabelTextFormControl('Confirm Password', { required: true, inputType: 'password', autoComplete: 'current-password' }, '', [Validators.required]));

    return fg;
  }

  get passwordFC() { return this.getFormControl('password') as RSLabelTextFormControl; }
  get confirmPasswordFC() { return this.getFormControl('confirmPassword') as RSLabelTextFormControl; }
  
  protected override onValidateForm(): boolean {
    if (
      !this.passwordFC.value ||
      !this.confirmPasswordFC.value ||
      this.passwordFC.value === '' ||
      this.confirmPasswordFC.value === ''
    ) {
      return false;
    }

    if (this.form.valid) {
      return true;
    } else {
      this.showFormControlsValidationErrors();
      return false;
    }
  }

  OnCheckingPasswordMismatch(): void {
    if (!this.passwordFC || !this.confirmPasswordFC) {
      this.removeMismatchError();
      return;
    }

    if (this.passwordFC.value !== this.confirmPasswordFC.value) {
      this.confirmPasswordFC.setErrors({ passwordMismatch: true });
    } else {
      this.removeMismatchError();
    }
  }

  private removeMismatchError() {
    const errors = this.confirmPasswordFC.errors;
    if (!errors) return;

    if (errors['passwordMismatch']) delete errors['passwordMismatch'];

    this.confirmPasswordFC.setErrors(Object.keys(errors).length ? errors : null);
  }

  onSubmitChangePassword() {
    if (!this.onValidateForm) return;
    const user = this.authService.getCurrentUserValue();
    const request = { userInfo: user, newPassword: this.passwordFC.value } as ChangePasswordRequestDto;
    
    const ref = this.dialogService.showLoadingDialog('Changing Password ...', false, false, { loading: true })

    ref.afterOpened().subscribe(() => {
      this.authService.changePassword(request).subscribe({
        next: async (response) => {
          await this.handleSuccess(ref, response, 'Password changed successfully.', 'Success');

          // if(response.passwordChanged) {

          //   await ref.update({
          //     message: 'Redirect to Dashboard', 
          //     title: 'Info - Login', 
          //     variant: DialogVariant.Info,
          //     extraConfig: { loading: true }
          //   })
            
          //   await this.routerService.navigateTo('/admin/dashboard');

          //   await this.wait(1000);

          //   ref.close();
          // }

          await ref.update({
            message: 'Logging out...', 
            title: 'Info - Login', 
            variant: DialogVariant.Info,
            extraConfig: { loading: true }
          })
          
          await this.authService.logout();


          await this.wait(1000);

          await ref.update({
            message: 'Redirect to Login...', 
            title: 'Info - Login', 
            variant: DialogVariant.Info,
            extraConfig: { loading: true }
          })

          await this.wait(1000);

          await this.routerService.gotoLogin();

          ref.close();
        },
        error: (error) => {
          this.handleError(error, 'Change password failed.');
        }
      });
    });
  }
}
