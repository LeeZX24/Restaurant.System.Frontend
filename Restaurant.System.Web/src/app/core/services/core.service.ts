import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { APP_CONFIG } from '../../shared/configs/app-config.state';
import { BaseDto } from '../../shared/models/dtos/base/base.dto';
import { from, Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CoreService {
  private http = inject(HttpClient);
  private config = inject(APP_CONFIG);

  getList<TRequest extends BaseDto>(route: string, action: string): Observable<TRequest[]> {
    return from(this.config).pipe(
      switchMap((appConfig) =>
        this.http.get<TRequest[]>(`${appConfig.baseUrl}/api/${route}/${action}`),
      ),
    );
  }

  removeItem<TRequest extends BaseDto>(
    route: string,
    action: string,
    item: TRequest,
  ): Observable<TRequest> {
    return from(this.config).pipe(
      switchMap((appConfig) =>
        this.http.post<TRequest>(`${appConfig.baseUrl}/api/${route}/${action}`, item),
      ),
    );
  }

  addNewItem<TRequest extends BaseDto>(
    route: string,
    action: string,
    item: TRequest,
  ): Observable<TRequest> {
    return from(this.config).pipe(
      switchMap((appConfig) =>
        this.http.post<TRequest>(`${appConfig.baseUrl}/api/${route}/${action}`, item),
      ),
    );
  }

  updateCurrentItem<TRequest extends BaseDto>(
    route: string,
    action: string,
    item: TRequest,
  ): Observable<TRequest> {
    return from(this.config).pipe(
      switchMap((appConfig) =>
        this.http.post<TRequest>(`${appConfig.baseUrl}/api/${route}/${action}`, item),
      ),
    );
  }
}
