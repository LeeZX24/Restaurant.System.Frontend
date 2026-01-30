import { InjectionToken } from "@angular/core";
import { DialogVariant } from "./custom-dialog.config";

export const DIALOG_VARIANT = new InjectionToken<DialogVariant>('DIALOG_VARIANT');
