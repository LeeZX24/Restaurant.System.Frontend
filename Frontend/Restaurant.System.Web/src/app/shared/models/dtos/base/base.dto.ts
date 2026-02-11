import { ActivityState } from "../../../enums/activity-state";
import { Status } from "../../../enums/status";
import { RequestDto } from "./request.dto";
import { ResponseDto } from "./response.dto";

export interface BaseDto {
  requestDetails: RequestDto;
  responseDetails: ResponseDto;
  status: Status;
  state: ActivityState;
}




