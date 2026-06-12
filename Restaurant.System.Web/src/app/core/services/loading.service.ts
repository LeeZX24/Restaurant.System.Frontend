import { Service, signal } from '@angular/core';

@Service()
export class LoadingService {
  private activeRequest = 0;

  loading$ = signal(false);

  startLoading() {
    this.activeRequest++;
    this.loading$.set(true);
  }

  stopLoading() {
    this.activeRequest--;
    if (this.activeRequest <= 0) {
      this.activeRequest = 0;
      this.loading$.set(false);
    }
  }
}
