import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cast',
  standalone: true,
})
export class CastPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform<T>(value: unknown, type: T): T {
    return value as T;
  }
}
