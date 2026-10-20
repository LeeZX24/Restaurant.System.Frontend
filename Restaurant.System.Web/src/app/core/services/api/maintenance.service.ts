import { Service, signal } from "@angular/core";
import { CrudService } from "./crud.service";
import { MaintenanceRequestDto, MaintenanceResponseDto } from "../../../shared/models/dtos/maintenance.dto";
import { createBaseRequestData } from '../../../shared/helpers/base.helper';

@Service()
export class MaintenanceService extends CrudService {
  private readonly subRoute = signal('');

  setSubRoute(subRoute: string ) {
    this.subRoute.set(subRoute);
  }

  protected override get route(): string { return `maintenance/${this.subRoute()}` };

  getList<T>() {
    return super.read<MaintenanceResponseDto<T>>();
  }

  removeItem<T>(item: T) {
    const request: MaintenanceRequestDto<T> = { ...createBaseRequestData(), data: item };
    return super.delete<MaintenanceRequestDto<T>, MaintenanceResponseDto<T>>(request);
  }

  addNewItem<T>(item: T) {
    const request: MaintenanceRequestDto<T> = { ...createBaseRequestData(), data: item };
    return super.create<MaintenanceRequestDto<T>, MaintenanceResponseDto<T>>(request);
  }

  updateCurrentItem<T>(item: T) {
    const request: MaintenanceRequestDto<T> = { ...createBaseRequestData(), data: item };
    return super.update<MaintenanceRequestDto<T>, MaintenanceResponseDto<T>>(request);
  }
}
