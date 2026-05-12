import { Directive, OnInit, OnDestroy, inject } from '@angular/core';
import { CustomFormGroup } from '@rs/forms';
import { AuthService } from '../../../core/services/auth/auth.service';
import { RouterService } from '../../services/router.service';
import { BaseComponent } from '../base-component';
import { UserDto } from '../../models/dtos/user.dto';
import { ActivityState } from '../../enums/activity-state';
import { HttpErrorResponse } from '@angular/common/http';
import { DialogService } from '@rs/dialogs';

@Directive()
export abstract class BaseAuthComponent<TRequest extends UserDto>
  extends BaseComponent<TRequest>
  implements OnInit, OnDestroy
{
  private routerService = inject(RouterService);
  private authService = inject(AuthService);
  private dialogService = inject(DialogService);

  protected abstract createForm(): CustomFormGroup;

  ngOnInit(): void {
    this.form = this.createForm();
  }

  override onSubmit(): void {
    if (!this.form.valid) return;

    if (this.onValidateForm()) {
      const req = this.RequestDetails() as TRequest;
      if (req.state === ActivityState.Login) {
        this.submitLogin(req);
      }

      if (req.state === ActivityState.Register) {
        this.submitRegister(req);
      }
    } else {
      this.showFormControlsValidationErrors();
    }
  }

  submitRegister(req: TRequest) {
    const ref = this.dialogService.showInfoDialog('Registering User...', 'Register', false, false, {
      loading: true,
    });

    ref.afterOpened().subscribe(() => {
      setTimeout(async () => {
        const register$ = this.authService.register(req);
        register$.subscribe({
          next: (res) => this.handleRegisterSuccess(res),
          error: (err) => this.handleRegisterError(err),
        });
        ref.close();
      }, 1000);
    });
  }

  submitLogin(req: TRequest) {
    const ref = this.dialogService.showInfoDialog('Login User...', 'Login', false, false, {
      loading: true,
    });

    ref.afterOpened().subscribe(() => {
      setTimeout(async () => {
        const login$ = this.authService.login(req);
        login$.subscribe({
          next: (res) => this.handleLoginSuccess(res),
          error: (err) => this.handleLoginError(err),
        });
        ref.close();
      }, 1000);
    });
  }

  private handleRegisterSuccess(res: TRequest) {
    if (res != null) {
      if (res.token) {
        const ref = this.dialogService.showSuccessDialog(
          'Register Success. Please proceed Login',
          'Register Success',
          false,
          false,
          { success: true },
        );

        ref.afterOpened().subscribe(() => {
          setTimeout(() => {
            this.routerService.gotoLogin();
            ref.close();
          }, 1000);
        });
      }
    }
  }

  private handleLoginSuccess(res: TRequest) {
    if (res != null) {
      if (res.token) {
        // 1. Save token (if backend returned it)
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res));

        // 2. Tell the auth service the user is logged in
        this.authService.setCurrentUser(res);

        const ref = this.dialogService.showSuccessDialog(
          'Login Success. Redirecting to dashboard',
          'Login Success',
          false,
          true,
          { success: true },
        );

        ref.afterOpened().subscribe(() => {
          setTimeout(() => {
            this.routerService.navigateTo('/admin/dashboard', { skipLocationChange: true });
            ref.close();
          }, 1000);
        });
      }
    }
    // 3. Redirect
    // this.router.navigate(['/']);
  }

  private handleRegisterError(err: unknown) {
    let errorMessage = '';

    if (err instanceof HttpErrorResponse) {
      errorMessage = err.error.message;
    }

    this.dialogService.showErrorDialog(errorMessage, 'Register Error', false, true);
  }

  private handleLoginError(err: unknown) {
    let errorMessage = '';

    if (err instanceof HttpErrorResponse) {
      errorMessage = err.error.message;
    }

    this.dialogService.showErrorDialog(errorMessage, 'Login Error', false, true);
  }

  protected redirectRegister() {
    this.routerService.gotoRegister();
  }

  protected redirectLogin() {
    this.routerService.gotoLogin();
  }
}
