import { BaseDto } from '../../../models/dtos/base/base.dto';
import { DataGridAction, DataGridColumn, DataGridSearch } from '../../data-grid-component/data-grid';
import { ROLE_CONFIG, STAFF_CONFIG } from './maintenance-config';
import { MaintenanceFormGroup } from './maintenance.form-group';

export type MaintenanceModule = keyof typeof CONFIG_REGISTRY;

export type ConfigOf<M extends MaintenanceModule> = (typeof CONFIG_REGISTRY)[M];

export interface MaintenanceConfig<T extends BaseDto> {
  route: string;
  title: string;
  columns: DataGridColumn<T>[];
  actions: DataGridAction[];
  search: DataGridSearch<T>;
  createForm: () => MaintenanceFormGroup<T>;
  endpoints: {
    list: string;
    create: string;
    update: string;
    delete: string;
  };
}

export const CONFIG_REGISTRY = {
  staff: STAFF_CONFIG,
  role: ROLE_CONFIG
}
