import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { CustomDialogService } from '../../../core/services/custom-dialog/custom-dialog.service';
import { CustomDialogRef } from '../../dialogs/custom-dialog-base/custom-dialog.ref';
import { ErrorDialogComponent } from '../../dialogs/customs-dialogs/error-dialog/error-dialog.component';
import { InformationDialogComponent } from '../../dialogs/customs-dialogs/information-dialog/information-dialog.component';
import { RouterService } from '../../services/router.service';
import { APP_CONFIG } from '../../configs/app-config.state';
import { AppConfig } from '../../configs/app-config.model';

@Component({
  selector: 'rs-dialog-layout',
  templateUrl: './dialog-layout.component.html',
  styleUrls: ['./dialog-layout.component.css'],
  imports: [RouterOutlet, CommonModule]
})
export class DialogLayoutComponent implements OnInit {
  private routerService = inject(RouterService);
  private httpClient = inject(HttpClient);
  private dialogService = inject(CustomDialogService);
  private config = inject(APP_CONFIG);

  appConfig!: AppConfig;

  error = signal(false);

  async ngOnInit() {
    this.appConfig = await this.config;
    setTimeout(() => {
      const ref = this.dialogService.open(InformationDialogComponent, {
        data: { title: 'Information', message: 'Checking Backend ...' },
        hasHeader: true,
        hasFooter: false,
        closeOnBackdropClick: false,
        disableClose: true,
        isLoading: true
      });


      ref.afterOpened().subscribe(() => {
        this.checkBackend(ref);
      });
    });

  }

  async checkBackend(ref: CustomDialogRef<void>) {
    try {
      await firstValueFrom(this.httpClient.get(`${this.appConfig.baseUrl}/api/ishealthy`, { responseType: 'text' }));
      this.setState();

      this.openSuccessDialog();
    } catch (e) {
      this.setState(e);

      this.openErrorDialog(e);
    }
    finally {
      ref.close();
    }
  }

  async setState(T?: unknown) {
    this.error.set(!!T);
  }

  openErrorDialog(T?: unknown) {
    let errorMessage = '';
    let errorCode = '';
    if (T instanceof HttpErrorResponse) {
      errorMessage = T.message;
      errorCode = T.status.toString();
    }
    this.dialogService.open(ErrorDialogComponent, {
      data: { title: 'Error', message: errorMessage + '\nError Code : ' + errorCode },
      variant: 'error',
      hasHeader: true,
      hasFooter: false,
      closeOnBackdropClick: false,
      disableClose: true
    });
  }

  openSuccessDialog() {
    const successRef = this.dialogService.open(InformationDialogComponent, {
      data: { title: 'Success', message: 'Backend Online!' },
      variant: 'success',
      hasHeader: true,
      hasFooter: false,
      closeOnBackdropClick: false,
      disableClose: true,
      isSuccess: true
    });

    successRef.afterOpened().subscribe(() => {
      setTimeout(() => {
        successRef.close();
        this.goRedirect();
      }, 1000);

    });
  }

  goRedirect() {
    const redirectRef = this.dialogService.open(InformationDialogComponent, {
      data: { title: 'Redirect', message: 'redirect to login page ...' },
      variant: 'success',
      hasHeader: true,
      hasFooter: false,
      closeOnBackdropClick: false,
      disableClose: true,
      isLoading: true
    });

    redirectRef.afterOpened().subscribe(() => {
      setTimeout(() => {
        redirectRef.close();
        this.routerService.gotoLogin();
      }, 5000);
    });
  }
}
