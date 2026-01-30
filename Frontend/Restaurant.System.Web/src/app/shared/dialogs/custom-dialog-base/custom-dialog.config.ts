export type DialogVariant =
  | 'info'
  | 'error'
  | 'success'
  | 'warning'
  | 'confirmation';

export class CustomDialogConfig<T = unknown> {
  disableClose? = false;
  closeOnBackdropClick? = true;

  data?: T;
  variant?: DialogVariant = 'info';

  hasHeader? = true;
  hasFooter? = true;

  isLoading? = false;
  isSuccess? = false;
  isFailed? = false;
}
