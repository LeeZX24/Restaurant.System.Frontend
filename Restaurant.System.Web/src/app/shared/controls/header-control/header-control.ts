import { CommonModule } from '@angular/common';
import { Component, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'rs-header-control',
  imports: [MatIconModule, CommonModule],
  templateUrl: './header-control.html',
  styleUrl: './header-control.css',
})
export class HeaderControl {
  // eslint-disable-next-line @angular-eslint/no-output-native
  toggle = output();

  emit() {
    this.toggle.emit();
  }
}
