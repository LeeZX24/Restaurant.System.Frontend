import { CommonModule } from '@angular/common';
import { Component, ComponentRef, ElementRef, inject, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Subject } from 'rxjs';
import { CustomDialogConfig } from './custom-dialog.config';
import { DIALOG_VARIANT } from './custom-dialog-variant';
import { CustomDialogRef } from './custom-dialog.ref';

@Component({
  selector: 'rs-dialog-base',
  templateUrl: './custom-dialog-base.component.html',
  styleUrls: ['./custom-dialog-base.component.css'],
  imports: [CommonModule]
})
export class CustomDialogBaseComponent implements OnInit, OnDestroy {
  @ViewChild('contentHost', { read: ViewContainerRef, static: true })
  contentHost!: ViewContainerRef;

  config = inject(CustomDialogConfig);
  private dialogRef = inject(CustomDialogRef);
  private variant = inject(DIALOG_VARIANT);

  @ViewChild('dialogBody') dialogBody!: ElementRef;

  private destroy$ = new Subject<void>();

  private componentRef?: ComponentRef<unknown>;

  variantClass = {
    info: 'border-2 border-blue-500 bg-blue-50',
    error: 'border-2 border-red-600 bg-red-50',
    success: 'border-2 border-green-600 bg-green-50',
    warning: 'border-2 border-yellow-500 bg-yellow-50',
    confirmation: 'border-2 border-purple-600 bg-purple-50',
  }[this.variant];

  ngOnInit() {
    this.focusOnOpen();
  }

  ngOnDestroy() {
    this.componentRef?.destroy();
    this.destroy$.next();
    this.destroy$.complete();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onBackdropClick(_event: PointerEvent) {
    if(this.config.closeOnBackdropClick, this.config.disableClose) return;
    this.dialogRef.close();
  }

  private focusOnOpen() {
    queueMicrotask(() => {
      const el = this.dialogBody.nativeElement;
      const focusable = el.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement | null;
      (focusable ?? el).focus();
    });
  }
}
