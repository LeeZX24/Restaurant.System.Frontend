import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BaseAuthComponent } from '../../../../shared/components/base-auth-component/base-auth-component';
import { CustomFormGroup, RSLabelTextFormControlComponent, RSLabelEmailFormControlComponent, RSLabelPasswordFormControl, RSLabelPasswordFormControlComponent, RSLabelTextFormControl } from '@LeeZX24/forms';
import { RegistrarDto, RegisterRequestDto } from '../../../../shared/models/dtos/auth/register.dto';
import { ControlService } from '../../../../shared/services/control.service';

@Component({
  selector: 'rs-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RSLabelTextFormControlComponent,
    RSLabelEmailFormControlComponent,
    RSLabelPasswordFormControlComponent
  ],
})
export class RegisterComponent extends BaseAuthComponent implements OnInit {
  private readonly controlService = inject(ControlService);

  override ngOnInit() {
    super.ngOnInit();

    this.confirmPasswordFC.valueChanges.subscribe(() => {
      this.OnCheckingPasswordMismatch();
    });
  }

  createForm(): CustomFormGroup {
    const fg = new CustomFormGroup();

    fg._addCustomControl('email', this.controlService.LabelEmail('Email', false, ''));
    fg._addCustomControl('lastName', this.controlService.LabelText('Last Name', true, '', { autocomplete: 'family-name' }));
    fg._addCustomControl('firstName', this.controlService.LabelText('First Name', false, '', { autocomplete: 'given-name' }));
    fg._addCustomControl('middleName', this.controlService.LabelText('Middle Name', false, '', { autocomplete: 'additional-name' }));
    fg._addCustomControl('password', this.controlService.LabelPassword('Password', true, '', { isNewPassword: true }));
    fg._addCustomControl('confirmPassword', this.controlService.LabelPassword('Confirm Password', true, '', { isNewPassword: true }));

    return fg;
  } 

  get emailFC() { return this.getFormControl('email') as RSLabelTextFormControl; }
  get lastNameFC() { return this.getFormControl('lastName') as RSLabelTextFormControl; }
  get firstNameFC() { return this.getFormControl('firstName') as RSLabelTextFormControl; }
  get middleNameFC() { return this.getFormControl('middleName') as RSLabelTextFormControl; }
  get passwordFC() { return this.getFormControl('password') as RSLabelPasswordFormControl; }
  get confirmPasswordFC() { return this.getFormControl('confirmPassword') as RSLabelPasswordFormControl; }

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
  
  onSubmitRegister() {
    if (!this.onValidateForm) return;

    const registrar = { lastName: this.lastNameFC.value, firstName: this.firstNameFC.value, middleName: this.middleNameFC.value } as RegistrarDto;

    const request = { identifier: this.emailFC.value, password: this.passwordFC.value, registrarInfo: registrar } as RegisterRequestDto;
    
    this.authService.register(request);
  }

  redirectLogin() {
    this.routerService.gotoMemberLogin();
  }
}
