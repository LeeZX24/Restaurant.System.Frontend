import { ToggleView } from "../../models/toggle.model";

export interface CustomToggle {
  toggleOff: ToggleView;
  toggleOn: ToggleView;
  disabled: boolean;
}