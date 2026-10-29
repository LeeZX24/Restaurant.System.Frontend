import { afterNextRender, Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppMetaService } from '../../../core/services/app-meta/app-meta.service';
import { TranslateService } from '@ngx-translate/core';
import { AppInitializeService } from '../../../core/services/app-initialize.service';
import { RouterService } from '../../services/router.service';

@Component({
  selector: 'rs-main-layout',
  imports: [RouterOutlet],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css',
})
export class MainLayoutComponent implements OnInit {
  version = '';
  private metaService = inject(AppMetaService);
  private translate = inject(TranslateService);
  private appInitializeService = inject(AppInitializeService);
  private routerService = inject(RouterService);

  readonly isInitialized = signal(false);

  private readonly initializeApp = afterNextRender(()=> {
    void this.initialize();
  });

  ngOnInit() {
    this.version = this.metaService.meta.version;
    this.translate.setFallbackLang('en');
    this.translate.use('en');
  }

  async initialize(): Promise<void> {
    await this.appInitializeService.init();
    await this.routerService.resolveEntryPoint();
    this.isInitialized.set(true);
  }
}
