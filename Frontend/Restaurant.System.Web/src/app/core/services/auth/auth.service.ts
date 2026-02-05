
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserDto } from '../../../shared/models/dtos/user.dto';
import { APP_CONFIG } from '../../../shared/configs/app-config.token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private currentUser$ = new BehaviorSubject<UserDto | null>(null);
  private config = inject(APP_CONFIG);

  // Observable to subscribe
  currentUserObservable$ = this.currentUser$.asObservable();

  login(user: UserDto): Observable<UserDto> {
    console.log(`Login API Url: ${this.config.baseUrl}/api/auth/login`);
    return this.http.post<UserDto>(`${this.config.baseUrl}/api/auth/login`, user);
  }

  // register(user: CustomerDto) {
  //   return this.http.post(this.baseUrl + '/api/auth/register', user); ;
  // }

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
