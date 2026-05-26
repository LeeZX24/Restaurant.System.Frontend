import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: 'rs-button-control',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatIconModule],
  templateUrl: './custom-button-control.html',
  styleUrl: './custom-button-control.css',
  standalone: true
})
export class CustomButtonControl {
  icon = input<string>();
  label = input<string>('');
  cssClass = input<string>('');

  buttonClicked = output<void>();
}
