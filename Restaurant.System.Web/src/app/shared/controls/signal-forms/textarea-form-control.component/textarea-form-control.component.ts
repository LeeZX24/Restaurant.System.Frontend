import { isPlatformBrowser } from '@angular/common';
import { Component, computed, inject, input, model, PLATFORM_ID } from '@angular/core';
import { FormValueControl, MaxLengthValidationError, MaxValidationError, MinLengthValidationError, MinValidationError, ValidationError, WithOptionalFieldTree } from '@angular/forms/signals';
import { TranslateService } from '@ngx-translate/core';
import { TextFormControl } from '../signal-form-control';
import { ErrorConverterPipe } from '@LeeZX24/forms';

@Component({
  selector: 'rs-custom-textarea-form-control',
  imports: [ErrorConverterPipe],
  templateUrl: './textarea-form-control.component.html',
  styleUrl: './textarea-form-control.component.css',
})
export class TextareaFormControlComponent implements FormValueControl<string> {
  isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  translate = inject(TranslateService);

  value = model<string>('');
  touched = model(false);

  disabled = input(false);
  invalid = input(false);
  errors = input<readonly WithOptionalFieldTree<ValidationError>[]>([]);

  config = input.required<TextFormControl>();
  labelSize = input<string>('w-4/12');
  inputSize = input<string>('w-8/12');

  isRequired = computed(() => !!this.config().options.required);

  isErrorToShow = computed(() => {
    return !!(this.touched() && this.invalid() && !this.disabled());
  });

  placeholder = computed(() => {
    return this.config().options.placeholder ?? 'Please Enter Text...';
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

      if(err instanceof MinLengthValidationError) {
        return `${baseTranslationKey};${label};${err.minLength}`;
      }
      if(err instanceof MaxLengthValidationError) {
        return `${baseTranslationKey};${label};${err.maxLength}`;
      }
      if(err instanceof MinValidationError) {
        return `${baseTranslationKey};${label};${err.min}`;
      }
            if(err instanceof MaxValidationError) {
        return `${baseTranslationKey};${label};${err.max}`;
      }

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

  onInputChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const currentText = inputElement.value;

    this.value.set(currentText);

    if(this.config().options.capitalized) this.convertToUppercase(inputElement);
  }

  convertToUppercase(element: HTMLInputElement): void {
    const startPos = element.selectionStart;
    const endPos = element.selectionEnd;
    element.value = element.value.toUpperCase();
    element.setSelectionRange(startPos, endPos);
    this.value.set(element.value.toUpperCase());
  }

  onBlur() {
    this.touched.set(true);
  }
}
