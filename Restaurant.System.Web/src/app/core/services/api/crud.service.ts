import { inject, Service } from '@angular/core';
import { ApiClientService } from './api-client.service';

@Service()
export abstract class CrudService {
  protected abstract readonly route: string;
  protected readonly api = inject(ApiClientService);

  create<TRequest, TResponse>(item: TRequest) {
    return this.api.post<TRequest, TResponse>(this.route, 'create', item);
  }

  read<TResponse>() {
    return this.api.get<TResponse[]>(this.route, 'list');
  }

  update<TRequest, TResponse>(item: TRequest) {
    return this.api.put<TRequest, TResponse>(this.route, 'update', item);
  }

  delete<TRequest, TResponse>(item: TRequest) {
    return this.api.delete<TRequest, TResponse>(this.route, 'remove', item);
  }
}
