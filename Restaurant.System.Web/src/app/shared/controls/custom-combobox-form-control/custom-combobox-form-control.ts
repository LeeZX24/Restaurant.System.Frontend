import { computed, signal } from '@angular/core';
import { AbstractControl, Validators } from '@angular/forms';
import { RSFormControlBase, RSFormControlBaseOption, RSFormControlBaseOptions, RSFormValidators } from '@LeeZX24/forms';
import { DropdownModel } from '../../models/dropdown.model';
import { ComboboxItem } from './combobox';

export class RSComboboxFormControlOptions extends RSFormControlBaseOptions {
  static readonly items = 'items';
  static readonly titleField = 'titleField';
  static readonly valueField = 'valueField';
  static readonly compositeTitle = 'compositeTitle';
}

export interface RSComboboxFormControlOption extends RSFormControlBaseOption {
  items?: unknown[];
  titleField?: string;
  valueField?: string;
  emptyItem?: ComboboxItem<DropdownModel>;
  compositeTitle?: (x: unknown) => string;
}

export class RSComboboxValidators {
  static Required() {
    return (control: AbstractControl): Record<string, boolean> | null => {
      return (!!control && control.value  === '-1' ? { required: true } : null);
    }
  }
}

export class RSComboboxFormControl extends RSFormControlBase {
  readonly searchTerm$ = signal('');
  readonly items$ = signal<ComboboxItem<DropdownModel>[]>([]);
  items = this.items$.asReadonly();

  public filteredItems$ = computed(() => {
    const search = this.searchTerm$().trim().toLowerCase();
    if (!search) return this.items$();
    return this.items$().filter((item) => item.title?.toLowerCase().includes(search));
  });

  readonly filteredItems = this.filteredItems$;

  constructor(
    options: RSComboboxFormControlOption,
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
    const origItem = this.getOptionItem<DropdownModel[]>(RSComboboxFormControlOptions.items)!;
    const valueField = this.getOptionItem<string>(RSComboboxFormControlOptions.valueField)!;

    return origItem ? origItem.find((item) => item[valueField] === this.value) : undefined;
  });

  refresh() {
    this._setOptions();
    this._setValidators();
  }

  _setOptions() {
    this.items$.set(this._getComboboxItems());
  }

  private _getComboboxItems(): ComboboxItem<DropdownModel>[] {
    const titleField = this.getOptionItem<string>(RSComboboxFormControlOptions.titleField)!;
    const valueField = this.getOptionItem<string>(RSComboboxFormControlOptions.valueField)!;
    const compositeField = this.getOptionItem<(x: unknown) => string>(RSComboboxFormControlOptions.compositeTitle,)!;

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

  protected getDataItems(titleField: string, valueField: string, errorMessage: string, dataField: string, compositeTitle: (x: unknown) => string,): ComboboxItem<DropdownModel>[] | null {
    if ((!titleField && !compositeTitle) || !valueField) {
      throw new Error(errorMessage);
    }

    const data = this.getOptionItem<DropdownModel[]>(dataField)!;

    if (!data) return null;

    const safeTitleField = titleField;
    const safeValueField = valueField;

    return data.map((x) => ({
      value: x[safeValueField],
      title: compositeTitle ? compositeTitle(x) : String(x[safeTitleField]),
      selectedData: x
    }));
  }

  clear() {
    this.setValue('');
    this.searchTerm$.set('');
  }
}
