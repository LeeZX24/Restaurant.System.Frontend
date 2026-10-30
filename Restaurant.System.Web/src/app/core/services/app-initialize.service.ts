import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { CustomDialogConfig, DialogService, DialogVariant, UpdatableDialogRef } from '@LeeZX24/dialogs';
import { firstValueFrom } from 'rxjs';
import { AppConfig } from '../../shared/configs/app-config.model';
import { APP_CONFIG } from '../../shared/configs/app-config.state';
import { RouterService } from '../../shared/services/router.service';
import { AuthService } from './auth/auth.service';

@Service()
export class AppInitializeService {
  private routerService = inject(RouterService);
  private httpClient = inject(HttpClient);
  private dialogService = inject(DialogService);
  private authService = inject(AuthService);
  private config = inject(APP_CONFIG);

  private initPromise?: Promise<void>;
  private hasShownUI = false;

  private dialogConfig!: CustomDialogConfig;

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

    const ref = await this.dialogService.showLoadingDialog('Checking Backend...');

    await firstValueFrom(ref.afterOpened());

    try {
      const backendOnline = await this.checkBackend(appConfig);

      if(backendOnline) {
        const successConfig = this.dialogService.getDialogConfig(DialogVariant.Success, { success: true, footerEnable: false });

        await this.dialogService.updateDialog(ref, { ...successConfig, title: 'Success', message: 'Backend Online!', });

        await this.wait(500);

        const loadingConfig = this.dialogService.getDialogConfig(DialogVariant.Info, { loading: true });

        await this.dialogService.updateDialog(ref, { ...loadingConfig, title: 'Initializing', message: 'Resolving application route...' });

        await this.routerService.resolveEntryPoint();

        await this.wait(500);

        ref.close();
      }
    } catch (error) {
      this.showErrorDialog(ref, error);
    }
  }

  async checkBackend(appConfig: AppConfig) {
    try {
      await firstValueFrom(
        this.httpClient.get(`${appConfig.baseUrl}/api/ishealthy`, {
          responseType: 'text',
        }),
      );

      await this.authService.init();

      return true;
    } catch (e) {
      this.dialogConfig = this.openErrorDialog(e);
      return false;
    }
  }

  appConfig!: AppConfig;

  error = signal(false);

  openErrorDialog(error: unknown): CustomDialogConfig {
    if (error instanceof HttpErrorResponse) {
      const message =
        typeof error.error === 'object' &&
        error.error !== null &&
        'message' in error.error &&
        typeof error.error.message === 'string'
          ? error.error.message
          : error.message;

      return this.dialogService.getDialogConfig(DialogVariant.Error, { title: `Error (${error.status})`, message });
    }

    return this.dialogService.getDialogConfig(DialogVariant.Error, {
      title: 'Initialization Error',
      message: 'An unexpected error occurred during startup.',
    });
  }

  private wait(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private showErrorDialog(ref: UpdatableDialogRef, error: unknown) {
    const errorConfig = this.openErrorDialog(error);
    this.dialogService.updateDialog(ref, errorConfig);
  }
}
