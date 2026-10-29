import { Validators } from '@angular/forms';
import { RSFormControlBaseOptions, RSFormControlBaseOption, RSFormValidators, RSLabelFormControlBase } from '@LeeZX24/forms';

export class RSLabelCheckboxFormControlOptions extends RSFormControlBaseOptions {
  static readonly title = 'title';
}

export interface RSLabelCheckboxFormControlOption extends RSFormControlBaseOption {
  title?: string;
}

export class RSLabelCheckboxFormControl extends RSLabelFormControlBase {
  title!: string;

  constructor(
    label: string,
    options: RSLabelCheckboxFormControlOption,
    value: unknown,
    validator: RSFormValidators = null,
  ) {
    super(label, options, value, validator);
    this.refresh();
  }

  override refresh(): void {
    this._setOptions();
    this._setValidators();
    this.getValidationMessages();
    this.updateValueAndValidity();
  }

  private _setOptions() {
    this.title = this.getOptionItem(RSLabelCheckboxFormControlOptions.title)!;
  }

  private _setValidators() {
    this.validators.set(this.getCustomValidators());
    if (this.isRequired()) this.validators().push(Validators.required);

    this.clearValidators();
    this.setValidators(Validators.compose(this.validators()));

    this.updValsAndValidities();
  }
}
