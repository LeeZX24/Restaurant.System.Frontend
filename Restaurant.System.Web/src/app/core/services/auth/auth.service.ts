import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { BehaviorSubject, from, Observable, switchMap } from 'rxjs';
import { UserDto } from '../../../shared/models/dtos/user.dto';
import { APP_CONFIG } from '../../../shared/configs/app-config.state';
import { LoginRequestDto, LoginResponseDto } from '../../../shared/models/dtos/auth/login.dto';
import { LogoutRequestDto, LogoutResponseDto } from '../../../shared/models/dtos/auth/logout.dto';
import { RegisterRequestDto, RegisterResponseDto } from '../../../shared/models/dtos/auth/register.dto';

@Service()
export class AuthService {
  private http = inject(HttpClient);
  private currentUser$ = new BehaviorSubject<UserDto | null>(null);
  private config = inject(APP_CONFIG);

  // Observable to subscribe
  currentUserObservable$ = this.currentUser$.asObservable();

  get isLoggedIn(): boolean {
    return !!this.currentUser$.value;
  }

  init() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
      this.currentUser$.next(JSON.parse(user));
    }
  }

  login(login: LoginRequestDto): Observable<LoginResponseDto> {
    console.log('Login Details -> ', login);
    return from(this.config).pipe(
      switchMap((appConfig) =>
        this.http.post<LoginResponseDto>(`${appConfig.baseUrl}/api/auth/login`, login),
      ),
    );
  }

  register(register: RegisterRequestDto): Observable<RegisterResponseDto> {
    return from(this.config).pipe(
      switchMap((appConfig) =>
        this.http.post<RegisterResponseDto>(`${appConfig.baseUrl}/api/auth/register`, register),
      ),
    );
  }

  private logout$(logout: LogoutRequestDto): Observable<LogoutResponseDto> {
    return from(this.config).pipe(
      switchMap((appConfig) =>
        this.http.post<LogoutResponseDto>(`${appConfig.baseUrl}/api/auth/logout`, logout),
      ),
    );
  }

  setCurrentUser(user: UserDto) {
    this.currentUser$.next(user);
  }

  getCurrentUser() {
    return this.currentUser$.asObservable();
  }

  getCurrentUserValue(): UserDto | null {
    return this.currentUser$.value;
  }

  logout() {
    const user = this.getCurrentUserValue() as UserDto;
    const logoutRequest = { userInfo: user, userAgent: navigator.userAgent, appVersion: '1.0.0' } as LogoutRequestDto;
    this.logout$(logoutRequest).subscribe({
      next: (res) => {
        if (res) {
          localStorage.clear();
          this.currentUser$.next(null);
        }
      },
    });
  }
}
