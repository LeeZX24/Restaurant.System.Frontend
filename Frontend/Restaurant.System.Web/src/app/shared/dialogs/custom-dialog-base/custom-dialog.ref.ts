import { Observable, Subject } from "rxjs";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class CustomDialogRef<T, R = unknown> {
  private readonly _afterClosed = new Subject<R | undefined>();
  private readonly _afterOpened = new Subject<void>();

  close(result?: R) {
    this._afterClosed.next(result);
    this._afterClosed.complete();
  }

  afterClosed(): Observable<R | undefined>{
    return this._afterClosed.asObservable();
  }

  afterOpened(): Observable<void> {
    return this._afterOpened.asObservable();
  }

  /** Internal: mark dialog as opened */
  _markOpened() {
    this._afterOpened.next();
    this._afterOpened.complete();
  }
}
