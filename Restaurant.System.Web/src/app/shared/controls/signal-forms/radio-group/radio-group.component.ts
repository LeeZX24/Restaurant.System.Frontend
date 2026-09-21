import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, computed, ElementRef, inject, input, model, PLATFORM_ID, signal, ViewChild } from '@angular/core';
import { WithOptionalFieldTree, ValidationError, FormValueControl } from '@angular/forms/signals';
import { TranslateService } from '@ngx-translate/core';
import { RadioGroupFormControl, RadioGroupItem } from '../signal-form-control';
import { ErrorConverterPipe } from '@LeeZX24/forms';

@Component({
  selector: 'rs-custom-radio-group',
  imports: [ErrorConverterPipe],
  templateUrl: './radio-group.component.html',
  styleUrl: './radio-group.component.css',
})
export class CustomRadioGroupComponent<TData extends Record<string, unknown>, TValue = unknown> implements FormValueControl<RadioGroupItem<TValue> | null>, AfterViewInit {
  isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  translate = inject(TranslateService);

  value = model<RadioGroupItem<TValue> | null>(null);

  touched = model(false);

  disabled = input(false);
  invalid = input(false);
  errors = input<readonly WithOptionalFieldTree<ValidationError>[]>([]);

  config = input.required<RadioGroupFormControl<TData>>();
  labelSize = input<string>('w-4/12');
  inputSize = input<string>('w-8/12');

  @ViewChild('input') private _input!: ElementRef;

  items = signal<RadioGroupItem<TValue>[]>([]);

  isOpen = signal(false);

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
    const originalItems:TData[] = this.config().options.radioData ?? [];
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

  onRadioChange(radioItem: RadioGroupItem<TValue>) {
    this.value.set(radioItem);
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

  private _getRadioGroupItems(): RadioGroupItem<TValue>[] {
    const titleField = this.config().options.titleField;
    const valueField = this.config().options.valueField;
    const compositeField = this.config().options.compositeTitle as (x:TData) => string;

    let data = this.getDataItems(titleField, valueField, 'radiogroup', compositeField);
    if (!data) {
      data = [];
    }

    return data;
  }

  refresh() {
    this._setOptions();
  }

  private _setOptions() {
    this.items.set([...this._getRadioGroupItems()]);
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

    const data = this.config().options.radioData;
    if (!data)
        return null;

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
