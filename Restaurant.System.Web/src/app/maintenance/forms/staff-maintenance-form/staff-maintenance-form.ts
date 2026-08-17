import { Validators } from "@angular/forms";
import { RSLabelPasswordFormControl, RSLabelTextFormControl } from "@rs/forms";
import { StaffDto } from "../../../shared/models/dtos/staff.dto";
import { ControlService } from "../../../shared/services/control.service";
import { MaintenanceFormGroup } from "../../maintenance.form-group";

export class StaffMaintenanceFormGroup extends MaintenanceFormGroup<StaffDto> {
    constructor(
        ctrlService: ControlService, 
        formControlValue?: StaffDto
    ) {
        super();
        this._addCustomControl('username', new RSLabelTextFormControl('Username',{ required: true, inputType: 'text', autoComplete: 'username' }, formControlValue?.username ?? '', [Validators.required],),);
        this._addCustomControl('password', new RSLabelPasswordFormControl('Password',{ required: true, inputType: 'password', autoComplete: 'current-password' },formControlValue?.password ?? '',[Validators.required],),);
        this._addCustomControl('firstName',new RSLabelTextFormControl('First Name',{ required: true, inputType: 'text' },formControlValue?.firstName ?? '',[Validators.required],),);
        this._addCustomControl('lastName',new RSLabelTextFormControl('Last Name', { required: false, inputType: 'text', }, formControlValue?.lastName ?? '', ),);
        this._addCustomControl('email',new RSLabelTextFormControl('Email',{ required: true, inputType: 'email', autoComplete: 'username' },formControlValue?.email ?? '',[Validators.required, Validators.email],),);
        // this._addCustomControl('staffType',ctrlService.LabelDropdownControl('Staff Type', true, formControlValue?.staffType ?? '', [{ key: '01', value: 'SSR' },]),);
        // this.addControl('roleList', new FormControl(formControlValue?.roleList ?? []));
    }
}