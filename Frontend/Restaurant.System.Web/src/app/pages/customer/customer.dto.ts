import { ApplicationDto } from "../../shared/models/dtos/application.dto";

export interface CustomerDto extends ApplicationDto {
  currentCustomerNumber : string;
}
