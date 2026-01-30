import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserDto } from '../../app/shared/models/dtos/user.dto';
import { provideNgxMask } from 'ngx-mask';
import { CommonModule } from '@angular/common';
import { CustomFormGroup, RSEmailFormControlComponent, RSPasswordFormControlComponent, RSTextFormControl } from '@rs/forms';
import { BaseAuthComponent } from '../../app/shared/components/base-auth-component/base-auth-component';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';

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
    RSPasswordFormControlComponent
  ],
  providers: [
    provideNgxMask(),
    provideTranslateService()
  ]
})
export class LoginComponent extends BaseAuthComponent<UserDto> {
  private translateService = inject(TranslateService);

  _request!: UserDto;
  get request(): UserDto { return this._request; }
  set request(value: UserDto) { this._request = value; }

  createForm(): CustomFormGroup {
    const fg = new CustomFormGroup();

    fg._addCustomControl('email', new RSTextFormControl({ required: true,}, '', [ Validators.required, Validators.email ]));
    fg._addCustomControl('password', new RSTextFormControl({ required: true,}, '', [ Validators.required ]));
    return fg;
  }

  get emailFC() { return this.getFormControl('email') as RSTextFormControl; }
  get passwordFC() { return this.getFormControl('password') as RSTextFormControl; }

  getFormControl(name: string) {
    return this.form.get(name);
  }

  getFormRequest(): UserDto {
    const req: UserDto =
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
