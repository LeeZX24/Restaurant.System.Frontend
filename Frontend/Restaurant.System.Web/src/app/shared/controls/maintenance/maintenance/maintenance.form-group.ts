import { CustomFormGroup } from '@rs/forms';
import { MaintenanceConfig } from './maintenance.entity';
import { BaseDto } from '../../../models/dtos/base/base.dto';

export class MaintenanceFormGroup<T extends BaseDto> extends CustomFormGroup {
  constructor(public config: MaintenanceConfig<T>) {
    super();
  }
}
