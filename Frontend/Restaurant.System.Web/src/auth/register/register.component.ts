import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { ReactiveFormsModule, FormsModule, Validators } from "@angular/forms";
import { RSLabelTextFormControlComponent, RSLabelPasswordFormControlComponent, RSLabelEmailFormControlComponent, CustomFormGroup, RSLabelTextFormControl } from "@rs/forms";
import { BaseAuthComponent } from "../../app/shared/components/base-auth-component/base-auth-component";
import { ApplicationDto } from "../../app/shared/models/dtos/application.dto";
import { provideNgxMask } from "ngx-mask";
import { provideTranslateService, TranslateService } from "@ngx-translate/core";

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
    RSLabelPasswordFormControlComponent,
    RSLabelEmailFormControlComponent
  ],
  providers: [
    provideNgxMask(),
    provideTranslateService()
  ]
})
export class RegisterComponent extends BaseAuthComponent<ApplicationDto> {
  private translateService = inject(TranslateService);
  _request!: ApplicationDto;
  get request(): ApplicationDto { return this._request; }
  set request(value: ApplicationDto) { this._request = value; }

  createForm(): CustomFormGroup {
    const fg = new CustomFormGroup();

    fg._addCustomControl('fullName', new RSLabelTextFormControl('Full Name', { required: true,}, '', [ Validators.required ]));
    fg._addCustomControl('email', new RSLabelTextFormControl('Email', { required: true,}, '', [ Validators.required, Validators.email ]));
    fg._addCustomControl('password', new RSLabelTextFormControl('Password', { required: true,}, '', [ Validators.required ]));
    fg._addCustomControl('confirmPassword', new RSLabelTextFormControl('Confirm Password', { required: true,}, '', [ Validators.required ]));
    return fg;
  }

  get fullNameFC() { return this.getFormControl('fullName') as RSLabelTextFormControl; }
  get emailFC() { return this.getFormControl('email') as RSLabelTextFormControl; }
  get passwordFC() { return this.getFormControl('password') as RSLabelTextFormControl; }
  get confirmPasswordFC() { return this.getFormControl('confirmPassword') as RSLabelTextFormControl; }

  getFormControl(name: string) {
    return this.form.get(name);
  }

  getFormRequest(): ApplicationDto {
    const req: ApplicationDto =
    {
      ...this.form.getRawValue()
    };
    return req;
  }

  onValidateForm(): boolean {
    if(this.form.valid) {
      return true;
    }

    this.showFormControlsValidationErrors();
    return false;
  }
}
