import { Component, OnInit, OnDestroy, ViewChild, ViewContainerRef, inject, ElementRef } from "@angular/core";
import { MatDialogModule, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Subject } from "rxjs";
import { DialogVariant } from "./custom-dialog-variant";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'rs-dialog-base',
  templateUrl: './custom-dialog-base.component.html',
  styleUrls: ['./custom-dialog-base.component.css'],
  imports: [MatDialogModule, CommonModule],
})
export class CustomDialogBaseComponent implements OnInit, OnDestroy {
  @ViewChild('contentHost', { read: ViewContainerRef, static: true }) contentHost!: ViewContainerRef;
  data = inject(MAT_DIALOG_DATA);

  @ViewChild('dialogBody') dialogBody!: ElementRef;

  private destroy$ = new Subject<void>();

  get variant() { return this.data?.variant || DialogVariant.Info; }

  ngOnInit() {
    if(this.data.component) {
      this.contentHost.createComponent(this.data.component);
    }

    // this.focusOnOpen();
  }

  ngOnDestroy() {
    // this.componentRef?.destroy();
    this.destroy$.next();
    this.destroy$.complete();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // onBackdropClick(_event: PointerEvent) {
  //   if ((this.config.closeOnBackdropClick, this.config.disableClose)) return;
  //   this.dialogRef.close();
  // }

  // private focusOnOpen() {
  //   queueMicrotask(() => {
  //     const el = this.dialogBody.nativeElement;
  //     const focusable = el.querySelector(
  //       'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  //     ) as HTMLElement | null;
  //     (focusable ?? el).focus();
  //   });
  // }
}
