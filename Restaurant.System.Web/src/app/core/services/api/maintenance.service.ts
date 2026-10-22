import { Service, signal } from "@angular/core";
import { CrudService } from "./crud.service";

@Service()
export class MaintenanceService extends CrudService {
  private readonly subRoute = signal('');

  setSubRoute(subRoute: string ) {
    this.subRoute.set(subRoute);
  }

  protected override get route(): string { return `maintenance/${this.subRoute()}` };

  getList<T>() {
    return super.read<T>();
  }

  removeItem<T>(item: T) {
    return super.delete(item);
  }

  addNewItem<T>(item: T) {
    return super.create(item);
  }

  updateCurrentItem<T>(item: T) {
    return super.update(item);
  }
}
