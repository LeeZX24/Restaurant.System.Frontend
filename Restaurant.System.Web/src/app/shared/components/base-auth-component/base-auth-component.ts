import { Directive, OnInit, OnDestroy, inject } from '@angular/core';
import { CustomFormGroup } from '@LeeZX24/forms';
import { AuthService } from '../../../core/services/auth/auth.service';
import { RouterService } from '../../services/router.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DialogService, DialogVariant, UpdatableDialogRef } from '@LeeZX24/dialogs';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { SubscriptionBase } from '../../../core/entities/subscription-base';
import { BaseResponseDto } from '../../models/dtos/base/response.dto';

@Directive()
export abstract class BaseAuthComponent extends SubscriptionBase implements OnInit, OnDestroy
{
  form!: FormGroup;

  protected routerService = inject(RouterService);
  protected authService = inject(AuthService);
  protected dialogService = inject(DialogService);

  protected abstract createForm(): CustomFormGroup;

  ngOnInit(): void {
    this.form = this.createForm();
  }

  getFormControl(name: string) {
    return this.form.get(name);
  }

  protected abstract onValidateForm(): boolean;

  handleSuccess(ref: UpdatableDialogRef, response: BaseResponseDto, successMessage?: string, successTitle?: string) {
    const message = response.message ?  response.message : successMessage ? successMessage : 'Success.';
    const title = successTitle ? successTitle : 'Success - Login';

    const config = this.dialogService.getDialogConfig(DialogVariant.Success, { success: true, footerEnable: false });

    this.dialogService.updateDialog(ref, { ...config, title: title, message: message });
  }

  handleError(ref: UpdatableDialogRef, err: unknown, errorTitle?: string) {
    let errorMessage = '';

    if (err instanceof HttpErrorResponse) {
      errorMessage = err.error.message;
    }

    const config = this.dialogService.getDialogConfig(DialogVariant.Error);

    this.dialogService.updateDialog(ref, { ...config, message: errorMessage, title: errorTitle ? errorTitle : 'Error - Login' });
  }

  showFormControlsValidationErrors(): void {
    this._setFormControlsTouched(this.form.controls);
  }

  private _setFormControlsTouched(controls: Record<string, AbstractControl>): void {
    for (const key in controls) {
      if (Object.prototype.hasOwnProperty.call(controls, key)) {
        const control = controls[key];

        if (control instanceof FormControl) control.markAsTouched();

        if (control instanceof FormGroup) this._setFormControlsTouched(control.controls);

        if (control instanceof FormArray)
          control.controls.forEach((c) => this._setFormControlsTouched({ [key]: c }));
      }
    }
  }

  public wait(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  ngOnDestroy(): void {
    this.destroySubs();
  }
}
