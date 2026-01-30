import { Component, inject } from '@angular/core';
import { CustomDialogBase } from '../../custom-dialog-base/custom-dialog-base';
import { DIALOG_VARIANT } from '../../custom-dialog-base/custom-dialog-variant';
import { CustomDialogConfig } from '../../custom-dialog-base/custom-dialog.config';
import { CustomDialogRef } from '../../custom-dialog-base/custom-dialog.ref';

@Component({
  selector: 'rs-error-dialog',
  templateUrl: './error-dialog.component.html',
  styleUrls: ['./error-dialog.component.css'],
  imports: []
})
export class ErrorDialogComponent extends CustomDialogBase<unknown> {
  dialogRef = inject(CustomDialogRef);
  data = inject(CustomDialogConfig).data;
  config = inject(CustomDialogConfig);

  variant = inject(DIALOG_VARIANT);

  titleClass = {
    error: 'text-red-600 font-bold',
    info: 'text-blue-600 font-bold',
    success: 'text-green-600 font-bold',
    warning: 'text-yellow-600 font-bold',
    confirmation: 'text-purple-600 font-bold'
  }[this.variant];

  buttonClass = {
    error: 'bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded',
    info: 'bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded',
    success: 'bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded',
    confirmation: 'bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded'
  }[this.variant];

  close(result?: unknown) {
    this.dialogRef.close(result);
  }
}
