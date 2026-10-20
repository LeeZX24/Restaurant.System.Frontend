import { CustomFormGroup } from '@LeeZX24/forms';
import { ObjectUtils } from '../utils/object-utils';

export class MaintenanceFormGroup<T> extends CustomFormGroup {
  public controlKeys = ObjectUtils.getKeysAsString<T>();

  constructor() {
    super();
  }
}
