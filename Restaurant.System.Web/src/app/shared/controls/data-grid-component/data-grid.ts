import { BaseDto } from "../../models/dtos/base/base.dto";


export interface DataGridSearch<T extends BaseDto> {
  enabled: boolean;
  placeholder?: string;

  predicate: (row: T, term: string) => boolean;
}

export interface DataGridColumn<T extends BaseDto> {
  key?: keyof T;
  label: string;
  type?: 'text' | 'date' | 'amount' | 'number' | 'time' | 'date-time' | 'boolean' | 'badge';
  sortable?: boolean;
  width?: string;

  columnValue?: (row: T) => string;
}

export interface DataGridAction {
  key: string;
  label: string;
  icon: string;
}

export interface DataGridActionEvent<T extends BaseDto> {
  action: string;
  row: T;
}
