import { TranslateService } from '@ngx-translate/core';
import { inject, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'errorConverter',
})
export class ErrorConverterPipe implements PipeTransform {
  private translateService = inject(TranslateService);

  transform(value: string, ...args: unknown[]) {
    void args;
    if (!value) {
      return '';
    }

    const arr: string[] = value.split(';');
    if (arr.length === 1) {
      return value;
    }

    const errorMsg: string = this.translateService.instant(arr[0]);
    const label: string = this.translateService.instant(arr[1]);
    const error: string = ErrorConverterPipe.stringFormat(errorMsg, label, arr[2]);
    return error;
  }

  private static stringFormat(str: string, ...args: string[]): string {
    const replaced: string = str.replace(/{(\d+)}/g, (match, index) => args[index] || '');
    return replaced;
  }

}
