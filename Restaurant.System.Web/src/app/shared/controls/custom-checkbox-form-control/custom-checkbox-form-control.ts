import { Validators } from '@angular/forms';
import { RSFormControlBaseOptions, RSFormControlBaseOption, RSFormControlBase, RSFormValidators } from '@LeeZX24/forms';

export class RSCheckboxFormControlOptions extends RSFormControlBaseOptions {
  static readonly title = 'title';
}

export interface RSCheckboxFormControlOption extends RSFormControlBaseOption {
  title?: string;
}

export class RSCheckboxFormControl extends RSFormControlBase {
  title!: string;

  constructor(
    options: RSCheckboxFormControlOption,
    value: unknown,
    validator: RSFormValidators = null,
  ) {
    super(options, value, validator);
    this.refresh();
  }

  override refresh(): void {
    this._setOptions();
    this._setValidators();
    this.getValidationMessages();
    this.updateValueAndValidity();
  }

  private _setOptions() {
    this.title = this.getOptionItem(RSCheckboxFormControlOptions.title)!;
  }

  private _setValidators() {
    this.validators.set(this.getCustomValidators());
    if (this.isRequired()) this.validators().push(Validators.required);

    this.clearValidators();
    this.setValidators(Validators.compose(this.validators()));

    this.updValsAndValidities();
  }
}
