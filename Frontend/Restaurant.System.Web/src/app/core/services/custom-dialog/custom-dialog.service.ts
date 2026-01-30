import { ApplicationRef, ComponentRef, createComponent, EnvironmentInjector, inject, Injectable, Injector, PLATFORM_ID, Type } from '@angular/core';
import { DIALOG_VARIANT } from '../../../shared/dialogs/custom-dialog-base/custom-dialog-variant';
import { CustomDialogConfig } from '../../../shared/dialogs/custom-dialog-base/custom-dialog.config';
import { CustomDialogRef } from '../../../shared/dialogs/custom-dialog-base/custom-dialog.ref';
import { CustomDialogBaseComponent } from '../../../shared/dialogs/custom-dialog-base/custom-dialog-base.component';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class CustomDialogService {
  appRef = inject(ApplicationRef);
  rootInjector = inject(Injector);
  envInjector = inject(EnvironmentInjector);
  platformId = inject(PLATFORM_ID);

  open<TComponent extends object, R = unknown, D = unknown>(
    component: Type<TComponent>,
    config?: CustomDialogConfig<D>
  ): CustomDialogRef<R> {
    const dialogRef = new CustomDialogRef<R>();

    const dialogInjector = Injector.create({
      providers: [
        { provide: CustomDialogRef, useValue: dialogRef },
        { provide: CustomDialogConfig, useValue: config },
        { provide: DIALOG_VARIANT, useValue: config?.variant ?? 'info' }
      ],
      parent: this.rootInjector,
    });

    // Create container
    const containerRef: ComponentRef<CustomDialogBaseComponent> =
      createComponent(CustomDialogBaseComponent, {
        environmentInjector: this.envInjector,
        elementInjector: dialogInjector
      });

    // Create content component
    const contentRef: ComponentRef<TComponent> = createComponent(component, {
      environmentInjector: this.envInjector,
      elementInjector: dialogInjector
    });

    // Project content into container
    containerRef.instance.contentHost.insert(contentRef.hostView);

    if(isPlatformBrowser(this.platformId))
    {
      // Attach views
      this.appRef.attachView(containerRef.hostView);
      document.body.appendChild(containerRef.location.nativeElement);
    }

    Promise.resolve().then(() => {
      dialogRef._markOpened();
    });

    // Cleanup on close
    dialogRef.afterClosed().subscribe(() => {
      this.appRef.detachView(contentRef.hostView);
      this.appRef.detachView(containerRef.hostView);
      containerRef.destroy();
      contentRef.destroy();
    });

    return dialogRef;
  }
}
