import { CommonModule } from "@angular/common";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit, inject, DestroyRef, afterNextRender, signal } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { RouterOutlet } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { firstValueFrom } from "rxjs";
import { AppConfig } from "../../configs/app-config.model";
import { APP_CONFIG } from "../../configs/app-config.state";
import { ErrorDialogComponent } from "../../dialogs/customs-dialogs/error-dialog/error-dialog.component";
import { InformationDialogComponent } from "../../dialogs/customs-dialogs/information-dialog/information-dialog.component";
import { RouterService } from "../../services/router.service";

@Component({
  selector: 'rs-dialog-layout',
  templateUrl: './dialog-layout.component.html',
  styleUrls: ['./dialog-layout.component.css'],
  imports: [RouterOutlet, CommonModule]
})
export class DialogLayoutComponent implements OnInit {
  private routerService = inject(RouterService);
  private httpClient = inject(HttpClient);
  private dialogService = inject(MatDialog);
  private config = inject(APP_CONFIG);
  private translate = inject(TranslateService);

  private destroyRef = inject(DestroyRef);

  private _init = afterNextRender(() => {
    if (this.destroyRef.destroyed) return;

    const ref = this.dialogService.open(InformationDialogComponent, { disableClose: false });

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
      await firstValueFrom(this.httpClient.get(`${this.appConfig.baseUrl}/api/ishealthy`, { responseType: 'text' }));
      this.setState();

      this.openSuccessDialog();
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
    this.dialogService.open(ErrorDialogComponent, {
      
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
