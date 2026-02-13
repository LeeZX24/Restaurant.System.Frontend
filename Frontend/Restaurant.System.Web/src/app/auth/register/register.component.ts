import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ReactiveFormsModule, FormsModule, Validators } from "@angular/forms";
import { provideNgxMask } from "ngx-mask";
import { RSLabelPasswordFormControlComponent, RSLabelEmailFormControlComponent, CustomFormGroup, RSLabelTextFormControl } from "@rs/forms";
import { v4 as uuidv4 } from 'uuid';
import { BaseAuthComponent } from "src/app/shared/components/base-auth-component/base-auth-component";
import { ActivityState } from "src/app/shared/enums/activity-state";
import { UserDto } from "src/app/shared/models/dtos/user.dto";

@Component({
  selector: 'rs-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RSLabelPasswordFormControlComponent,
    RSLabelEmailFormControlComponent
  ],
  providers: [
    provideNgxMask()
  ]
})
export class RegisterComponent extends BaseAuthComponent<UserDto> implements OnInit {

  _request!: UserDto;

  get request(): UserDto { return this._request; }
  set request(value: UserDto) { this._request = value; }

  override ngOnInit() {
    super.ngOnInit();

    this.passwordFC.valueChanges.subscribe(() => {
      this.OnCheckingPasswordMismatch();
    });

    this.confirmPasswordFC.valueChanges.subscribe(() => {
      this.OnCheckingPasswordMismatch();
    });
  }

  createForm(): CustomFormGroup {
    const fg = new CustomFormGroup();

    fg._addCustomControl('email', new RSLabelTextFormControl('Email', { required: true, inputType:'email', autoComplete: 'username' }, '', [ Validators.required, Validators.email ]));
    fg._addCustomControl('password', new RSLabelTextFormControl('Password', { required: true, inputType:'password', autoComplete: 'new-password' }, '', [ Validators.required ]));
    fg._addCustomControl('confirmPassword', new RSLabelTextFormControl('Confirm Password', { required: true, inputType:'password', autoComplete: 'new-password' }, '', [ Validators.required ]));
    return fg;
  }

  get emailFC() { return this.getFormControl('email') as RSLabelTextFormControl; }
  get passwordFC() { return this.getFormControl('password') as RSLabelTextFormControl; }
  get confirmPasswordFC() { return this.getFormControl('confirmPassword') as RSLabelTextFormControl; }

  getFormControl(name: string) {
    return this.form.get(name);
  }

  RequestDetails(): UserDto {
    const req: UserDto =
    {
      ...this.form.getRawValue(),
      identifier: this.emailFC.value,
      state: ActivityState.Register,
      customerId: uuidv4()
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

  OnCheckingPasswordMismatch() {
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

    const { passwordMismatch, ...others } = errors;

    this.confirmPasswordFC.setErrors(
      Object.keys(others).length ? others : null
    );
  }
}
