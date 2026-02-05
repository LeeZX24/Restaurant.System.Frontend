import { RouterService } from './../../services/router.service';
import { CustomFormGroup } from '@rs/forms';
import { Directive, inject, OnDestroy, OnInit } from '@angular/core';
import { BaseComponent } from '../base-component/base-component';
import { UserDto } from '../../models/dtos/user.dto';
import { AuthService } from '../../../core/services/auth/auth.service';
import { CustomDialogService } from '../../../core/services/custom-dialog/custom-dialog.service';
import { InformationDialogComponent } from '../../dialogs/customs-dialogs/information-dialog/information-dialog.component';
import { ErrorDialogComponent } from '../../dialogs/customs-dialogs/error-dialog/error-dialog.component';

@Directive()
export abstract class BaseAuthComponent<TRequest extends UserDto> extends BaseComponent<TRequest> implements OnInit, OnDestroy {
  private routerService = inject(RouterService);
  private authService = inject(AuthService);
  private dialogService = inject(CustomDialogService);

  protected abstract createForm(): CustomFormGroup;

  ngOnInit(): void {
    this.form = this.createForm();
  }

  submit<TRequest extends UserDto>(req: TRequest) {
    const dialogRef = this.dialogService.open(InformationDialogComponent, {
      data: { title: 'Login', message: 'Login the user ...'},
      variant: 'info',
      hasHeader: false,
      hasFooter: false,
      disableClose: true,
      closeOnBackdropClick: false,
      isLoading: true
    });

    dialogRef.afterOpened().subscribe(() => {
      setTimeout(async () => {
        dialogRef.close();
        const login$ = await this.authService.login(req);
        login$.subscribe({
          next: (res) => this.handleLoginSuccess(res),
          error: (err) => this.handleLoginError(err)
        });
      }, 5000);
    })
  }

  private handleLoginSuccess(res: UserDto) {

    if(res != null) {

      if(res.token) {
        // 1. Save token (if backend returned it)
        localStorage.setItem('token', res.token);

        // 2. Tell the auth service the user is logged in
        this.authService.setCurrentUser(res);

        const dialogRef = this.dialogService.open(InformationDialogComponent, {
          data: { title: 'Login Success', message: 'Login success.'},
          variant: 'success',
          hasHeader: false,
          hasFooter: true,
          disableClose: true,
          closeOnBackdropClick: false,
        });

        dialogRef.afterOpened().subscribe();
      }
    }
    // 3. Redirect
    // this.router.navigate(['/']);
  }

  private handleLoginError(err: unknown) {
    const dialogRef = this.dialogService.open(ErrorDialogComponent, {
      data: { title: 'Login Error', message: err},
      variant: 'error',
      hasHeader: false,
      hasFooter: true,
      disableClose: true,
      closeOnBackdropClick: false
    });

    dialogRef.afterOpened().subscribe();
  }

  protected redirectRegister() {
    this.routerService.gotoRegister();
  }

  protected redirectLogin() {
    this.routerService.gotoLogin();
  }
}
