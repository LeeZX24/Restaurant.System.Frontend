import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { ReactiveFormsModule, FormsModule, Validators } from "@angular/forms";
import { provideTranslateService, TranslateService } from "@ngx-translate/core";
import { provideNgxMask } from "ngx-mask";
import { RSLabelPasswordFormControlComponent, RSLabelEmailFormControlComponent, CustomFormGroup, RSLabelTextFormControl } from "@rs/forms";
import { BaseAuthComponent } from "../../app/shared/components/base-auth-component/base-auth-component";
import { UserDto } from "../../app/shared/models/dtos/user.dto";
import { ActivityState } from "../../app/shared/enums/activity-state";
import { v4 as uuidv4 } from 'uuid';

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
    provideNgxMask(),
    provideTranslateService()
  ]
})
export class RegisterComponent extends BaseAuthComponent<UserDto> {
  private translateService = inject(TranslateService);
  _request!: UserDto;

  get request(): UserDto { return this._request; }
  set request(value: UserDto) { this._request = value; }

  createForm(): CustomFormGroup {
    const fg = new CustomFormGroup();

    fg._addCustomControl('email', new RSLabelTextFormControl('Email', { required: true,}, '', [ Validators.required, Validators.email ]));
    fg._addCustomControl('password', new RSLabelTextFormControl('Password', { required: true,}, '', [ Validators.required ]));
    fg._addCustomControl('confirmPassword', new RSLabelTextFormControl('Confirm Password', { required: true,}, '', [ Validators.required ]));
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

    if(this.passwordFC.value !== this.confirmPasswordFC.value) {
      console.log('password mismatch');
      return false;
    }

    this.showFormControlsValidationErrors();

    if(this.form.valid) {
      return true;
    }

    return false;
  }
}
