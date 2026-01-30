import { Directive, OnDestroy } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { SubscriptionBase } from '../../../core/entities/subscription-base';
import { BaseDto } from '../../models/dtos/base/base.dto';

@Directive()
export abstract class BaseComponent<TRequest extends BaseDto> extends SubscriptionBase implements OnDestroy {
  form!: FormGroup;
  response$: Subject<TRequest> = new Subject<TRequest>();

  abstract get request(): TRequest;
  abstract set request(value: TRequest);

  protected abstract submit(req: TRequest): void;

  onSubmit(): void {
    if(!this.form.valid) return;

    if(this.onValidateForm()) {
      const req = this.getFormRequest() as TRequest;
      this.submit(req);
    } else {
      this.showFormControlsValidationErrors();
    }
  }

  protected abstract onValidateForm(): boolean;
  protected abstract getFormRequest(): BaseDto;

  showFormControlsValidationErrors(): void {
    this._setFormControlsTouched(this.form.controls);
  }

  private _setFormControlsTouched(controls: Record<string, AbstractControl>): void {
    for (const key in controls) {
      if(Object.prototype.hasOwnProperty.call(controls, key)) {
        const control = controls[key];

        if(control instanceof FormControl)
          control.markAsTouched();

        if(control instanceof FormGroup)
          this._setFormControlsTouched(control.controls);

        if(control instanceof FormArray)
          control.controls.forEach(c => this._setFormControlsTouched({ [key]: c }));
      }
    }
  }

  ngOnDestroy(): void {
    this.destroySubs();
  }
}
