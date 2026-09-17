import { Service } from "@angular/core";
import { BaseDto } from "../../../shared/models/dtos/base/base.dto";
import { CrudService } from "../crud.service";

@Service()
export class MaintenanceService extends CrudService {
    private subRoute!: string;
    protected get route(): string { return `maintenance/${this.subRoute}`; }

    getSubRoute(currentRoute: string) {
        this.subRoute = currentRoute;
    }

    getList<T extends BaseDto>() {
        return super.list<T>();
    }

    createNewItem<TRequest extends BaseDto, TResponse extends BaseDto>(item: TRequest) {
        return super.create<TRequest, TResponse>(item);
    }
    
    updateCurrentItem<TRequest extends BaseDto, TResponse extends BaseDto>(item: TRequest) {
        return super.update<TRequest, TResponse>(item);
    }
    
    removeItem<TRequest extends BaseDto, TResponse extends BaseDto>(item: TRequest) {
        return super.remove<TRequest, TResponse>(item);
    }
}