
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserDto } from '../../../shared/models/dtos/user.dto';
import { getRuntimeBaseUrl } from '../../../utils/runtime-env';
// import { CustomerDto } from '../../../pages/customer/customer.dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // private readonly baseUrl = 'https://vigilant-fiesta-q7644xj6wqgwh657j-5000.app.github.dev';
  private readonly baseUrl = getRuntimeBaseUrl();
  private http = inject(HttpClient);
  private currentUser$ = new BehaviorSubject<UserDto | null>(null);

  // Observable to subscribe
  currentUserObservable$ = this.currentUser$.asObservable();

  login(user: UserDto): Observable<UserDto> {
    return this.http.post<UserDto>(this.baseUrl + '/api/auth/login', user);
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
