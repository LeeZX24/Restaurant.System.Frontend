import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterService } from './shared/services/router.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  //Declarations
  protected readonly title = signal('Restaurant.System.Web');

  //Services
  private routerServ = inject(RouterService);

  go(path:string)
  {
    this.routerServ.go(path);
  }
}
