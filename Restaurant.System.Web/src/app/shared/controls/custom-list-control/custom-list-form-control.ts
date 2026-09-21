import { signal } from '@angular/core';
import {
  CustomFormGroup,
  RSFormValidators,
  RSLabelFormControlBase,
  RSLabelFormControlBaseOption,
} from '@LeeZX24/forms';

export interface ControlAccessType {
  key: string;
  isMain: boolean;
}

export interface RSListOptions<TItem = unknown> {
  accessType?: ControlAccessType[];
  createEmptyRow?: () => TItem;
  createFormGroup?: (item: TItem) => CustomFormGroup;
}

export abstract class RSListFormControl extends RSLabelFormControlBase {
  listOptions$ = signal<RSListOptions>({});

  constructor(
    label: string,
    options: RSLabelFormControlBaseOption,
    listOptions: RSListOptions,
    value: unknown,
    validator: RSFormValidators = null,
  ) {
    super(label, options, value, validator);

    this.listOptions$.set(listOptions);
  }
}
