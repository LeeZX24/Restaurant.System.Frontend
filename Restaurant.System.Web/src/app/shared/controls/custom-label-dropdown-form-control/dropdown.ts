export interface DropdownDto extends Record<string, unknown> {
  order?: string;
  json?: string;
}

export interface DropDownItem<TValue = unknown> {
  title: string;
  value: TValue;
}
