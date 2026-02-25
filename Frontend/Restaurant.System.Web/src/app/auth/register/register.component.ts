import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ReactiveFormsModule, FormsModule, Validators } from "@angular/forms";
import { provideNgxMask } from "ngx-mask";
import { BaseAuthComponent } from "src/app/shared/components/base-auth-component/base-auth-component";
import { CustomFormGroup, RSLabelEmailFormControlComponent, RSLabelPasswordFormControl, RSLabelPasswordFormControlComponent, RSLabelTextFormControl } from "@rs/forms";
import { ActivityState } from "src/app/shared/enums/activity-state";
import { UserDto } from "src/app/shared/models/dtos/user.dto";
import { v7 as uuidv7 } from "uuid";

@Component({
  selector: 'rs-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RSLabelEmailFormControlComponent,
    RSLabelPasswordFormControlComponent
  ],
  providers: [
    provideNgxMask()
  ]
})
export class RegisterComponent extends BaseAuthComponent<UserDto> implements OnInit {

  _request!: UserDto;

  get request(): UserDto { return this._request; }
  set request(value: UserDto) { this._request = value; }

  fg = new CustomFormGroup();

  override ngOnInit() {
    super.ngOnInit();

    this.confirmPasswordFC.valueChanges.subscribe(() => {
      this.OnCheckingPasswordMismatch();
    });
  }

  createForm(): CustomFormGroup {
    this.fg._addCustomControl('email', new RSLabelTextFormControl('Email', { required: true, inputType:'email', autoComplete: 'username' }, '', [ Validators.required, Validators.email ]));
    this.fg._addCustomControl('password', new RSLabelPasswordFormControl('Password', { required: true, inputType:'password', autoComplete: 'new-password' }, '', [ Validators.required ]));
    this.fg._addCustomControl('confirmPassword', new RSLabelPasswordFormControl('Confirm Password', { required: true, inputType:'password', autoComplete: 'new-password' }, '', [ Validators.required ]));

    return this.fg;
  }

  get emailFC() { return this.getFormControl('email') as RSLabelTextFormControl; }
  get passwordFC() { return this.getFormControl('password') as RSLabelPasswordFormControl; }
  get confirmPasswordFC() { return this.getFormControl('confirmPassword') as RSLabelPasswordFormControl; }

  getFormControl(name: string) {
    return this.form.get(name);
  }

  RequestDetails(): UserDto {
    const req: UserDto =
    {
      ...this.form.getRawValue(),
      identifier: this.emailFC.value,
      state: ActivityState.Register,
      customerId: uuidv7(),
    };

    return req;
  }

  onValidateForm(): boolean {

    if (!this.passwordFC.value || !this.confirmPasswordFC.value || this.passwordFC.value === '' || this.confirmPasswordFC.value === '') {
      return false;
    }

    if(this.form.valid) {
      return true;
    }
    else {
      this.showFormControlsValidationErrors();
      return false;
    }
  }

  OnCheckingPasswordMismatch(): void {
    if(!this.passwordFC || !this.confirmPasswordFC) {
      this.removeMismatchError();
      return;
    }

    if(this.passwordFC.value !== this.confirmPasswordFC.value) {
      this.confirmPasswordFC.setErrors({ passwordMismatch: true });
    }
    else {
      this.removeMismatchError();
    }
  }

  private removeMismatchError() {
    const errors = this.confirmPasswordFC.errors;
    if (!errors) return;

    if(errors['passwordMismatch']) delete errors['passwordMismatch'];

    this.confirmPasswordFC.setErrors(
      Object.keys(errors).length ? errors : null
    );
  }
}
