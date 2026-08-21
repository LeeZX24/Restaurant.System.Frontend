import { Service, signal } from "@angular/core";
import { CrudService } from "./crud.service";
import { BaseDto } from "../../../shared/models/dtos/base/base.dto";

@Service()
export class MaintenanceService extends CrudService {
  private readonly subRoute = signal('');

  setSubRoute(subRoute: string ) {
    this.subRoute.set(subRoute);
  }

  protected override get route(): string { return `maintenance/${this.subRoute()}` };

  getList<T extends BaseDto>() {
    return super.read<T>();
  }

  removeItem<T extends BaseDto>(item: T) {
    return super.delete<T, T>(item);
  }

  addNewItem<T extends BaseDto>(item: T) {
    return super.create<T, T>(item);
  }

  updateCurrentItem<T extends BaseDto>(item: T) {
    return super.update<T, T>(item);
  }
}
