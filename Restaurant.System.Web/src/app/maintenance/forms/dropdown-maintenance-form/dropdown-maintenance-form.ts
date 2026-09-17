import { Validators } from "@angular/forms";
import { RSLabelTextFormControl } from "@LeeZX24/forms";
import { DropdownDto } from "../../../shared/models/dtos/dropdown.dto";
import { ControlService } from "../../../shared/services/control.service";
import { MaintenanceFormGroup } from "../../maintenance.form-group";
import { RSLabelDropdownFormControl } from "../../../shared/controls/custom-label-dropdown-form-control/custom-label-dropdown-form-control";
import { DropdownModel } from "../../../shared/models/dropdown.model";
import { RSLabelToggleFormControl } from "../../../shared/controls/custom-label-toggle-control/custom-label-toggle-form-control";
import { Toggle } from "../../../shared/models/toggle.model";

export class DropdownMaintenanceFormGroup extends MaintenanceFormGroup<DropdownDto> {
    constructor(
        ctrlService: ControlService,
        action: string,
        formControlValue?: DropdownDto,

    ) {
        super();
        this._addCustomControl(this.controlKeys.isNewCategory, new RSLabelToggleFormControl('Create new category ?', { required: false, toggle: this.toggle }, formControlValue?.isNewCategory, [ ]));
        this._addCustomControl(this.controlKeys.categoryDD, ctrlService.LabelDropdownControlDropdown('Category', true, !!formControlValue && formControlValue?.categoryDD ? formControlValue?.categoryDD : ''));
        this._addCustomControl(this.controlKeys.category, new RSLabelTextFormControl('Category', { required: true, inputType: 'text' }, formControlValue?.category, [ ]));
        this._addCustomControl(this.controlKeys.code, new RSLabelTextFormControl('Code', { required: false, inputType: 'text' }, formControlValue?.code));
        this._addCustomControl(this.controlKeys.description, new RSLabelTextFormControl('Description', { required: true, inputType: 'text' }, formControlValue?.description, [Validators.required,]),);
        this._addCustomControl(this.controlKeys.seqNo, new RSLabelTextFormControl('Sequence No', { required: true, inputType: 'text' }, formControlValue?.seqNo, [Validators.required,]),);
    }

    get isNewCategoryFC() { return this.get(this.controlKeys.isNewCategory) as RSLabelToggleFormControl; }
    get categoryDDFC() { return this.get(this.controlKeys.categoryDD) as RSLabelDropdownFormControl<DropdownModel, string>; }
    get categoryTextFC() { return this.get(this.controlKeys.category) as RSLabelTextFormControl; }
    get codeFC() { return this.get(this.controlKeys.code) as RSLabelTextFormControl; }
    get descriptionFC() { return this.get(this.controlKeys.description) as RSLabelTextFormControl; }
    get seqNoFC() { return this.get(this.controlKeys.seqNo) as RSLabelTextFormControl; }

    toggle: Toggle = {
        toggleOff: {
            label: 'No',
        },
        toggleOn: {
            label: 'Yes',
        },
    };
}
