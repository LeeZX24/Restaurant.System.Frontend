import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaintenanceConfig } from '../maintenance.entity';
import { BaseDto } from '../../../../models/dtos/base/base.dto';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { provideNgxMask } from 'ngx-mask';
import { CoreService } from '../../../../../core/services/core.service';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { LayoutComponent } from '../../../../layouts/layout.component';
import { LayoutRef } from '../../../../layouts/layout-ref';
import { MaintenanceFormGroup } from '../maintenance.form-group';
import {
  RSLabelTextFormControlComponent,
  RSLabelPasswordFormControlComponent,
  RSLabelEmailFormControlComponent,
  RSLabelTextFormControl,
  RSLabelPasswordFormControl,
} from '@rs/forms';

@Component({
  selector: 'app-maintenance-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RSLabelTextFormControlComponent,
    RSLabelPasswordFormControlComponent,
    RSLabelEmailFormControlComponent,
    MatDialogModule,
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css',
  providers: [provideNgxMask()],
})
export class MaintenanceFormComponent<T extends BaseDto> implements LayoutComponent<T>, OnInit {
  private config!: MaintenanceConfig<T>;
  controller!: LayoutRef<T>;
  private coreService = inject(CoreService);

  originalOrder = () => 0;

  dialogData = inject(MAT_DIALOG_DATA, { optional: true });
  sheetData = inject(MAT_BOTTOM_SHEET_DATA, { optional: true });

  data = this.dialogData ?? this.sheetData;

  form!: MaintenanceFormGroup<T>;

  isTextControl(control: AbstractControl): control is RSLabelTextFormControl {
    return control instanceof RSLabelTextFormControl;
  }

  isEmailControl(control: AbstractControl): control is RSLabelTextFormControl {
    return control instanceof RSLabelTextFormControl;
  }

  isPasswordControl(control: AbstractControl): control is RSLabelPasswordFormControl {
    return control instanceof RSLabelPasswordFormControl;
  }

  ngOnInit() {
    if (this.data.config) this.config = this.data.config;
    this.form = this.config.createForm();
  }

  getFormControl(name: string) {
    return this.form.get(name);
  }

  processSubmit() {
    if (this.ValidateForm()) {
      if (this.data.action == 'create')
        this.coreService
          .addNewItem(this.config.route, this.config.endpoints.create, this.form.getRawValue())
          .subscribe({
            next: (res) => this.success(res),
            error: () => this.error(),
          });

      if (this.data.action == 'edit')
        this.coreService.updateCurrentItem(
          this.config.route,
          this.config.endpoints.update,
          this.form.getRawValue(),
        );
    }
  }

  ValidateForm() {
    if (this.form.valid) return true;
    return false;
  }

  success(result: T) {
    this.close(result);
  }

  error() {
    this.close();
  }

  close(result?: T) {
    this.controller.close(result);
  }
}
