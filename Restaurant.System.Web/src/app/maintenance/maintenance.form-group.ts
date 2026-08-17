import { CustomFormGroup } from '@rs/forms';
import { BaseDto } from '../shared/models/dtos/base/base.dto';
import { ObjectUtils } from '../utils/object-utils';

export class MaintenanceFormGroup<T extends BaseDto> extends CustomFormGroup {
  public controlKeys = ObjectUtils.getKeysAsString<T>();

  constructor() {
    super();
  }
}
