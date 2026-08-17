import { BaseDto } from '../shared/models/dtos/base/base.dto';
import {
  DataGridAction,
  DataGridColumn,
  DataGridSearch,
} from '../shared/controls/data-grid-component/data-grid';
import { DROPDOWN_CONFIG, ROLE_CONFIG, STAFF_CONFIG } from './maintenance-config';
import { MaintenanceFormGroup } from './maintenance.form-group';
import { Type } from '@angular/core';
import { MaintenanceFormComponent } from './forms/form.component';

export type MaintenanceModule = keyof typeof CONFIG_REGISTRY;

export type ConfigOf<M extends MaintenanceModule> = (typeof CONFIG_REGISTRY)[M];

export interface MaintenanceConfig<TFormGroup extends MaintenanceFormGroup<T>, T extends BaseDto> {
  route: string;
  title: string;
  columns: DataGridColumn<T>[];
  actions: DataGridAction[];
  search: DataGridSearch<T>;
  formComponent: Type<MaintenanceFormComponent<TFormGroup, T>>;
  endpoints: {
    list: string;
    create: string;
    update: string;
    delete: string;
  };
}

export const CONFIG_REGISTRY = {
  staff: STAFF_CONFIG,
  role: ROLE_CONFIG,
  dropdown: DROPDOWN_CONFIG,
};
