import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterService } from '../../services/router.service';

@Component({
  selector: 'rs-redirect',
  templateUrl: './redirect.component.html',
  imports:[CommonModule],
  styleUrls: ['./redirect.component.css']
})
export class RedirectComponent {
  private routerService = inject(RouterService);

  constructor() {
    setTimeout(() => this.routerService.gotoLogin(), 5000);
  }
}
