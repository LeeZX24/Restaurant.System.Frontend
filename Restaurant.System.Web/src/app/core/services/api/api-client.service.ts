import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { from, Observable, switchMap } from 'rxjs';
import { APP_CONFIG } from '../../../shared/configs/app-config.state';

@Service()
export class ApiClientService {
  private http = inject(HttpClient);
  private config = inject(APP_CONFIG);

  private async url(route: string, action?: string): Promise<string> {
    return await this.config.then(config => {
        const baseUrl = `${config.baseUrl}/api/${route}`;
        return action ? `${baseUrl}/${action}` : baseUrl;
      });
  }

  get<TResponse>(route: string, action: string): Observable<TResponse> {
    return from(this.url(route, action)).pipe(switchMap(url => this.http.get<TResponse>(url)));
  }

  post<TRequest, TResponse>(route: string, action: string, body: TRequest): Observable<TResponse> {
    return from(this.url(route, action)).pipe(switchMap(url => this.http.post<TResponse>(url, body)));
  }

  put<TRequest, TResponse>(route: string, action: string, body: TRequest): Observable<TResponse> {
    return from(this.url(route, action)).pipe(switchMap(url => this.http.post<TResponse>(url, body)));
  }

  delete<TRequest, TResponse>(route: string, action: string, body: TRequest): Observable<TResponse> {
    return from(this.url(route, action)).pipe(switchMap(url => this.http.post<TResponse>(url, body)));
  }
}
