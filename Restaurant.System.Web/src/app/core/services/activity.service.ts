import { inject, OnDestroy, Service } from '@angular/core';
import { from, map, Subscription, switchMap, take } from 'rxjs';
import { BaseDto } from '../../shared/models/dtos/base.dto';
import { APP_CONFIG } from '../../shared/configs/app-config.state';
import { HttpClient } from '@angular/common/http';
import { DialogService } from '@LeeZX24/dialogs';

@Service()
export class ActivityService implements OnDestroy {
  private http = inject(HttpClient);
  private config = inject(APP_CONFIG);
  private dialogService = inject(DialogService);

  subscriptions: Subscription[] = [];

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  submit<TRequest extends BaseDto>(req: TRequest) {
    this._submit(req);
  }

  async _submit(req: BaseDto) {
    const ref = this.dialogService.showLoadingDialog('Submitting request ...', false, false, {
      loading: true,
    });

    // Wait for the dialog to open, then trigger the URL resolution and POST
    ref.afterOpened().subscribe(() => {
      // We don't need "base" here. We use the "url" from the pipe.
      this.baseUrl(req.requestDetails.route, req.requestDetails.action)
        .pipe(
          switchMap((url) => {
            if (!url.startsWith('http')) {
              console.error('URL is invalid:', url);
            }
            return this.http.post<BaseDto>(url, req);
          }),
        )
        .subscribe({
          next: (res) => {
            console.log('Success', res);
            ref.close();
          },
          error: (err) => {
            console.error('Error', err);
            ref.close();
          },
        });
    });
  }

  baseUrl(domain: string, action: string) {
    return from(this.config).pipe(
      map((config) => {
        const url = config.baseUrl;
        return `${url}/api/${domain}/${action}`;
      }),
      take(1),
    );
  }
}
