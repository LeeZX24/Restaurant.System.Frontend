import { FormCheckboxControl, FormValueControl } from '@angular/forms/signals';
// import { FormControl, FormGroup, ValidatorFn } from '@angular/forms';
// import { RSFormValidators } from '../../../models';
// import { computed, signal } from '@angular/core';

export type SignalFC<TValue> = FormValueControl<TValue> | FormCheckboxControl;

export type FormControlType =
  | 'text'
  | 'number'
  | 'dropdown'
  | 'checkbox'
  | 'textarea'
  | 'date';

export interface FormControlBase {
  key: string;
  label: string;
  type: FormControlType;
  options: FormControlBaseOption;
}

export interface FormControlBaseOption {
  required?: boolean;
  customValidationErrors?: Record<string, string>;
  elementCssClass?: string;
}

// export function buildModel(controls: FormControlBase[]) {
//   const model: Record<string, unknown> = {};

//   for (const c of controls) {
//     model[c.key] = getDefaultValue(c.type);
//   }

//   return signal(model);
// }

// function getDefaultValue(type: FormControlType) {
//   switch (type) {
//     case 'checkbox': return false;
//     case 'number': return 0;
//     default: return '';
//   }
// }

// export function isValueControl<T>(control: SignalFC<T>): control is FormValueControl<T> {
//   return control && 'value' in control;
// }

// // Type guard to check if it's a FormCheckboxControl
// export function isCheckboxControl<T>(control: SignalFC<T>): control is FormCheckboxControl {
//   return control && 'checked' in control;
// }

// // export class RSLabelFormControlBaseOptions {
// //   static readonly customValidationErrors = 'customValidationErrors';
// //   static readonly required = 'required';
// //   static readonly elementCssClass = 'elementCssClass';
// // }

// // export interface RSLabelFormControlBaseOption {
// //   customValidationErrors?: Record<string, string>;
// //   required?: boolean;
// //   elementCssClass?: string;
// // }

// // export abstract class RSLabelFormControlBase extends FormControl {
// //   inputId = signal<string>('');
// //   label = signal<string>('');
// //   options = signal<RSLabelFormControlBaseOption>({});

// //   protected validators = signal<ValidatorFn[]>([]);
// //   protected customValidators = signal<ValidatorFn[]>([]);

// //   abstract refresh(): void;

// //   constructor(
// //     label: string,
// //     options: RSLabelFormControlBaseOption,
// //     value: unknown,
// //     validators: RSFormValidators,
// //   ) {
// //     super(value, validators);

// //     this.label.set(label);
// //     this.options.set(options);
// //   }

// //   writeValue<T>(value: T): void {
// //     this.setValue(value);
// //   }

// //   setDisabledState(disabled: boolean) {
// //     if (disabled) this.disable();
// //     else this.enable();
// //   }

// //   isErrorToShow = computed(() => this.touched && this.invalid && !this.disabled);

// //   getValidationMessages(): string[] {
// //     const messages: string[] = [];
// //     if (this.errors) {
// //       for (const errorKey in this.errors) {
// //         switch (errorKey) {
// //           case 'required':
// //             this._addValidationMessage(
// //               'required',
// //               `project.controls.errors.required;${this.label}`,
// //               messages,
// //             );
// //             break;
// //           case 'minlength':
// //             this._addValidationMessage(
// //               'minlength',
// //               `project.controls.errors.minlength;${this.label};${this.errors['minlength'].requiredLength}`,
// //               messages,
// //             );
// //             break;
// //           case 'maxlength':
// //             this._addValidationMessage(
// //               'maxlength',
// //               `project.controls.errors.maxlength;${this.label};${this.errors['maxlength'].requiredLength}`,
// //               messages,
// //             );
// //             break;
// //           case 'min':
// //             this._addValidationMessage(
// //               'min',
// //               `project.controls.errors.min;${this.label};${this.errors['min'].requiredLength}`,
// //               messages,
// //             );
// //             break;
// //           case 'max':
// //             this._addValidationMessage(
// //               'max',
// //               `project.controls.errors.max;${this.label};${this.errors['max'].requiredLength}`,
// //               messages,
// //             );
// //             break;
// //           case 'pattern':
// //             this._addValidationMessage(
// //               'pattern',
// //               `project.controls.errors.pattern;${this.label}`,
// //               messages,
// //             );
// //             break;
// //           case 'nozero':
// //             this._addValidationMessage(
// //               'nozero',
// //               `project.controls.errors.nozero;${this.label}`,
// //               messages,
// //             );
// //             break;
// //           case 'email':
// //             this._addValidationMessage(
// //               'email',
// //               `project.controls.errors.email;${this.label}`,
// //               messages,
// //             );
// //             break;
// //           case 'passwordMismatch':
// //             this._addValidationMessage(
// //               'passwordMismatch',
// //               `project.controls.errors.passwordMismatch;${this.label}`,
// //               messages,
// //             );
// //             break;
// //           default:
// //             this._addValidationMessage(
// //               errorKey,
// //               `project.controls.errors.custom;${errorKey}`,
// //               messages,
// //             );
// //         }
// //       }
// //     }

// //     return messages;
// //   }

// //   // Optional: disabled-required error
// //   isDisabledRequiredError = computed(() => {
// //     if (!this.parent) return false;

// //     const ctrlProps: boolean =
// //       this.touched && this.isRequired() && this.disabled && this.value == null;
// //     const formEnabled = !this.parent.disabled;
// //     return ctrlProps && formEnabled;
// //   });

// //   getDisableRequireMsg(): string {
// //     const err = `project.controls.errors.required;${this.label}`;
// //     return err;
// //   }

// //   private _addValidationMessage(key: string, autoValidationMessage: string, messages: string[]) {
// //     const msg = this._getCustomValidationMessage(key);
// //     if (msg) messages.push(msg);
// //     else messages.push(autoValidationMessage);
// //   }

// //   private _getCustomValidationMessage(validationName: string) {
// //     const customValidationErrors = this.getOptionItem<Record<string, string>>(
// //       RSLabelFormControlBaseOptions.customValidationErrors,
// //     );
// //     return customValidationErrors?.[validationName] ?? null;
// //   }

// //   getOptionItem<T = undefined>(key: string): T | null {
// //     const optList = this.options() as Record<string, unknown>;
// //     if (optList[key] !== null && optList[key] !== undefined) return optList[key] as T;

// //     return null;
// //   }

// //   isRequired = computed(() => !!this.getOptionItem(RSLabelFormControlBaseOptions.required));

// //   elementCssClass = computed(() => {
// //     let cssClasses = this.getOptionItem(RSLabelFormControlBaseOptions.elementCssClass) as string;

// //     if (!cssClasses) cssClasses = '';
// //     if (this.isRequired()) cssClasses += ' required';
// //     if (this.isErrorToShow()) cssClasses += ' border border-red-500';

// //     return cssClasses;
// //   });

// //   setOptionItem(key: string, value: unknown, appendValue = false) {
// //     let optList = this.options() as Record<string, unknown>;
// //     if (!optList) optList = {};

// //     if (!appendValue) optList[key] = value;
// //     else {
// //       const currentValue = optList[key];
// //       if (currentValue) optList[key] = currentValue + ' ' + value;
// //       else optList[key] = value;
// //     }

// //     this.refresh();
// //   }

// //   public setCustomValidators(validators: ValidatorFn[]): void {
// //     this.customValidators.set([...validators]);
// //     this.refresh();
// //   }

// //   getCustomValidators = computed(() => this.customValidators() );

// //   // protected getDataItems<T>(titleField: T, valueField: T, errorMessage: T, dataField: T, compositeTitle: (x: T) => string) {
// //   //   if ((!titleField && !compositeTitle) || !valueField)
// //   //       throw (errorMessage);

// //   //   const data: T[] = this.getOptionItem(dataField);

// //   //   if (!data)
// //   //     return null;

// //   //   return data.map(x => ({
// //   //     value: x[valueField],
// //   //     title: compositeTitle ? compositeTitle(x) : x[titleField]
// //   //   }));
// //   // }

// //   formatMinValue<T>(value: T) {
// //     return value;
// //   }

// //   formatMaxValue<T>(value: T) {
// //     return value;
// //   }

// //   protected updValsAndValidities(): void {
// //     this.updateValueAndValidity();
// //     const formGroup = this.parent as FormGroup;
// //     if (formGroup) {
// //       formGroup.updateValueAndValidity();
// //     }
// //   }
// // }
