import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterService } from '../../services/router.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'rs-redirect',
  templateUrl: './redirect.component.html',
  imports: [CommonModule],
  styleUrls: ['./redirect.component.css'],
})
export class RedirectComponent {
  private routerService = inject(RouterService);
  private activatedRoute = inject(ActivatedRoute);

  constructor() {
    const redirectPath = this.activatedRoute.snapshot.data['redirectTo'] as string;
    console.log('Navigate to -> ', redirectPath);
    this.routerService.navigateTo(redirectPath);
  }
}
