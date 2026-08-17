export interface DropdownDto extends Record<string, unknown> {
  order?: string;
  json?: string;
}

export interface DropDownItem<TValue> {
  title: string;
  value: TValue;
}
