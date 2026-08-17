export type FormValueControlType =
  'text' | 'number' | 'dropdown' | 'textarea' | 'date' | 'radio' | 'checkbox';

export interface TextFormControl {
  key: string;
  label: string;
  type: FormValueControlType;
  options: TextFormControlOption;
}

export interface TextFormControlOption {
  required?: boolean;
  customValidationErrors?: Record<string, string>;
  elementCssClass?: string;
  mask?: string;
  minlength?: number;
  maxlength?: number;
  placeholder?: string;
  mask_validation?: boolean;
  readonly?: boolean;
  capitalized?: boolean;
  inputType?: string;
  autoComplete?: string;
}

export interface TextareaFormControl {
  key: string;
  label: string;
  type: FormValueControlType;
  options: TextareaFormControlOption;
}

export interface TextareaFormControlOption {
  required?: boolean;
  customValidationErrors?: Record<string, string>;
  elementCssClass?: string;
  minlength?: number;
  maxlength?: number;
  placeholder?: string;
  readonly?: boolean;
  capitalized?: boolean;
  rows?: number;
  cols?: number;
}

export interface DropdownFormControl<TData extends Record<string, unknown>, TValue = unknown> {
  key: string;
  label: string;
  type: FormValueControlType;
  options: DropdownFormControlOption<TData, TValue>;
}

export interface DropdownFormControlOption<
  TData extends Record<string, unknown>,
  TValue = unknown,
> {
  required?: boolean;
  customValidationErrors?: Record<string, string>;
  elementCssClass?: string;
  dropdownItems?: TData[];
  titleField?: keyof TData & string;
  valueField?: keyof TData & string;
  emptyItem?: DropDownItem<TValue>;
  compositeTitle?: (x: TData) => string;
}

export interface DropdownDto extends Record<string, unknown> {
  order?: string;
  json?: string;
}

export interface DropDownItem<TValue> {
  title?: string;
  value?: TValue;
}

export interface ComboboxFormControl<TData extends Record<string, unknown>, TValue = unknown> {
  key: string;
  label: string;
  type: FormValueControlType;
  options: ComboboxFormControlOption<TData, TValue>;
}

export interface ComboboxFormControlOption<
  TData extends Record<string, unknown>,
  TValue = unknown,
> {
  required?: boolean;
  customValidationErrors?: Record<string, string>;
  elementCssClass?: string;
  comboboxItems?: TData[];
  titleField?: keyof TData & string;
  valueField?: keyof TData & string;
  emptyItem?: ComboboxItem<TValue>;
  compositeTitle?: (x: TData) => string;
}

export interface ComboboxModel extends Record<string, unknown> {
  order?: string;
  json?: string;
}

export interface ComboboxItem<TValue> {
  title?: string;
  value?: TValue;
}

export interface RadioGroupFormControl<TData extends Record<string, unknown>> {
  key: string;
  label: string;
  type: FormValueControlType;
  options: RadioGroupFormControlOption<TData>;
}

export interface RadioGroupFormControlOption<TData extends Record<string, unknown>> {
  required?: boolean;
  customValidationErrors?: Record<string, string>;
  elementCssClass?: string;
  radioData?: TData[];
  titleField?: keyof TData & string;
  valueField?: keyof TData & string;
  compositeTitle?: (x: TData) => string;
}

export interface RadioGroupModel extends Record<string, unknown> {
  order?: string;
  json?: string;
}

export interface RadioGroupItem<TValue> {
  title?: string;
  value?: TValue;
}

export interface CheckboxFormControl {
  key: string;
  label: string;
  type: FormValueControlType;
  options: CheckboxFormControlOption;
}

export interface CheckboxFormControlOption {
  required?: boolean;
  customValidationErrors?: Record<string, string>;
  elementCssClass?: string;
}
