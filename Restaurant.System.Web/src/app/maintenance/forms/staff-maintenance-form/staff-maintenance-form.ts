import { Validators } from "@angular/forms";
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
        this._addCustomControl('username', new RSLabelTextFormControl('Username',{ required: true, inputType: 'text', autoComplete: 'username' }, formControlValue?.username ?? '', [Validators.required]));
        this._addCustomControl('email',new RSLabelTextFormControl('Email',{ required: true, inputType: 'email', autoComplete: 'username' },formControlValue?.email ?? '',[Validators.required, Validators.email]));
        this._addCustomControl('lastName',new RSLabelTextFormControl('Last Name', { required: true, inputType: 'text', }, formControlValue?.lastName ?? '', [Validators.required]));
        this._addCustomControl('firstName',new RSLabelTextFormControl('First Name',{ required: false, inputType: 'text' },formControlValue?.firstName ?? '',[Validators.required]));
        this._addCustomControl('middleName',new RSLabelTextFormControl('Last Name', { required: false, inputType: 'text', }, formControlValue?.lastName ?? ''));
    }

    get usernameFC() { return this.get(this.controlKeys.username) as RSLabelTextFormControl; }
    get emailFC() { return this.get(this.controlKeys.email) as RSLabelTextFormControl; }
    get lastNameFC() { return this.get(this.controlKeys.lastName) as RSLabelTextFormControl; }
    get firstNameFC() { return this.get(this.controlKeys.firstName) as RSLabelTextFormControl; }
    get middleNameFC() { return this.get(this.controlKeys.middleName) as RSLabelTextFormControl; }
    
}
