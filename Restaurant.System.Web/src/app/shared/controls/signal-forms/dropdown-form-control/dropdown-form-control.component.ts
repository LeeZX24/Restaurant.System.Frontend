import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, computed, inject, input, model, PLATFORM_ID, signal } from '@angular/core';
import { WithOptionalFieldTree, ValidationError, FormValueControl } from '@angular/forms/signals';
import { TranslateService } from '@ngx-translate/core';
import { ErrorConverterPipe } from '@rs/forms';
import { DropdownFormControl, DropDownItem } from '../signal-form-control';

@Component({
  selector: 'rs-custom-dropdown-form-control',
  imports: [ErrorConverterPipe],
  templateUrl: './dropdown-form-control.component.html',
  styleUrl: './dropdown-form-control.component.css',
})
export class DropdownFormControlComponent<TData extends Record<string, unknown>, TValue = unknown> implements FormValueControl<DropDownItem<TValue> | null>, AfterViewInit {

  isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  translate = inject(TranslateService);

  value = model<DropDownItem<TValue> | null>(null);

  touched = model(false);

  disabled = input(false);
  invalid = input(false);
  errors = input<readonly WithOptionalFieldTree<ValidationError>[]>([]);

  config = input.required<DropdownFormControl<TData, TValue>>();
  labelSize = input<string>('w-4/12');
  inputSize = input<string>('w-8/12');

  items = signal<DropDownItem<TValue>[]>([]);

  isRequired = computed(() => !!this.config().options.required);

  isErrorToShow = computed(() => {
    console.log(!!(this.touched() && this.invalid() && !this.disabled()));
    return !!(this.touched() && this.invalid() && !this.disabled());
  });

  selectedTitle = computed(() => {
    const selectedItem = this.items().find(item => item.value === this.value());
    return selectedItem ? selectedItem['title'] : '';
  });

  setMandatoryEmptyValue = computed(() => this.value.set({ value: '-1' as TValue }));

  selectedData = computed(() => {
    const originalItems:TData[] = this.config().options.dropdownItems ?? [];
    const valueField: string = this.config().options.valueField ?? '';
    return originalItems ? originalItems.find(item => item[valueField] === this.value()): null;
  });

  validationMessage = computed<string[]>(() => {
    const activeErrors = this.errors();

    if(activeErrors.length === 0) return [];

    const customValidations = (this.config().options?.customValidationErrors || {}) as Record<string, string | undefined>;
    const label = this.config().label || '';

    return activeErrors.map((err) => {
      const errorKey = err.kind;

      if(customValidations[errorKey]) return customValidations[errorKey] as string;

      const baseTranslationKey = `project.controls.errors.${errorKey.toLowerCase()}`;

      return `${baseTranslationKey};${label}`;
    });
  });

  constructor() {
    this.translate.setFallbackLang('en');
    this.translate.use('en');
  }

  ngAfterViewInit(): void {
    this.refresh();

  }

  onSelectionChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    console.log(select);
    this.value.set({value: select.value as TValue});
    this.touched.set(true);

    console.log(this.value());
  }

  private _getDropDownItems(): DropDownItem<TValue>[] {
    const titleField = this.config().options.titleField;
    const valueField = this.config().options.valueField;
    const compositeField = this.config().options.compositeTitle as (x:TData) => string;

    let data = this.getDataItems(titleField, valueField, 'To use dropdown, you should specify both "dropDownTitleField or dropDownCompositeTitle" and "dropDownValueField"', compositeField);
    if (!data) {
      data = [];
    }

    const emptyItem = this.config().options.emptyItem;
    if (emptyItem) {
      data.splice(0, 0, emptyItem);
    }

    if (this.isRequired()) {
      data.splice(0, 0, { title: 'select a value...', value: '-1' as TValue });
    }

    return data;
  }

  refresh() {
    this._setOptions();
  }

  private _setOptions() {
    this.items.set([...this._getDropDownItems()]);
    this._applyDropDownOptions();
  }

  private _applyDropDownOptions() {
    const emptyItem = this.config().options.emptyItem;
    if (!!emptyItem && this.isRequired()) {
      throw new Error("You can not set both 'emptyItem' and 'required' of DropDown on the same time");
    }

    if (!this.value()) {
      if (this.isRequired()) {
        this.value.set({value: '-1' as TValue});
      } else if (emptyItem) {
        this.value.set(emptyItem);
      }
    }
  }

  protected getDataItems(
    titleField: keyof TData | undefined,
    valueField: keyof TData | undefined,
    errorMessage: string,
    compositeTitle: (x: TData) => string) : DropDownItem<TValue>[] | null {
    console.log('(!titleField && !compositeTitle) || !valueField', (!titleField && !compositeTitle) || !valueField);
    if ((!titleField && !compositeTitle) || !valueField) {
      throw new Error(errorMessage);
    }

    const data = this.config().options.dropdownItems;
    if (!data)
        return null;

    console.log('drop down items (?) => ', this.config().options.dropdownItems);

    const safeTitleField = titleField as keyof TData;
    const safeValueField = valueField as keyof TData;

    return data.map(x => ({
      value: x[safeValueField] as TValue,
      title: compositeTitle ? compositeTitle(x) : String(x[safeTitleField])
    }));
  }
}
