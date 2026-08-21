import { CustomFormGroup } from '@LeeZX24/forms';
import { ObjectUtils } from '../../utils/object-utils';

export class ObjectFormGroup<TValue> extends CustomFormGroup {
  readonly keys = ObjectUtils.getKeysAsString<TValue>();
}
