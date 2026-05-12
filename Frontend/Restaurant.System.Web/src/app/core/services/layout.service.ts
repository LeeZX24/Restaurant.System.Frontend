import { inject, Injectable, Type } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { BreakpointObserver } from '@angular/cdk/layout';
import { LayoutRef } from '../../shared/layouts/layout-ref';
import { LayoutComponent } from '../../shared/layouts/layout.component';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  private breakpoint = inject(BreakpointObserver);
  private dialog = inject(MatDialog);
  private bottomSheet = inject(MatBottomSheet);

  open<C extends LayoutComponent<R>, D, R = unknown>(component: Type<C>, data: D): LayoutRef<R> {
    const isMobile = this.breakpoint.isMatched('(max-width: 640px)');

    if (isMobile) {
      const ref = this.bottomSheet.open(component, { data, panelClass: 'rs-bottom-sheet-form' });

      const controller: LayoutRef = {
        close: (result?: R) => ref.dismiss(result),
      };

      ref.instance.controller = controller;
      return controller;
    }

    const ref = this.dialog.open(component, {
      data,
      width: 'min(900px, 95vw)',
      maxWidth: '95vw',
      maxHeight: '90vh',
      panelClass: 'rs-dialog-form',
    });

    const controller: LayoutRef = {
      close: (result?: R) => ref.close(result),
    };

    ref.componentInstance.controller = controller;
    return controller;
  }
}
