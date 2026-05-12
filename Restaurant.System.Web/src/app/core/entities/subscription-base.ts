import { Subject } from "rxjs";

export abstract class SubscriptionBase {
  public destroy$ = new Subject<boolean>();

  constructor() {
    this.destroy$.next(true);
  }

  protected destroySubs() {
    this.destroy$.next(false);
    this.destroy$.complete();
  }
}
