import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, DestroyRef, afterNextRender, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { AppConfig } from '../../configs/app-config.model';
import { APP_CONFIG } from '../../configs/app-config.state';
import { RouterService } from '../../services/router.service';
import { DialogService } from '@rs/dialogs';

@Component({
  selector: 'rs-dialog-layout',
  templateUrl: './dialog-layout.component.html',
  styleUrls: ['./dialog-layout.component.css'],
  imports: [RouterOutlet, CommonModule],
})
export class DialogLayoutComponent implements OnInit {
  private routerService = inject(RouterService);
  private httpClient = inject(HttpClient);
  private dialogService = inject(DialogService);
  private config = inject(APP_CONFIG);
  private translate = inject(TranslateService);

  private destroyRef = inject(DestroyRef);

  private _init = afterNextRender(() => {
    if (this.destroyRef.destroyed) return;

    const ref = this.dialogService.showLoadingDialog('Loading...', false, false, { loading: true });

    ref.afterOpened().subscribe(() => {
      this.checkBackend();
      ref.close();
    });
  });

  appConfig!: AppConfig;

  error = signal(false);

  async ngOnInit() {
    this.appConfig = await this.config;
  }

  async checkBackend() {
    try {
      await firstValueFrom(
        this.httpClient.get(`${this.appConfig.baseUrl}/api/ishealthy`, { responseType: 'text' }),
      );
      this.setState();

      const ref = this.dialogService.showSuccessDialog('Backend Online!', 'Success', false, false, {
        success: true,
      });

      ref.afterOpened().subscribe(() => {
        setTimeout(() => {
          ref.close();
          this.goRedirect();
        }, 1000);
      });
    } catch (e) {
      this.setState(e);

      this.openErrorDialog(e);
    }
  }

  async setState(T?: unknown) {
    this.error.set(!!T);
  }

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
        ref.close();
        this.routerService.gotoLogin();
      }, 5000);
    });
  }
}
