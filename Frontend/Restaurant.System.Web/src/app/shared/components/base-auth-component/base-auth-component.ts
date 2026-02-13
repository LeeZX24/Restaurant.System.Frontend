import { Directive, OnInit, OnDestroy, inject } from "@angular/core";
import { CustomFormGroup } from "@rs/forms";
import { AuthService } from "../../../core/services/auth/auth.service";
import { CustomDialogService } from "../../../core/services/custom-dialog/custom-dialog.service";
import { ErrorDialogComponent } from "../../dialogs/customs-dialogs/error-dialog/error-dialog.component";
import { InformationDialogComponent } from "../../dialogs/customs-dialogs/information-dialog/information-dialog.component";
import { RouterService } from "../../services/router.service";
import { BaseComponent } from "../base-component/base-component";
import { UserDto } from "../../models/dtos/user.dto";
import { ActivityState } from "../../enums/activity-state";
import { HttpErrorResponse } from "@angular/common/http";


@Directive()
export abstract class BaseAuthComponent<TRequest extends UserDto> extends BaseComponent<TRequest> implements OnInit, OnDestroy {
  private routerService = inject(RouterService);
  private authService = inject(AuthService);
  private dialogService = inject(CustomDialogService);

  protected abstract createForm(): CustomFormGroup;

  ngOnInit(): void {
    this.form = this.createForm();
  }

  override onSubmit(): void {
    if(!this.form.valid) return;

    if(this.onValidateForm()) {
      const req = this.RequestDetails() as TRequest;
      if(req.state === ActivityState.Login) {
        this.submitLogin(req);
      }

      if(req.state === ActivityState.Register) {
        this.submitRegister(req);
      }

    } else {
      this.showFormControlsValidationErrors();
    }
  }

  submitRegister(req:TRequest) {
    const dialogRef = this.dialogService.open(InformationDialogComponent, {
      data: { title: 'Login', message: 'Registering user ...'},
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
        const register$ = this.authService.register(req);
        register$.subscribe({
          next: (res) => this.handleRegisterSuccess(res),
          error: (err) => this.handleRegisterError(err)
        });
      }, 5000);
    })
  }

  submitLogin(req: TRequest) {
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
        const login$ = this.authService.login(req);
        login$.subscribe({
          next: (res) => this.handleLoginSuccess(res),
          error: (err) => this.handleLoginError(err)
        });
      }, 5000);
    })
  }

  private handleRegisterSuccess(res: TRequest) {
    if(res != null) {

      if(res.token) {
        const dialogRef = this.dialogService.open(InformationDialogComponent, {
          data: { title: 'Register Success', message: 'Register success.'},
          variant: 'success',
          hasHeader: false,
          hasFooter: true,
          disableClose: true,
          closeOnBackdropClick: false,
        });

        dialogRef.afterOpened().subscribe(() => {
          setTimeout(this.routerService.gotoLogin, 5000);
        });
      }
    }
  }

  private handleLoginSuccess(res: TRequest) {

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

  private handleRegisterError(err: unknown) {
    let errorMessage = '';

    if(err instanceof HttpErrorResponse) {
      errorMessage = err.error.message;
    }

    const dialogRef = this.dialogService.open(ErrorDialogComponent, {
      data: { title: 'Register Error', message: errorMessage },
      variant: 'error',
      hasHeader: false,
      hasFooter: true,
      disableClose: true,
      closeOnBackdropClick: false
    });

    dialogRef.afterOpened().subscribe();
  }

  private handleLoginError(err: unknown) {
    let errorMessage = '';

    if(err instanceof HttpErrorResponse) {
      errorMessage = err.error.message;
    }

    const dialogRef = this.dialogService.open(ErrorDialogComponent, {
      data: { title: 'Login Error', message: errorMessage },
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
