import { AbstractControl, Validators } from '@angular/forms';
import { RSLabelFormControlBase, RSLabelFormControlBaseOption, RSLabelFormControlBaseOptions } from '@LeeZX24/forms';
import { DecimalMarkerChar } from 'ngx-mask';

export class RSLabelAmountFormControlOptions extends RSLabelFormControlBaseOptions {
    static readonly min = 'min';
    static readonly max = 'max';
    static readonly minLength = 'minLength';
    static readonly maxLength = 'maxLength';
    static readonly allowNegative = 'allowNegative';
    static readonly allowZeroValue = 'allowZeroValue';
    static readonly align = 'align';
    static readonly decimal = 'decimal';
    static readonly thousands = 'thousands';
    static readonly prefix = 'prefix';
    static readonly suffix = 'suffix';
    static readonly placeholder = 'placeholder';
    static readonly readonly = 'readonly';

}

export interface RSLabelAmountFormControlOption extends RSLabelFormControlBaseOption {
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    allowNegative?: boolean;
    allowZeroValue?: boolean;
    align?: string;
    decimal?: string;
    thousands?: string;
    prefix?: string;
    suffix?: string;
    placeholder?: string;
    readonly?: boolean;
}

export class RSLabelAmountValidators {
  static NoZero() {
    return (control: AbstractControl): Record<string, boolean> | null => {
      return !!control &&  control.value === '0' ? { nozero: true } : null;
    };
  }
}

export class RSLabelAmountFormControl extends RSLabelFormControlBase {
    min!: number;
    max!: number;
    minLength!: number;
    maxLength!: number;
    allowNegative!: boolean;
    allowZeroValue!: boolean;
    align!: string;
    decimal!: DecimalMarkerChar;
    thousands!: string;
    prefix!: string;
    suffix!: string;
    placeholder!: string;
    readonly!: boolean;

  constructor(
    label: string,
    options: RSLabelAmountFormControlOption,
    value: unknown
  ) {
    super(label, options, value, null);
    this.refresh();
  }

  override refresh(): void {
    this._setOptions();
    this._setValidators();
    this.getValidationMessages();
    this.updateValueAndValidity();
  }

  private _setOptions() {
    this.min = this.getOptionItem(RSLabelAmountFormControlOptions.min)!;
    this.max = this.getOptionItem(RSLabelAmountFormControlOptions.max)!;
    this.minLength = this.getOptionItem(RSLabelAmountFormControlOptions.minLength)!;
    this.maxLength = this.getOptionItem(RSLabelAmountFormControlOptions.maxLength)!;
    this.allowNegative = this.getOptionItem(RSLabelAmountFormControlOptions.allowNegative)!;
    this.allowZeroValue = this.getOptionItem(RSLabelAmountFormControlOptions.allowZeroValue)!;
    this.align = this.getOptionItem(RSLabelAmountFormControlOptions.align)!;
    this.decimal = this.getOptionItem(RSLabelAmountFormControlOptions.decimal)!;
    this.thousands = this.getOptionItem(RSLabelAmountFormControlOptions.thousands)!;
    this.prefix = this.getOptionItem(RSLabelAmountFormControlOptions.prefix)!;
    this.suffix = this.getOptionItem(RSLabelAmountFormControlOptions.suffix)!;
    this.placeholder = this.getOptionItem(RSLabelAmountFormControlOptions.placeholder) || '';
    this.readonly = this.getOptionItem(RSLabelAmountFormControlOptions.readonly)!;
  }

  private _setValidators() {
    this.validators.set(this.getCustomValidators());
    if (this.isRequired()) this.validators().push(Validators.required);
    if (!this.allowZeroValue) this.validators().push(RSLabelAmountValidators.NoZero());
    if (this.maxLength) this.validators().push(Validators.maxLength(this.maxLength));
    if (this.minLength) this.validators().push(Validators.minLength(this.minLength));

    this.clearValidators();
    this.setValidators(Validators.compose(this.validators()));

    this.updValsAndValidities();
  }
}


