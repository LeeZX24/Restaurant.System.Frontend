import { Directive, inject, OnDestroy, OnInit } from '@angular/core';
import { DialogService } from '@rs/dialogs';
import { CustomFormGroup } from '@rs/forms';
import { RouterService } from '../../services/router.service';
import { BaseComponent } from '../base-component';

@Directive()
export abstract class CustomBaseComponent
  extends BaseComponent<undefined>
  implements OnInit, OnDestroy
{
  private routerService = inject(RouterService);
  private dialogService = inject(DialogService);

  protected abstract createForm(): CustomFormGroup;

  ngOnInit(): void {
    this.form = this.createForm();
  }
}
