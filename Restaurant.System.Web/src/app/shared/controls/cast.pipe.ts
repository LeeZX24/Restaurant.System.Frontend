import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cast',
  standalone: true,
})
export class CastPipe implements PipeTransform {
  transform<T>(value: unknown, type: T): T {
    return value as T;
  }
}
