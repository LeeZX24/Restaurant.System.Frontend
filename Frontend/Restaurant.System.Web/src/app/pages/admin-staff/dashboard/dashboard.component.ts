import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth/auth.service';
import { RouterService } from '../../../shared/services/router.service';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
@Component({
  selector: 'app-dashboard',
  imports: [MatIconModule, MatExpansionModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  private authService = inject(AuthService);
  private routerService = inject(RouterService);

  logout() {
    localStorage.clear();
    this.authService.logout();
    this.routerService.gotoLogin();
  }
}
