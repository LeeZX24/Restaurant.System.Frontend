import { Directive, inject, OnDestroy } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { SubscriptionBase } from '../../../core/entities/subscription-base';
import { BaseDto } from '../../models/dtos/base/base.dto';
import { ActivityService } from '../../../core/services/activity.service';

@Directive()
export abstract class BaseComponent<TRequest extends BaseDto> extends SubscriptionBase implements OnDestroy {
  form!: FormGroup;
  private _response!: TRequest;
  get response(): TRequest { return this._response; }
  set response(value: TRequest) { this.response = value }

  // set item at here
  public abstract get request(): TRequest;
  public abstract set request(value: TRequest);

  public abstract onValidateForm(): boolean;
  public abstract RequestDetails(): TRequest;

  activityService = inject(ActivityService);

  onSubmit(): void {
    if(!this.form.valid) return;

    if(this.onValidateForm()) {
      const req = this.RequestDetails() as TRequest;
      this.activityService.submit(req, req.state);
    } else {
      this.showFormControlsValidationErrors();
    }
  }

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
