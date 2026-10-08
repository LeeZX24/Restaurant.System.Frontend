import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { provideNgxMask } from 'ngx-mask';
import { v7 as uuidv7 } from 'uuid';
import { BaseAuthComponent } from '../../../../shared/components/base-auth-component/base-auth-component';
import { CustomFormGroup, RSLabelTextFormControlComponent, RSLabelEmailFormControlComponent, RSLabelPasswordFormControl, RSLabelPasswordFormControlComponent, RSLabelTextFormControl } from '@LeeZX24/forms';
import { RegistrarDto, RegisterRequestDto } from '../../../../shared/models/dtos/auth/register.dto';

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
  providers: [provideNgxMask()],
})
export class RegisterComponent extends BaseAuthComponent implements OnInit {
  fg = new CustomFormGroup();

  override ngOnInit() {
    super.ngOnInit();

    this.confirmPasswordFC.valueChanges.subscribe(() => {
      this.OnCheckingPasswordMismatch();
    });
  }

  createForm(): CustomFormGroup {
    this.fg._addCustomControl(
      'email',
      new RSLabelTextFormControl(
        'Email',
        { required: true, inputType: 'email', autoComplete: 'username' },
        '',
        [Validators.required, Validators.email],
      ),
    );
    
    this.fg._addCustomControl(
      'lastName',
      new RSLabelTextFormControl(
        'Last Name',
        { required: true, inputType: 'text' },
        '',
        [Validators.required],
      ),
    );
    this.fg._addCustomControl(
      'firstName',
      new RSLabelTextFormControl(
        'First Name',
        { required: true, inputType: 'text' },
        '',
        [],
      ),
    );
    this.fg._addCustomControl(
      'middleName',
      new RSLabelTextFormControl(
        'Middle Name',
        { required: true, inputType: 'text' },
        '',
        [],
      ),
    );
    
    this.fg._addCustomControl(
      'password',
      new RSLabelPasswordFormControl(
        'Password',
        { required: true, inputType: 'password', autoComplete: 'new-password' },
        '',
        [Validators.required],
      ),
    );
    this.fg._addCustomControl(
      'confirmPassword',
      new RSLabelPasswordFormControl(
        'Confirm Password',
        { required: true, inputType: 'password', autoComplete: 'new-password' },
        '',
        [Validators.required],
      ),
    );

    return this.fg;
  } 

  get emailFC() {
    return this.getFormControl('email') as RSLabelTextFormControl;
  }
  
  get lastNameFC() {
    return this.getFormControl('lastName') as RSLabelTextFormControl;
  }
  
  get firstNameFC() {
    return this.getFormControl('firstName') as RSLabelTextFormControl;
  }
  
  get middleNameFC() {
    return this.getFormControl('middleName') as RSLabelTextFormControl;
  }

  get passwordFC() {
    return this.getFormControl('password') as RSLabelPasswordFormControl;
  }
  get confirmPasswordFC() {
    return this.getFormControl('confirmPassword') as RSLabelPasswordFormControl;
  }

  getFormControl(name: string) {
    return this.form.get(name);
  }

  onValidateForm(): boolean {
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
    this.routerService.gotoLogin();
  }
}
