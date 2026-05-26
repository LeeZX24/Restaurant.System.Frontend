export interface LayoutRef<R = unknown> {
  close(result?: R): void;
}
