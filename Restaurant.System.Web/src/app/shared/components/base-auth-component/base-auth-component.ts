import { Directive, OnInit, OnDestroy, inject } from '@angular/core';
import { CustomFormGroup } from '@LeeZX24/forms';
import { AuthService } from '../../../core/services/auth/auth.service';
import { RouterService } from '../../services/router.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DialogService } from '@LeeZX24/dialogs';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { SubscriptionBase } from '../../../core/entities/subscription-base';
import { BaseResponseDto } from '../../models/dtos/base/response.dto';

@Directive()
export abstract class BaseAuthComponent extends SubscriptionBase implements OnInit, OnDestroy
{
  form!: FormGroup;
  
  protected routerService = inject(RouterService);
  protected authService = inject(AuthService);
  private dialogService = inject(DialogService);

  protected abstract createForm(): CustomFormGroup;

  ngOnInit(): void {
    this.form = this.createForm();
  }

  handleSuccess(response: BaseResponseDto, successMessage?: string, successTitle?: string) {
    const ref = this.dialogService.showSuccessDialog(
      response.message ?  response.message : successMessage ? successMessage : 'Success.',
      successTitle ? successTitle : 'Success',
      false,
      false,
      { success: true },
    );

    ref.afterOpened().subscribe(() => {
      setTimeout(() => {
        this.routerService.gotoLogin();
        ref.close();
      }, 1000);
    });
    
  }

  handleError(err: unknown, errorTitle?: string) {
    let errorMessage = '';

    if (err instanceof HttpErrorResponse) {
      errorMessage = err.error.message;
    }

    this.dialogService.showErrorDialog(errorMessage, errorTitle ? errorTitle : 'Error', false, true);
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

  ngOnDestroy(): void {
    this.destroySubs();
  }
}
