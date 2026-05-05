import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { DialogService } from '@rs/dialogs';
import { firstValueFrom } from 'rxjs';
import { AppConfig } from '../../shared/configs/app-config.model';
import { APP_CONFIG } from '../../shared/configs/app-config.state';
import { RouterService } from '../../shared/services/router.service';
import { AuthService } from './auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AppInitializeService {
  private routerService = inject(RouterService);
  private httpClient = inject(HttpClient);
  private dialogService = inject(DialogService);
  private authService = inject(AuthService);
  private config = inject(APP_CONFIG);

  private destroyRef = inject(DestroyRef);

  isInitialized = signal(false);

  async init() {
    const appConfig = await this.config;

    const ref = this.dialogService.showLoadingDialog('Loading...', false, false, { loading: true });

    ref.afterOpened().subscribe(() => {
      setTimeout(() => {
        this.checkBackend(appConfig);
        ref.close();
      }, 1000);
    });
  }

  async checkBackend(appConfig: AppConfig) {
    try {
      await firstValueFrom(
        this.httpClient.get(`${appConfig.baseUrl}/api/ishealthy`, {
          responseType: 'text',
        }),
      );

      const ref = this.dialogService.showSuccessDialog('Backend Online!', 'Success', false, false, {
        success: true,
      });

      ref.afterOpened().subscribe(() => {
        setTimeout(() => {
          this.authService.init();
          if (!this.authService.isLoggedIn) {
            this.goRedirect();
          }

          ref.close();
        }, 1000);
      });
    } catch (e) {
      this.openErrorDialog(e);
    }
  }

  appConfig!: AppConfig;

  error = signal(false);

  openErrorDialog(T?: unknown) {
    let errorMessage = '';
    let errorCode = '';
    if (T instanceof HttpErrorResponse) {
      errorMessage = T.error.message;
      errorCode = T.status.toString();
    }

    this.dialogService.showErrorDialog(errorMessage, `Error (${errorCode})`, false, false);
  }

  goRedirect() {
    const ref = this.dialogService.showInfoDialog(
      'Redirect to Login ...',
      'Redirect',
      false,
      false,
      { loading: true },
    );

    ref.afterOpened().subscribe(() => {
      setTimeout(() => {
        this.routerService.gotoLogin();
        ref.close();
      }, 1000);
    });
  }
}
