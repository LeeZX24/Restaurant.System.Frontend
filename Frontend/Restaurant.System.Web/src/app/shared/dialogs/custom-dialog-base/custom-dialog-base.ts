// eslint-disable-next-line @typescript-eslint/no-unused-vars
export abstract class CustomDialogBase<T = unknown> {
  abstract close(result?: unknown): void;
}
