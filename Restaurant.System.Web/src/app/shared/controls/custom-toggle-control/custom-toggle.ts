export interface CustomToggle {
  toggleOff: ToggleView;
  toggleOn: ToggleView;
  disabled: boolean;
}

interface ToggleView {
  label: string;
  icon?: string;
}
