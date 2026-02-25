import { firstValueFrom } from 'rxjs';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { TranslateService } from '@ngx-translate/core';


const app = await bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
// test

if(app) {
  const translate = app.injector.get(TranslateService);
  await firstValueFrom(translate.use('en'));
}
