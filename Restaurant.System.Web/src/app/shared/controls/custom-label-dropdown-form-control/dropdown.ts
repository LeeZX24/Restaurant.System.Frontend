export interface DropdownDto extends Record<string, unknown> {
  order?: string;
  json?: string;
}

export interface DropDownItem {
  title: string;
  value: unknown;
}
