import { Status } from "../../enums";

export interface BaseResponseDto {
  message?: string;
  status?: Status;
}
