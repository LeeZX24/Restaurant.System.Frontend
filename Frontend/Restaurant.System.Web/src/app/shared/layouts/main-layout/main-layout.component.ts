import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { AppMetaService } from '../../../core/services/app-meta/app-meta.service';


@Component({
  selector: 'rs-main-layout',
  imports: [RouterOutlet],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css',
})
export class MainLayoutComponent implements OnInit {
  version = '';
  private metaService = inject(AppMetaService);

  ngOnInit() {
    this.version = this.metaService.meta.version;
  }
}
