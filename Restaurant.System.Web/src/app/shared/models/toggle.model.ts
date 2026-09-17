export interface Toggle {
  toggleOff: ToggleView;
  toggleOn: ToggleView;
}
export interface ToggleView {
  label: string;
  icon?: string;
}

export enum ToggleType {
}