import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
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

  private initPromise?: Promise<void>;
  private hasShownUI = false;

  init(): Promise<void> {
    if (!this.initPromise) {
      this.initPromise = this.runInit();
    }

    return this.initPromise;
  }

  private async runInit(): Promise<void> {
    if (this.hasShownUI) return;
    this.hasShownUI = true;

    const appConfig = await this.config;

    const ref = this.dialogService.showLoadingDialog('Loading...', false, false, { loading: true });

    await this.wait(1000);

    ref.close();

    await this.checkBackend(appConfig);
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

      this.authService.init();

      await this.wait(1000);

      ref.close();

      this.goRedirect();
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

  async goRedirect() {
    const path = !this.authService.isLoggedIn ? 'Login' : 'Admin Dashboard';

    const ref = this.dialogService.showInfoDialog(
      `Redirect to ${path} ...`,
      'Redirect',
      false,
      false,
      { loading: true },
    );

    await this.wait(1000);

    ref.close();

    if (!this.authService.isLoggedIn) {
      this.routerService.gotoLogin();
    } else {
      this.routerService.navigateTo('/admin/dashboard');
    }
  }

  private wait(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
