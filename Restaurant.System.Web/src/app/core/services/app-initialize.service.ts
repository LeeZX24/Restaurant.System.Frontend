import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { CustomDialogConfig, DialogService, DialogVariant, ErrorDialogComponent, UpdatableDialogRef } from '@LeeZX24/dialogs';
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

    const ref = this.dialogService.showLoadingDialog('Loading...', false, false, { loading: true });

    await firstValueFrom(ref.afterOpened());
    
    try {
      const backendOnline = await this.checkBackend(appConfig);

      if(backendOnline) {
        console.log('Backend Online');

        ref.update({ 
          message: 'Backend Online!', 
          title: 'Success', 
          variant: DialogVariant.Success, 
          extraConfig: { success: true } 
        });

        await this.wait(1000);

        if (!this.authService.isLoggedIn) {
          await ref.update({ 
            message: 'Redirect to Login Page ...', 
            title: 'Redirect', 
            variant: DialogVariant.Info, 
            extraConfig: { loading: true } 
          });

          await this.wait(1000);

          await this.routerService.gotoLogin();

          ref.close();
        } else {
          await ref.update({ 
            message: 'Redirect to Dashboard ...', 
            title: 'Redirect', 
            variant: DialogVariant.Info, 
            extraConfig: { loading: true } 
          });

          await this.wait(1000);

          await this.routerService.navigateTo('/admin/dashboard');
          ref.close();
        }
      }
    } catch (error) {
      this.showErrorDialog(ref, error);

      // if(backendOnline) {
        

      //   await this.wait(1000);

      //   const path = !this.authService.isLoggedIn ? 'Login' : 'Admin Dashboard';

      //   this.dialogConfig = {
      //     message: `Redirect to ${path} ...`,
      //     title: 'Redirect',
      //     variant: DialogVariant.Info,
      //     extraConfig:{ loading: true }
      //   };

      //   ref.update(this.dialogConfig);

      //   await this.wait(1000);

      //   ref.ref.close();
        
        
      // }
      
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

      return {
        title: `Error (${error.status})`,
        message,
        variant: DialogVariant.Error,
        component: ErrorDialogComponent
      };
    }

    return {
      title: 'Initialization Error',
      message: 'An unexpected error occurred during startup.',
      variant: DialogVariant.Error,
      component: ErrorDialogComponent
    };
  }

  private wait(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private showErrorDialog(ref: UpdatableDialogRef, error: unknown) {
    const errorConfig = this.openErrorDialog(error);
    ref.update({
      title: errorConfig.title,
      message: errorConfig.message,
      variant: errorConfig.variant,
      extraConfig: errorConfig.extraConfig,
    });
  }
}
