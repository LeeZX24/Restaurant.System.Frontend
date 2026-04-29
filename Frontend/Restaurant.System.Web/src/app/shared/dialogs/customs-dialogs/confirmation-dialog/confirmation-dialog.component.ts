import { Component, inject } from '@angular/core';
import { CustomDialogBaseComponent } from "../../custom-dialog-base/custom-dialog-base.component";
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'rs-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css'],
  imports: [CustomDialogBaseComponent]
})
export class ConfirmationDialogComponent {
  dialogRef = inject(MatDialogRef<ConfirmationDialogComponent>);
  data = inject(MAT_DIALOG_DATA);
  // dialogRef = inject(CustomDialogRef);
  // data = inject(CustomDialogConfig).data;
  // config = inject(CustomDialogConfig);

  variant = this.data.variant || 'info';

  

  close(result?: unknown) {
    this.dialogRef.close(result);
  }
}
