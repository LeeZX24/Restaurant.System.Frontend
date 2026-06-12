import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, computed, ElementRef, inject, input, model, PLATFORM_ID, signal, ViewChild } from '@angular/core';
import { WithOptionalFieldTree, ValidationError, FormValueControl } from '@angular/forms/signals';
import { TranslateService } from '@ngx-translate/core';
import { ErrorConverterPipe } from '@rs/forms';
import { ComboboxFormControl, ComboboxItem } from '../signal-form-control';
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: 'rs-custom-combobox-form-control',
  imports: [ErrorConverterPipe, MatIconModule],
  templateUrl: './combobox-form-control.component.html',
  styleUrl: './combobox-form-control.component.css',
})
export class ComboboxFormControlComponent<TData extends Record<string, unknown>, TValue = unknown> implements FormValueControl<ComboboxItem<TValue> | null>, AfterViewInit {
  isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  translate = inject(TranslateService);

  value = model<ComboboxItem<TValue> | null>(null);

  touched = model(false);

  disabled = input(false);
  invalid = input(false);
  errors = input<readonly WithOptionalFieldTree<ValidationError>[]>([]);

  config = input.required<ComboboxFormControl<TData, TValue>>();
  labelSize = input<string>('w-4/12');
  inputSize = input<string>('w-8/12');

  @ViewChild('input') private _input!: ElementRef;

  searchTerms = signal<string>('');
  items = signal<ComboboxItem<TValue>[]>([]);

  isOpen = signal(false);

  filteredItems = computed(() => {
    const value =  this.value()?.value as string;
    if(!value) return this.items();
    const search = value.trim().toLowerCase();
    if(!search) return this.items();
    return this.items().filter(item => item.title?.includes(search) || String(item.value).includes(search));
  });

  isRequired = computed(() => !!this.config().options.required);

  isErrorToShow = computed(() => {
    console.log(!!(this.touched() && this.invalid() && !this.disabled()));
    return !!(this.touched() && this.invalid() && !this.disabled());
  });

  selectedTitle = computed(() => {
    const selectedItem = this.items().find(item => item.value === this.value());
    return selectedItem ? selectedItem['title'] : '';
  });

  selectedData = computed(() => {
    const originalItems:TData[] = this.config().options.comboboxItems ?? [];
    const valueField: string = this.config().options.valueField ?? '';
    return originalItems ? originalItems.find(item => item[valueField] === this.value()): null;
  });

  cancelButtonDisplay = computed(() => {
    const hasValue = this.value()?.value !== '' && this.value()?.value !== null && this.value()?.value !== undefined;
    const isSelected = this.selectedData !== null || this.selectedData !== undefined;
    return (hasValue && isSelected) && !this.disabled();
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

  onItemSelected(item: ComboboxItem<TValue>) {
    this.value.set(item);
    this.isOpen.set(false);
  }

  onInputClick() {
    this.isOpen.set(true);
  }

  onInputSet(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.value.set({value: inputElement.value as TValue});
    this.touched.set(true);
  }

  OnButtonClicked() {
    console.log(this.value());
    if(this.value()) this.value.set(null);
    this._input.nativeElement.value = '';
    this.focus();
    this.isOpen.set(true);
  }

  OnBlur() {
    this.isOpen.set(false);
    this.touched.set(true);
  }

  private _getComboboxItems(): ComboboxItem<TValue>[] {
    const titleField = this.config().options.titleField;
    const valueField = this.config().options.valueField;
    const compositeField = this.config().options.compositeTitle as (x:TData) => string;

    let data = this.getDataItems(titleField, valueField, 'To use combobox, you should specify both "comboboxTitleField or comboboxCompositeTitle" and "comboboxValueField"', compositeField);
    if (!data) {
      data = [];
    }

    return data;
  }

  refresh() {
    this._setOptions();
  }

  private _setOptions() {
    this.items.set([...this._getComboboxItems()]);
  }

  protected getDataItems(
    titleField: keyof TData | undefined,
    valueField: keyof TData | undefined,
    errorMessage: string,
    compositeTitle: (x: TData) => string) : { value: TValue; title: string }[] | null {
    console.log('(!titleField && !compositeTitle) || !valueField', (!titleField && !compositeTitle) || !valueField);
    if ((!titleField && !compositeTitle) || !valueField) {
      throw new Error(errorMessage);
    }

    const data = this.config().options.comboboxItems;
    if (!data)
        return null;

    console.log('drop down items (?) => ', this.config().options.comboboxItems);

    const safeTitleField = titleField as keyof TData;
    const safeValueField = valueField as keyof TData;

    return data.map(x => ({
      value: x[safeValueField] as TValue,
      title: compositeTitle ? compositeTitle(x) : String(x[safeTitleField])
    }));
  }

  focus(): void {
    this._input.nativeElement.focus();
  }
}
