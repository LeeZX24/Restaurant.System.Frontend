import { RSLabelFormControlBase, RSLabelFormControlBaseOption, RSLabelFormControlBaseOptions, RSFormValidators } from '@LeeZX24/forms';
import { Toggle } from '../../models/toggle.model';

export class RSLabelToggleFormControlOptions extends RSLabelFormControlBaseOptions {
    static readonly toggle = 'toggle';
}

export interface RSLabelToggleFormControlOption extends RSLabelFormControlBaseOption {
    toggle?: Toggle;
}

export class RSLabelToggleFormControl extends RSLabelFormControlBase {
    toggle!: Toggle;

    constructor(
    label: string,
    options: RSLabelToggleFormControlOption,
    value: unknown,
    validator: RSFormValidators = null,
  ) {
    super(label, options, value, validator);
    this._setOptions();
  }

  override refresh(): void {
    this._setOptions();
  }

  private _setOptions() {
    this.toggle = this.getOptionItem(RSLabelToggleFormControlOptions.toggle)!;
  }
}

