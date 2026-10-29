import { inject, Service } from '@angular/core';
import { ApiClientService } from './api-client.service';
import { DropdownDto } from '../../../shared/models/dtos/dropdown.dto';
import { DropdownModel } from '../../../shared/models/dropdown.model';
import { BehaviorSubject, map, of, tap } from 'rxjs';

@Service()
export class DropdownService {
  protected readonly route: string = 'dropdown';
  protected readonly api = inject(ApiClientService);

  private readonly dropdownCache$ = new BehaviorSubject<Record<string, DropdownModel[]>>({});

  getDropdownList() {
    return this.api.get<DropdownDto[]>(this.route, 'get').pipe(
      map((dtos)=> this.toDropdownModels(dtos)),);
  }

  getCategoryList() {
    const cacheKey = 'category';
    const cached = this.dropdownCache$.value[cacheKey];

    if(cached) return of(cached);

    return this.api.get<DropdownDto[]>(this.route, 'get')
      .pipe(
        map(x => { return this.toCategoryModel(x)}),
        tap(models => {
          this.dropdownCache$.next({
            ...this.dropdownCache$.value,
            [cacheKey]: models
          })
        })
      );
  }

  getDropdownListByCategory(category: string) {
    const cacheKey = 'code';
    const cached = this.dropdownCache$.value[cacheKey];

    if(cached) { return of(cached); }

    return this.api.post<string, DropdownDto[]>(this.route, 'getbycategory', category).pipe(
        map(x => { return this.toCategoryModel(x)}),
        tap(models => {
          this.dropdownCache$.next({
            ...this.dropdownCache$.value,
            [cacheKey]: models
          })
        })
      );
  }

  getDropdownListByCategoryTags(category: string, tags: string) {
    const cacheKey = 'code';
    const cached = this.dropdownCache$.value[cacheKey];

    if(cached) { return of(cached); }

    return this.api.post<{ category: string, tags: string }, DropdownDto[]>(this.route, 'getbycategorytags', {category: category, tags: tags}).pipe(
        map(x => { return this.toCategoryModel(x)}),
        tap(models => {
          this.dropdownCache$.next({
            ...this.dropdownCache$.value,
            [cacheKey]: models
          })
        })
      );
  }

  private toDropdownModels(dtos: DropdownDto[]): DropdownModel[] {
    return dtos
      .map((dd): DropdownModel => ({
        key: dd.code,
        value: dd.description,
        order: dd.seqNo.toString(),
      }))
      .sort((a, b) => Number(a.order) - Number(b.order));
  }

  private toCategoryModel(dtos: DropdownDto[]): DropdownModel[] {
    return dtos
      .map((dd): DropdownModel => ({
        key: dd.category,
        value: dd.category,
        order: dd.seqNo.toString(),
      }))
      .sort((a, b) => Number(a.order) - Number(b.order));
  }
}
