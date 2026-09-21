import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  RSLabelEmailFormControlComponent,
  RSLabelPasswordFormControlComponent,
  RSLabelTextFormControlComponent,
} from '@LeeZX24/forms';

export const SHARED_IMPORTS = [CommonModule];

export const SHARED_FORM_MODULE = [ReactiveFormsModule, FormsModule];

export const SHARED_GENERAL_FORM_CONTROLS = [RSLabelTextFormControlComponent];

export const SHARED_AUTH_FORM_CONTROLS = [
  RSLabelEmailFormControlComponent,
  RSLabelPasswordFormControlComponent,
];
