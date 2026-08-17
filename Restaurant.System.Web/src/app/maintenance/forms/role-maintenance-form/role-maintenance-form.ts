import { Validators } from "@angular/forms";
import { ControlService } from "../../../shared/services/control.service";
import { MaintenanceFormGroup } from "../../maintenance.form-group";
import { RoleDto } from "../../../shared/models/dtos/role.dto";
import { RSLabelTextFormControl } from "@rs/forms";

export class RoleMaintenanceFormGroup extends MaintenanceFormGroup<RoleDto> {
    constructor(
        ctrlService: ControlService, 
        formControlValue?: RoleDto
    ) {
        super();
        this._addCustomControl(this.controlKeys.roleCode, new RSLabelTextFormControl('Code', { required: true, inputType: 'text' }, formControlValue?.roleCode, [Validators.required,]),);
        this._addCustomControl(this.controlKeys.roleName, new RSLabelTextFormControl('Name', { required: false, inputType: 'text' }, formControlValue?.roleName),);
    }
}