import { LayoutData } from './layout-data';
import { LayoutRef } from './layout-ref';


export interface LayoutComponent<T = unknown> {
  controller: LayoutRef<T>;
  data?: LayoutData<T>;
}

export interface LayoutComponentType<C> {
  // eslint-disable-next-line @typescript-eslint/prefer-function-type
  new (...args: unknown[]): C;
}
