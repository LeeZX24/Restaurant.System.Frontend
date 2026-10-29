import { ComboboxItem } from "../../../shared/controls/custom-combobox-form-control/combobox";
import { DropdownModel } from "../../../shared/models/dropdown.model";

export interface PhoneDto {
  type?: ComboboxItem<DropdownModel>;
  number?: string;
}
