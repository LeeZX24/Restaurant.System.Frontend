import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { BehaviorSubject, from, Observable, switchMap, Subscription, timer } from 'rxjs';
import { UserDto } from '../../../shared/models/dtos/user.dto';
import { APP_CONFIG } from '../../../shared/configs/app-config.state';
import { LoginRequestDto, LoginResponseDto } from '../../../shared/models/dtos/auth/login.dto';
import { LogoutRequestDto, LogoutResponseDto } from '../../../shared/models/dtos/auth/logout.dto';
import { RegisterRequestDto, RegisterResponseDto } from '../../../shared/models/dtos/auth/register.dto';
import { ChangePasswordRequestDto, ChangePasswordResponseDto } from '../../../shared/models/dtos/auth/change-password.dto';
import { createBaseRequestData } from '../../../shared/helpers/base.helper';

@Service()
export class AuthService {
  private http = inject(HttpClient);
  private currentUser$ = new BehaviorSubject<UserDto | null>(null);
  private config = inject(APP_CONFIG);

  private expirySubscription?: Subscription;

  // Observable to subscribe
  currentUserObservable$ = this.currentUser$.asObservable();

  get isLoggedIn(): boolean {
    return !!this.currentUser$.value;
  }

  async init() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const expireAt = localStorage.getItem('expireAt');

    if(!token || !user) {
      this.clearSession();
      return;
    }

    const expiry = Date.parse(expireAt || '');

    if (isNaN(expiry) || expiry < Date.now()) {
      this.clearSession();
      return;
    }
    
    try {
      const parsedUser = JSON.parse(user) as UserDto;
      this.currentUser$.next(parsedUser);
    } catch {
      this.clearSession();
    }
  }

  setAuthSession(response: LoginResponseDto) {
    const expiryTime = new Date(response.expireAt).getTime();

    if (!Number.isFinite(expiryTime) || expiryTime <= Date.now()) {
      this.clearSession();
      return;
    }

    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.userInfo));
    localStorage.setItem('expireAt', new Date(response.expireAt).toISOString());

    this.currentUser$.next(response.userInfo);
    this.scheduleExpiry(expiryTime);
  }

  private scheduleExpiry(expiryTime: number): void {
    this.expirySubscription?.unsubscribe();

    const delay = expiryTime - Date.now();

    if (delay <= 0) {
      this.clearSession();
      return;
    }

    this.expirySubscription = timer(delay).subscribe(() => {
      this.clearSession();
      // Use your existing RouterService to redirect to Login.
    });
  }

  setCurrentUser(user: UserDto) {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUser$.next(user);
  }

  getCurrentUser() {
    return this.currentUser$.asObservable();
  }

  getCurrentUserValue(): UserDto | null {
    return this.currentUser$.value;
  }
  
  clearSession(): void {
    this.expirySubscription?.unsubscribe();
    this.expirySubscription = undefined;

    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('expireAt');
    this.currentUser$.next(null);
  }

  login(login: LoginRequestDto): Observable<LoginResponseDto> {
    console.log('Login Details -> ', login);
    return from(this.config).pipe(
      switchMap((appConfig) =>
        this.http.post<LoginResponseDto>(`${appConfig.baseUrl}/api/v1/auth/login`, login),
      ),
    );
  }

  register(register: RegisterRequestDto): Observable<RegisterResponseDto> {
    return from(this.config).pipe(
      switchMap((appConfig) =>
        this.http.post<RegisterResponseDto>(`${appConfig.baseUrl}/api/v1/auth/register`, register),
      ),
    );
  }

  logout() {
    const user = this.getCurrentUserValue() as UserDto;
    const logoutRequest = { ...createBaseRequestData(), userInfo: user } as LogoutRequestDto;
    this.logout$(logoutRequest).subscribe({
      next: (res) => {
        if (res) {
          localStorage.clear();
          this.currentUser$.next(null);
        }
      },
    });
  }

  private logout$(logout: LogoutRequestDto): Observable<LogoutResponseDto> {
    return from(this.config).pipe(
      switchMap((appConfig) =>
        this.http.post<LogoutResponseDto>(`${appConfig.baseUrl}/api/v1/auth/logout`, logout),
      ),
    );
  }

  changePassword(request: ChangePasswordRequestDto): Observable<ChangePasswordResponseDto> {
    console.log('Change Password Details -> ', request);
    return from(this.config).pipe(
      switchMap((appConfig) =>
        this.http.put<ChangePasswordResponseDto>(`${appConfig.baseUrl}/api/v1/auth/change-password`, request),
      ),
    );
  }
}
