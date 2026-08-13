import { CustomFormGroup } from '@rs/forms';

export interface CustomListOptions<TItem> {
  keys: string[];
  createEmptyRow?: () => TItem;
  createFormGroup?: (item: TItem) => CustomFormGroup;
}
