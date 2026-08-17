import { Service } from '@angular/core';

@Service()
export class FlipService {
  private positions = new Map<string, DOMRect>();

  save(id: string, el: HTMLElement) {
    this.positions.set(id, el.getBoundingClientRect());
  }

  get(id: string) {
    return this.positions.get(id);
  }
}
