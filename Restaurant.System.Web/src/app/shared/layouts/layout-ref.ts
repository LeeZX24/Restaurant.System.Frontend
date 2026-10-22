import { Observable } from "rxjs";

export interface LayoutRef<R = unknown> {
  close: (result?: R) => void;
  afterClosed: (result?: R) => Observable<R | undefined>;
}
