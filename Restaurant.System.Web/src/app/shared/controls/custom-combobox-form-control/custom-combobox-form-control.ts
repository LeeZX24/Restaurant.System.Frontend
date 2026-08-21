import { computed, signal } from '@angular/core';
import { AbstractControl, ValidatorFn, Validators } from '@angular/forms';
import { RSFormControlBase, RSFormControlBaseOption, RSFormControlBaseOptions, RSFormValidators } from '@LeeZX24/forms';
import { DropDownItem } from '../custom-label-dropdown-form-control/dropdown';

export class RSComboboxFormControlOptions extends RSFormControlBaseOptions {
  static readonly items = 'items';
  static readonly titleField = 'titleField';
  static readonly valueField = 'valueField';
  static readonly compositeTitle = 'compositeTitle';
}

export interface RSComboboxFormControlOption<
  TData extends Record<string, unknown>,
  TValue = unknown,
> extends RSFormControlBaseOption {
  items?: TData[];
  titleField?: keyof TData & string;
  valueField?: keyof TData & string;
  emptyItem?: DropDownItem<TValue>;
  compositeTitle?: (x: TData) => string;
}

export class RSComboboxValidators {
  static Required(): ValidatorFn {
    const fn = (ctrl: AbstractControl): Record<string, boolean> | null => {
      return !!ctrl && ctrl.value == '-1' ? { required: true } : null;
    };

    return fn;
  }
}

export class RSComboboxFormControl<
  TData extends Record<string, unknown>,
  TValue = unknown,
> extends RSFormControlBase {
  readonly searchTerm$ = signal('');
  readonly items$ = signal<DropDownItem<TValue>[]>([]);
  items = this.items$.asReadonly();

  public filteredItems$ = computed(() => {
    const search = this.searchTerm$().trim().toLowerCase();
    if (!search) return this.items$();
    return this.items$().filter((item) => item.title.toLowerCase().includes(search));
  });

  readonly filteredItems = this.filteredItems$;

  constructor(
    options: RSComboboxFormControlOption<TData, TValue>,
    value: unknown,
    validator: RSFormValidators = null,
  ) {
    super(options, value, validator);
    this._setOptions();
    this._setValidators();
    this.updateSearchTermFromValue();
  }

  updateSearchTermFromValue() {
    const selected = this.items$().find((item) => item.value === this.value);

    this.searchTerm$.set(selected?.title ?? '');
  }

  selectedTitle = computed(() => {
    const selectedItem = this.items$().find((item) => item.value === this.value)!;

    return selectedItem ? selectedItem.title : '';
  });

  selectedData = computed(() => {
    const origItem = this.getOptionItem<TData[]>(RSComboboxFormControlOptions.items)!;
    const valueField = this.getOptionItem<keyof TData>(RSComboboxFormControlOptions.valueField)!;

    return origItem ? origItem.find((item) => item[valueField] === this.value) : undefined;
  });

  refresh() {
    this._setOptions();
    this._setValidators();
  }

  _setOptions() {
    this.items$.set(this._getComboboxItems());
  }

  private _getComboboxItems(): DropDownItem<TValue>[] {
    const titleField = this.getOptionItem<keyof TData>(RSComboboxFormControlOptions.titleField)!;
    const valueField = this.getOptionItem<keyof TData>(RSComboboxFormControlOptions.valueField)!;
    const compositeField = this.getOptionItem<(x: TData) => string>(
      RSComboboxFormControlOptions.compositeTitle,
    )!;

    let data = this.getDataItems(
      titleField,
      valueField,
      'To use Combobox, you should specify both "ComboboxTitleField or ComboboxCompositeTitle" and "ComboboxValueField"',
      RSComboboxFormControlOptions.items,
      compositeField,
    );
    if (!data) {
      data = [];
    }

    return data;
  }

  override reset(formState: unknown = null, options?: { onlySelf?: boolean; emitEvent?: boolean }) {
    super.reset(formState, options);
  }

  private _setValidators(): void {
    this.validators.set(this.getCustomValidators());
    if (this.isRequired()) {
      this.validators().push(RSComboboxValidators.Required());
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
    compositeTitle: (x: TData) => string,
  ): { value: TValue; title: string }[] | null {
    if ((!titleField && !compositeTitle) || !valueField) {
      throw new Error(errorMessage);
    }

    const data = this.getOptionItem<TData[]>(dataField)!;

    if (!data) return null;

    const safeTitleField = titleField as keyof TData;
    const safeValueField = valueField as keyof TData;

    return data.map((x) => ({
      value: x[safeValueField] as TValue,
      title: compositeTitle ? compositeTitle(x) : String(x[safeTitleField]),
    }));
  }

  clear() {
    this.setValue(null, { emitEvent: false });
    this.searchTerm$.set('');
  }
}
