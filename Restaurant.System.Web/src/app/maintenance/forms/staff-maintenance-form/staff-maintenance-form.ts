import { RSLabelTextFormControl } from "@LeeZX24/forms";
import { StaffDto } from "../../../shared/models/dtos/staff.dto";
import { ControlService } from "../../../shared/services/control.service";
import { MaintenanceFormGroup } from "../../maintenance.form-group";

export class StaffMaintenanceFormGroup extends MaintenanceFormGroup<StaffDto> {
    constructor(
        ctrlService: ControlService,
        formControlValue?: StaffDto
    ) {
        super();
        this._addCustomControl(this.controlKeys.username, ctrlService.LabelText('Username', true, formControlValue?.username ?? '', { autocomplete: 'username' }));
        this._addCustomControl(this.controlKeys.email, ctrlService.LabelEmail('Email', true, formControlValue?.email ?? ''));
        this._addCustomControl(this.controlKeys.lastName, ctrlService.LabelText('Last Name', true, formControlValue?.lastName ?? ''));
        this._addCustomControl(this.controlKeys.firstName, ctrlService.LabelText('First Name', true, formControlValue?.firstName ?? ''));
        this._addCustomControl(this.controlKeys.middleName, ctrlService.LabelText('Middle Name', true, formControlValue?.middleName ?? ''));
    }

    get usernameFC() { return this.get(this.controlKeys.username) as RSLabelTextFormControl; }
    get emailFC() { return this.get(this.controlKeys.email) as RSLabelTextFormControl; }
    get lastNameFC() { return this.get(this.controlKeys.lastName) as RSLabelTextFormControl; }
    get firstNameFC() { return this.get(this.controlKeys.firstName) as RSLabelTextFormControl; }
    get middleNameFC() { return this.get(this.controlKeys.middleName) as RSLabelTextFormControl; }
    
}
