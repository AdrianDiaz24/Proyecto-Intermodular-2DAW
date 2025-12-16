import { Component, Input, Output, EventEmitter } from '@angular/core';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent {
  @Input() type: AlertType = 'info';
  @Input() message: string = '';
  @Input() closeable: boolean = true;
  @Output() close = new EventEmitter<void>();

  isVisible: boolean = true;

  closeAlert(): void {
    this.isVisible = false;
    this.close.emit();
  }

  get alertClasses(): string {
    const classes = ['alert'];
    classes.push(`alert--${this.type}`);
    return classes.join(' ');
  }

  get iconClass(): string {
    const icons = {
      success: 'fas fa-check-circle',
      error: 'fas fa-exclamation-circle',
      warning: 'fas fa-exclamation-triangle',
      info: 'fas fa-info-circle'
    };
    return icons[this.type];
  }
}

