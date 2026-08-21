import { Validators } from "@angular/forms";
import { RSLabelTextFormControl } from "@LeeZX24/forms";
import { DropdownDto } from "../../../shared/models/dtos/dropdown.dto";
import { ControlService } from "../../../shared/services/control.service";
import { MaintenanceFormGroup } from "../../maintenance.form-group";
import { RSLabelDropdownFormControl } from "../../../shared/controls/custom-label-dropdown-form-control/custom-label-dropdown-form-control";
import { DropdownModel } from "../../../shared/models/dropdown.model";

export class DropdownMaintenanceFormGroup extends MaintenanceFormGroup<DropdownDto> {
    constructor(
        ctrlService: ControlService,
        action: string,
        formControlValue?: DropdownDto,

    ) {
        super();
        this._addCustomControl(this.controlKeys.category, new RSLabelTextFormControl('Category', { required: false, inputType: 'text' }, formControlValue?.category, [ ]), action && action === 'create' ? false : true);
        this._addCustomControl(this.controlKeys.categoryDD, ctrlService.LabelDropdownControlDropdown('Category', false, formControlValue?.category ?? ''), action && action === 'create' ? false : true);
        this._addCustomControl(this.controlKeys.code, new RSLabelTextFormControl('Code', { required: false, inputType: 'text' }, formControlValue?.code));
        this._addCustomControl(this.controlKeys.description, new RSLabelTextFormControl('Description', { required: true, inputType: 'text' }, formControlValue?.description, [Validators.required,]),);
        this._addCustomControl(this.controlKeys.seqNo, new RSLabelTextFormControl('Sequence No', { required: true, inputType: 'text' }, formControlValue?.seqNo, [Validators.required,]),);
    }

    get categoryTextFC() { return this.get(this.controlKeys.category) as RSLabelTextFormControl; }
    get categoryDDFC() { return this.get(this.controlKeys.categoryDD) as RSLabelDropdownFormControl<DropdownModel, string>; }
    get codeFC() { return this.get(this.controlKeys.code) as RSLabelTextFormControl; }
    get descriptionFC() { return this.get(this.controlKeys.description) as RSLabelTextFormControl; }
    get seqNoFC() { return this.get(this.controlKeys.seqNo) as RSLabelTextFormControl; }

    items: DropdownModel[] = [
      { key: '01', value: 'Gray', order: '1' },
      { key: '02', value: 'Pink', order: '2' },
    ];
}
