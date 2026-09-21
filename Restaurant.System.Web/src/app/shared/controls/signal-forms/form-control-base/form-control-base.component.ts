// import { CommonModule, isPlatformBrowser } from '@angular/common';
// import { Component, computed, inject, input, model, PLATFORM_ID, signal } from '@angular/core';
// import { ReactiveFormsModule, FormsModule } from '@angular/forms';
// import { TranslateService } from '@ngx-translate/core';
// import { FormControlBase, isCheckboxControl, isValueControl, SignalFC } from './form-control-base';
// import { form, required, FormValueControl, FormCheckboxControl, FormUiControl, Field } from '@angular/forms/signals';
// import { ErrorConverterPipe } from '@LeeZX24/forms';

// @Component({
//   selector: 'rs-form-control-base',
//   imports: [CommonModule, ReactiveFormsModule, FormsModule, ErrorConverterPipe],
//   templateUrl: './form-control-base.component.html',
//   styleUrl: './form-control-base.component.css',
// })
// export class FormControlBaseComponent<T extends FormUiControl<unknown>> implements FormValueControl<T>, FormCheckboxControl {
//   labelSize = input<string>('');
//   inputSize = input<string>('');
//   config = input.required<FormControlBase>();

//   isRequired = computed(() => !!this.config().options.required);

//   isErrorToShow = computed(() => {
//     const control = this.fc();
//     return !!(control.touched && control.invalid && !control.disabled);
//   });

//   validationMessage = computed<string[]>(() => {
//     const ctrl = this.fc();
//     if(!ctrl || !ctrl.errors) return [];

//     const errorsMap = ctrl?.errors();
//     return Object.entries(errorsMap).map(([errorKey, errorDetails]) => {
//       const validations = this.config().options.customValidationErrors as Record<string, string | undefined>;
//       if(validations[errorKey]) return validations[errorKey] as string;

//       const label = this.config().label;
//       const baseTranslationKey = `this.project.controls.errors.${errorKey}`;

//       if(typeof errorDetails === 'object' && errorDetails !== null) {
//         const details = errorDetails as unknown as Record<string, unknown>;
//         const limit = details['requiredLength'] ?? details['min'] ?? details['max'] ?? '';
//         if(limit !== '') return `${baseTranslationKey};${label}${limit}`;
//       }

//       return `${baseTranslationKey};${label}`;
//     });
//   });

//   isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
//   translate = inject(TranslateService);

//   constructor() {
//     this.translate.setFallbackLang('en');
//     this.translate.use('en');
//   }
// }
