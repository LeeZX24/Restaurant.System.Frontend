export interface DropdownModel extends Record<string, string> {
    key: string;
    value: string;
    order: string;
}

export interface DropDownObject<T> {
  value?: string;
  selectedData?: T;
}
