import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.sass'],
})
export class ErrorComponent {
  @Input() set message(m: string) {
    if (m == undefined || m.trim() == '') {
      return;
    }
    this.errorMessage = m;
    this.hasError = true;
  }

  hasError = false;
  errorMessage = '';

  constructor() {}

  closeError(): void {
    this.hasError = false;
    this.errorMessage = '';
  }
}
