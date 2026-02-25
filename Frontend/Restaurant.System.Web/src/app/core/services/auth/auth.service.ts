import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, from, Observable, switchMap } from 'rxjs';
import { UserDto } from '../../../shared/models/dtos/user.dto';
import { APP_CONFIG } from '../../../shared/configs/app-config.state';
import { BaseDto } from '../../../shared/models/dtos/base/base.dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private currentUser$ = new BehaviorSubject<UserDto | null>(null);
  private config = inject(APP_CONFIG);

  // Observable to subscribe
  currentUserObservable$ = this.currentUser$.asObservable();

  get isLoggedIn(): boolean {
    return !!this.currentUser$.value;
  }

  login<TRequest extends BaseDto>(login: TRequest): Observable<TRequest> {
    return from(this.config).pipe(
      switchMap(appConfig =>
        this.http.post<TRequest>(`${appConfig.baseUrl}/api/auth/login`, login)
      )
    );
  }

  register<TRequest extends BaseDto>(register: TRequest): Observable<TRequest> {
    return from(this.config).pipe(
      switchMap(appConfig =>
        this.http.post<TRequest>(`${appConfig.baseUrl}/api/auth/register`, register)
      )
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
    this.currentUser$.next(null);
  }
}
