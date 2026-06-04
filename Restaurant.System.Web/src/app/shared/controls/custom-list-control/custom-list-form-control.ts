import { CustomFormGroup, RSFormControlBaseType } from "@rs/forms";

export interface CustomListRow {
  form: CustomFormGroup;
  controls: Record<string, RSFormControlBaseType>;
}
