import { computed, signal } from '@angular/core';
import { AbstractControl, Validators } from '@angular/forms';
import { RSLabelFormControlBase, RSLabelFormControlBaseOption, RSLabelFormControlBaseOptions, RSFormValidators } from '@LeeZX24/forms';
import { DropDownItem } from '../custom-label-dropdown-form-control/dropdown';
import { DropdownModel } from '../../models/dropdown.model';

export class RSLabelDropdownFormControlOptions extends RSLabelFormControlBaseOptions {
  static readonly dropdownData = 'dropdownData';
  static readonly dropdownTitleField = 'dropdownTitleField';
  static readonly dropdownValueField = 'dropdownValueField';
  static readonly dropdownEmptyItem = 'dropdownEmptyItem';
  static readonly dropdownCompositeTitle = 'dropdownCompositeTitle';
}

export interface RSLabelDropdownFormControlOption extends RSLabelFormControlBaseOption {
  dropdownData?: unknown[];
  dropdownTitleField?: string;
  dropdownValueField?: string;
  dropdownEmptyItem?: DropDownItem;
  dropdownCompositeTitle?: (x: unknown) => string;
}

export class RSLabelDropDownValidators {
  static Required() {
    return (control: AbstractControl): Record<string, boolean> | null => {
      return (!!control && control.value  === '-1' ? { required: true } : null);
    }
  }
}

export class RSLabelDropdownFormControl extends RSLabelFormControlBase {
  private readonly _dropdownData = signal<DropDownItem[]>([]);
  readonly dropdownData = this._dropdownData.asReadonly();

  constructor(
    label: string,
    options: RSLabelDropdownFormControlOption,
    value: unknown,
    validator: RSFormValidators = null,
  ) {
    super(label, options, value, validator);
    this._initialize();
  }

  selectedTitle = computed(() => {
    const selectedItem = this.dropdownData().find((item) => item.value === this.value);

    return selectedItem ? selectedItem.title : '';
  });

  selectedData = computed(() => {
    const dropdownOriData = this.getOptionItem<DropdownModel[]>(RSLabelDropdownFormControlOptions.dropdownData);
    const dropdownValueField = this.getOptionItem<string>(RSLabelDropdownFormControlOptions.dropdownValueField);

    if(!dropdownOriData || !dropdownValueField) return undefined;

    return dropdownOriData.find((item) => item[dropdownValueField] === this.value);
  });

  refresh() {
    this._initialize();
  }

  override reset(formState: unknown = null, options?: { onlySelf?: boolean; emitEvent?: boolean; }) {
    super.reset(formState, options);
    this._resetDropDownValue(options);
  }

  private _initialize() {
    this._validateOptions();
    this._setItems();

    this._applyEmptyValue();
    this._setValidators();
  }

  private _setItems() {
    this._dropdownData.set(
      this._buildItems(),
    )
  }

  private _buildItems() {
    const dropdownTitleField = this.getOptionItem<string>(RSLabelDropdownFormControlOptions.dropdownTitleField);
    const dropdownValueField = this.getOptionItem<string>(RSLabelDropdownFormControlOptions.dropdownValueField);
    const dropdownCompositeTitle = this.getOptionItem<(item: unknown) => string>(RSLabelDropdownFormControlOptions.dropdownCompositeTitle);

    const dropdownData = this.getOptionItem<DropdownModel[]>(RSLabelDropdownFormControlOptions.dropdownData) ?? [];

    const items = dropdownData.map(item => ({
      value: item[dropdownValueField!],
      title: dropdownCompositeTitle
      ? dropdownCompositeTitle(item)
      : String(item[dropdownTitleField!])
    }) as DropDownItem);

    const finalItems = items ? items : [];

    const emptyItem = this.getOptionItem<DropDownItem>(RSLabelDropdownFormControlOptions.dropdownEmptyItem);
    if(emptyItem) finalItems.splice(0, 0, emptyItem);

    if(this.isRequired()) { finalItems.splice(0, 0, { value: '-1', title: 'select value...' }); }

    return finalItems;
  }

  private _validateOptions() {
    const titleField = this.getOptionItem<string>(RSLabelDropdownFormControlOptions.dropdownTitleField);
    const valueField = this.getOptionItem<string>(RSLabelDropdownFormControlOptions.dropdownValueField);
    const compositeTitle = this.getOptionItem<(item: unknown) => string>(RSLabelDropdownFormControlOptions.dropdownCompositeTitle);

    if ((!titleField && !compositeTitle) || !valueField) {
      throw new Error('To use Dropdown, you should specify both "dropdownTitleField or dropdownCompositeTitle" and "dropdownValueField"');
    }
  }

  private _resetDropDownValue(options?: { onlySelf?: boolean; emitEvent?: boolean; }) {
    if (this.isRequired()) {
      this.setValue('-1', options);
    } else {
      const emptyItem = this.getOptionItem<DropDownItem>(RSLabelDropdownFormControlOptions.dropdownEmptyItem);
      if (emptyItem)
        this.setValue(emptyItem['value'], options);
    }
  }

  private _setValidators(): void {
    this.validators.set(this.getCustomValidators());

    if (this.isRequired()) {
      this.validators().push(RSLabelDropDownValidators.Required());
    }

    this.clearValidators();
    this.setValidators(Validators.compose(this.validators()));

    this.updValsAndValidities();
  }

  private _applyEmptyValue(): void {
    const emptyItem = this.getOptionItem<DropDownItem>(RSLabelDropdownFormControlOptions.dropdownEmptyItem);
    if (!!emptyItem && this.isRequired()) throw new Error('You cannot set an empty value for a required dropdown');

    if(!this.value) {
      if (this.isRequired()) this.setValue('-1');
      else if (emptyItem) this.setValue(emptyItem['value']);
    }

    this.updateValueAndValidity();
  }
}

