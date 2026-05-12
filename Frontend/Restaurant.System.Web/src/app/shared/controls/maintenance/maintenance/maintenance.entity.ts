import { BaseDto } from '../../../models/dtos/base/base.dto';
import { STAFF_CONFIG } from './maintenance-config';
import { MaintenanceFormGroup } from './maintenance.form-group';

export type MaintenanceModule = keyof typeof CONFIG_REGISTRY;

export type ConfigOf<M extends MaintenanceModule> = (typeof CONFIG_REGISTRY)[M];

export interface MaintenanceConfig<T extends BaseDto> {
  route: string;
  title: string;
  columns: MaintenanceColumn<T>[];
  actions: TableAction[];
  createForm: () => MaintenanceFormGroup<T>;
  endpoints: {
    list: string;
    create: string;
    update: string;
    delete: string;
  };
}

export interface MaintenanceColumn<T extends BaseDto> {
  key: keyof T;
  label: string;
  type?: 'text' | 'date' | 'badge';
  sortable?: boolean;
  hidden?: boolean;
  width?: string;
}

export interface TableAction {
  key: string;
  label: string;
  icon?: string;
  color?: 'primary' | 'warn' | 'error';
}

export interface TableActionEvent<T extends BaseDto> {
  action: string;
  row: T;
}

export const CONFIG_REGISTRY = {
  staff: STAFF_CONFIG,
  // role: ROLE_CONFIG
} as const;
