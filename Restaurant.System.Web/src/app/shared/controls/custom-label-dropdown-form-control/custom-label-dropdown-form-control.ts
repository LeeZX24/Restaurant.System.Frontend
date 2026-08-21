import { computed, signal } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { RSLabelFormControlBase, RSLabelFormControlBaseOption, RSLabelFormControlBaseOptions, RSFormValidators } from '@LeeZX24/forms';
import { DropDownItem } from '../custom-label-dropdown-form-control/dropdown';

export class RSLabelDropdownFormControlOptions extends RSLabelFormControlBaseOptions {
  static readonly dropdownData = 'dropdownData';
  static readonly dropdownTitleField = 'dropdownTitleField';
  static readonly dropdownValueField = 'dropdownValueField';
  static readonly dropdownEmptyItem = 'dropdownEmptyItem';
  static readonly dropdownCompositeTitle = 'dropdownCompositeTitle';
}

export interface RSLabelDropdownFormControlOption<TData = unknown, TValue = string> extends RSLabelFormControlBaseOption {
  dropdownData?: TData[];
  dropdownTitleField?: keyof TData;
  dropdownValueField?: keyof TData;
  dropdownEmptyItem?: { title: string, value: TValue };
  dropdownCompositeTitle?: (x: TData) => string;
}

export class RSLabelDropDownValidators {
  static required<TValue>(emptyValue?: TValue): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      return value === null || value === undefined || value === '' || value === emptyValue
        ? { require: true }: null;
    }
  }
}

export class RSLabelDropdownFormControl<TData, TValue> extends RSLabelFormControlBase {
  private readonly _dropdownData = signal<DropDownItem<TValue>[]>([]);
  readonly dropdownData = this._dropdownData.asReadonly();

  constructor(
    label: string,
    options: RSLabelDropdownFormControlOption<TData, TValue>,
    value: TValue,
    validator: RSFormValidators = null,
  ) {
    super(label, options, value, validator);
    this._initialize();
  }

  selectedTitle = computed(() => {
    const selectedItem = this.dropdownData().find((item) => item.value === this.value)!;

    return selectedItem ? selectedItem.title : '';
  });

  selectedData = computed<TData | undefined>(() => {
    const dropdownOriData = this.getOptionItem<TData[]>(RSLabelDropdownFormControlOptions.dropdownData);
    const dropdownValueField = this.getOptionItem<keyof TData>(RSLabelDropdownFormControlOptions.dropdownValueField);

    if(!dropdownOriData || !dropdownValueField) return undefined;

    return dropdownOriData.find((item) => item[dropdownValueField] === this.value);
  });

  refresh() {
    this._initialize();
  }

  override reset(formState: unknown = null, options?: { onlySelf?: boolean; emitEvent?: boolean; }) {
    super.reset(formState, options);

    this._applyEmptyValue(options);
  }

  private _initialize() {
    this._validateOptions();
    this._setItems();
    this._setValidators();
    this._applyEmptyValue();
  }

  private _setItems() {
    this._dropdownData.set(
      this._buildItems(),
    )
  }

  private _buildItems() {
    const dropdownTitleField = this.getOptionItem<keyof TData>(RSLabelDropdownFormControlOptions.dropdownTitleField);
    const dropdownValueField = this.getOptionItem<keyof TData>(RSLabelDropdownFormControlOptions.dropdownValueField);
    const dropdownCompositeTitle = this.getOptionItem<(item: TData) => string>(RSLabelDropdownFormControlOptions.dropdownCompositeTitle);

    const dropdownData = this.getOptionItem<TData[]>(RSLabelDropdownFormControlOptions.dropdownData) ?? [];

    const items = dropdownData.map(item => ({
      value: item[dropdownValueField!] as TValue,
      title: dropdownCompositeTitle
      ? dropdownCompositeTitle(item)
      : String(item[dropdownTitleField!])
    }));

    const emptyItem = this.getOptionItem<DropDownItem<TValue>>(RSLabelDropdownFormControlOptions.dropdownEmptyItem);

    return emptyItem ? [emptyItem, ...items] : items;
  }

  private _validateOptions() {
    const titleField = this.getOptionItem<keyof TData>(RSLabelDropdownFormControlOptions.dropdownTitleField);
    const valueField = this.getOptionItem<keyof TData>(RSLabelDropdownFormControlOptions.dropdownValueField);
    const compositeTitle = this.getOptionItem<(item: TData) => string>(RSLabelDropdownFormControlOptions.dropdownCompositeTitle);

    if ((!titleField && !compositeTitle) || !valueField) {
      throw new Error('To use Combobox, you should specify both "ComboboxTitleField or ComboboxCompositeTitle" and "ComboboxValueField"');
    }
  }

  private _resetDropDownValue(options?: { onlySelf?: boolean; emitEvent?: boolean; }) {
    if (this.isRequired()) {
      this.setValue('-1' as TValue, options);
    } else {
      const emptyItem = this.getOptionItem<DropDownItem<TValue>>(RSLabelDropdownFormControlOptions.dropdownEmptyItem);
      if (emptyItem)
        this.setValue(emptyItem['value'], options);
    }
  }

  private _setValidators(): void {
    const validators = this.getCustomValidators();
    if (this.isRequired()) {
      this.validators().push(RSLabelDropDownValidators.required());
    }
    this.validators.set(validators)
    this.clearValidators();
    this.setValidators(Validators.compose(this.validators()));

    this.updValsAndValidities();
  }

  private _applyEmptyValue(options?: { onlySelf?: boolean; emitEvent?: boolean;}): void {
    if (this.value !== null && this.value !== undefined && this.value !== '') return;

    const emptyItem = this.getOptionItem<DropDownItem<TValue>>(RSLabelDropdownFormControlOptions.dropdownEmptyItem);

    if (emptyItem) this.setValue(emptyItem.value, options);
  }
}

