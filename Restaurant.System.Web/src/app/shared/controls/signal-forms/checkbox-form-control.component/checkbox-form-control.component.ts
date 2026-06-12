import { isPlatformBrowser } from '@angular/common';
import { Component, computed, inject, input, model, PLATFORM_ID } from '@angular/core';
import { FormCheckboxControl, ValidationError, WithOptionalFieldTree } from '@angular/forms/signals';
import { TranslateService } from '@ngx-translate/core';
import { CheckboxFormControl } from '../signal-form-control';
import { ErrorConverterPipe } from '@rs/forms';

@Component({
  selector: 'rs-custom-checkbox-form-control',
  imports: [ErrorConverterPipe],
  templateUrl: './checkbox-form-control.component.html',
  styleUrl: './checkbox-form-control.component.css',
})
export class CheckboxFormControlComponent implements FormCheckboxControl {

  isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  translate = inject(TranslateService);

  checked = model(false);
  touched = model(false);

  disabled = input(false);
  invalid = model(false);
  errors = input<readonly WithOptionalFieldTree<ValidationError>[]>([]);

  config = input.required<CheckboxFormControl>();
  labelSize = input<string>('w-4/12');
  inputSize = input<string>('w-8/12');

  isRequired = computed(() => !!this.config().options.required);

  isErrorToShow = computed(() => {
    return !!(this.touched() && this.invalid() && !this.disabled());
  });

  validationMessage = computed<string[]>(() => {
    const activeErrors = this.errors();

    if(activeErrors.length === 0) return [];

    const customValidations = (this.config().options?.customValidationErrors || {}) as Record<string, string | undefined>;
    const label = this.config().label || '';

    return activeErrors.map((err) => {
      const errorKey = err.kind;

      if(customValidations[errorKey]) return customValidations[errorKey] as string;

      const baseTranslationKey = `project.controls.errors.${errorKey.toLowerCase()}`;

      // if(err instanceof MinLengthValidationError) {
      //   return `${baseTranslationKey};${label};${err.minLength}`;
      // }
      // if(err instanceof MaxLengthValidationError) {
      //   return `${baseTranslationKey};${label};${err.maxLength}`;
      // }
      // if(err instanceof MinValidationError) {
      //   return `${baseTranslationKey};${label};${err.min}`;
      // }
      //       if(err instanceof MaxValidationError) {
      //   return `${baseTranslationKey};${label};${err.max}`;
      // }

      return `${baseTranslationKey};${label}`;
    });
  });

  // isDisabledRequiredError = computed(() => {
  //   if (!this.disabled()) return false;

  //   const ctrlProps: boolean =
  //     this.touched() && this.isRequired() && this.disabled() && this.value() == null;
  //   const formEnabled = !this.disabled();
  //   return ctrlProps && formEnabled;
  // });

  // getDisableRequireMsg = computed(() => {
  //   if(!this.errors()) return '';

  //   const label = this.config().label;
  //   const err = `project.controls.errors.required;${label}`;
  //   return err;
  // });


  constructor() {
    this.translate.setFallbackLang('en');
    this.translate.use('en');
  }

  onItemChecked() {
    this.checked.update(c => !c);
    if(!this.checked && this.isRequired()) this.invalid.set(true);
  }

  onBlur() {
    this.touched.set(true);
  }
}
