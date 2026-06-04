import { AbstractControl, ValidatorFn, Validators } from '@angular/forms';
import {
  RSLabelFormControlBaseOptions,
  RSLabelFormControlBaseOption,
  RSLabelFormControlBase,
} from '@rs/forms';
import { computed, signal } from '@angular/core';
import { RSFormValidators } from '@rs/forms';
import { DropDownItem } from './dropdown';

export class RSLabelDropdownFormControlOptions extends RSLabelFormControlBaseOptions {
  static readonly items = 'items';
  static readonly titleField = 'titleField';
  static readonly valueField = 'valueField';
  static readonly emptyItem = 'emptyItem';
  static readonly compositeTitle = 'compositeTitle';
}

export interface RSLabelDropdownFormControlOption<TData extends Record<string, unknown>, TValue = unknown> extends RSLabelFormControlBaseOption {
  items?: TData[];
  titleField?: keyof TData & string;
  valueField?: keyof TData & string;
  emptyItem?: DropDownItem<TValue>;
  compositeTitle?: (x: TData) => string;
}

export class RSLabelDropDownValidators {
  static Required(): ValidatorFn {
    const fn = (ctrl: AbstractControl): Record<string, boolean> | null => {
      return (!!ctrl && (ctrl.value == '-1') ? { required: true } : null);
    };

    return fn;
  }
}

export class RSLabelDropdownFormControl<TData extends Record<string, unknown>, TValue = unknown> extends RSLabelFormControlBase {
  public items$ = signal<DropDownItem<TValue>[]>([]);
  items = this.items$.asReadonly();
  setItems(items: DropDownItem<TValue>[]) { this.items$.set(items) }

  constructor(
    label: string,
    options: RSLabelDropdownFormControlOption<TData, TValue>,
    value: unknown,
    validator: RSFormValidators = null,
  ) {
    super(label, options, value, validator);
    this._setOptions();
    this._setValidators();
  }

  selectedTitle = computed(() => {
    const selectedItem = this.items().find(item => item.value === this.value)!;

    return selectedItem ? selectedItem.title : '';
  });

  setMandatoryEmptyValue = computed((emitEvent = true) => this.setValue('-1', { emitEvent: emitEvent}));

  selectedData = computed(() => {
    const origItem = this.getOptionItem<TData[]>(RSLabelDropdownFormControlOptions.items)!;
    const valueField = this.getOptionItem<keyof TData>(RSLabelDropdownFormControlOptions.valueField)!;

    return origItem ? origItem.find(item => item[valueField] === this.value): undefined;
  });

  refresh() {
    this._setOptions();
    this._setValidators();
  }

  private _setOptions() {
    this.setItems(this._getDropDownItems());
    this._applyDropDownOptions();
  }

  private _getDropDownItems(): DropDownItem<TValue>[] {
    const titleField = this.getOptionItem<keyof TData>(RSLabelDropdownFormControlOptions.titleField)!;
    const valueField = this.getOptionItem<keyof TData>(RSLabelDropdownFormControlOptions.valueField)!;
    const compositeField = this.getOptionItem<(x: TData) => string>(RSLabelDropdownFormControlOptions.compositeTitle)!;

    let data = this.getDataItems(titleField, valueField, 'To use dropdown, you should specify both "dropDownTitleField or dropDownCompositeTitle" and "dropDownValueField"', RSLabelDropdownFormControlOptions.items, compositeField);
    if (!data) {
      data = [];
    }

    const emptyItem = this.getOptionItem<DropDownItem<TValue>>(RSLabelDropdownFormControlOptions.emptyItem);
    if (emptyItem) {
      data.splice(0, 0, emptyItem);
    }

    if (this.isRequired()) {
      data.splice(0, 0, { title: 'select a value...', value: '-1' as TValue });
    }

    return data;
  }

  private _applyDropDownOptions() {
    const emptyItem = this.getOptionItem<DropDownItem<TValue>>(RSLabelDropdownFormControlOptions.emptyItem);
    if (!!emptyItem && this.isRequired()) {
      throw new Error("You can not set both 'emptyItem' and 'required' of DropDown on the same time");
    }

    if (!this.value) {
      if (this.isRequired()) {
        this.setValue('-1' as TValue);
      } else if (emptyItem) {
        this.setValue(emptyItem['value']);
      }
    }

    this.updateValueAndValidity();
  }

  override reset(formState: unknown = null, options?: { onlySelf?: boolean; emitEvent?: boolean; }) {
    super.reset(formState, options);
    this._resetDropDownValue(options);
  }

  private _resetDropDownValue(options?: { onlySelf?: boolean; emitEvent?: boolean; }) {
    if (this.isRequired()) {
      this.setValue('-1' as TValue, options);
    } else {
      const emptyItem = this.getOptionItem<DropDownItem<TValue>>(RSLabelDropdownFormControlOptions.emptyItem);
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

  protected getDataItems(
    titleField: keyof TData | undefined,
    valueField: keyof TData | undefined,
    errorMessage: string,
    dataField: string,
    compositeTitle: (x: TData) => string): { value: TValue; title: string }[] | null {
    if ((!titleField && !compositeTitle) || !valueField) {
      throw new Error(errorMessage);
    }

    const data = this.getOptionItem<TData[]>(dataField)!;

    if (!data)
        return null;

    const safeTitleField = titleField as keyof TData;
    const safeValueField = valueField as keyof TData;

    return data.map(x => ({
      value: x[safeValueField] as TValue,
      title: compositeTitle ? compositeTitle(x) : String(x[safeTitleField])
    }));
  }
}

