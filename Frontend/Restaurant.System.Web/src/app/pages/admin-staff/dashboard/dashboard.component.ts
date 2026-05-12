import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth/auth.service';
import { RouterService } from '../../../shared/services/router.service';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { DialogService } from '@rs/dialogs';
@Component({
  selector: 'app-dashboard',
  imports: [MatIconModule, MatExpansionModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  private authService = inject(AuthService);
  private routerService = inject(RouterService);
  private dialogService = inject(DialogService);

  logout() {
    const ref = this.dialogService.showLoadingDialog('Logout User ...', false, false, {
      loading: true,
    });

    ref.afterOpened().subscribe(() => {
      setTimeout(() => {
        ref.close();
        if (this.authService.isLoggedIn) {
          this.authService.logout();
          this.routerService.gotoLogin();
        }
      }, 1000);
    });
  }
}
