import { ActivityState } from './../../shared/enums/activity-state';
import { inject, Injectable, OnDestroy } from '@angular/core';
import { from, Subscription, switchMap } from 'rxjs';
import { BaseDto } from '../../shared/models/dtos/base/base.dto';
import { APP_CONFIG } from '../../shared/configs/app-config.state';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ActivityService implements OnDestroy {
  private http = inject(HttpClient);
  private config = inject(APP_CONFIG);

  subscriptions: Subscription[] = [];

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  submit<TRequest extends BaseDto>(req: TRequest, state: ActivityState) {
    this._submit(req, state);
  }

  _submit(req: BaseDto, state: ActivityState) {
    // if(state == ActivityState.Login) {
    //   this.http.post<BaseDto>(this.baseUrl('auth', 'login'), req);
    // }

    // if(state == ActivityState.Register) {
    //   this.http.post<BaseDto>(this.baseUrl('auth', 'register'), req);
    // }
  }

  baseUrl(domain: string, action: string): string {
    var baseUrl = from(this.config).pipe(switchMap(appConfig => appConfig.baseUrl)) + 'api/';
    return `${baseUrl}/${domain}/${action}`;
  }
}
