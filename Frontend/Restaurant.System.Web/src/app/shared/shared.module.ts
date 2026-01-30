import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ErrorConverterPipe } from "./pipes/error-converter-pipe";
import { RSLabelEmailFormControlComponent, RSLabelPasswordFormControlComponent, RSLabelTextFormControlComponent } from "@rs/forms";

export const SHARED_IMPORTS = [
  CommonModule,
];

export const SHARED_FORM_MODULE = [
  ReactiveFormsModule,
  FormsModule
];

export const SHARED_EXPORTS = [
  ErrorConverterPipe
];

export const SHARED_GENERAL_FORM_CONTROLS = [
  RSLabelTextFormControlComponent
];

export const SHARED_AUTH_FORM_CONTROLS = [
  RSLabelEmailFormControlComponent,
  RSLabelPasswordFormControlComponent
];
