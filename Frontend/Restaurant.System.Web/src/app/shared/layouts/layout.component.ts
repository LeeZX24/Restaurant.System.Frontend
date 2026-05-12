import { LayoutData } from './layout-data';
import { LayoutRef } from './layout-ref';

export interface LayoutComponent<T = unknown> {
  controller: LayoutRef<T>;
  data?: LayoutData<T>;
}
