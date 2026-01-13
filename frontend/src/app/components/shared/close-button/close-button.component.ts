import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-close-button',
  templateUrl: './close-button.component.html',
  styleUrls: ['./close-button.component.scss']
})
export class CloseButtonComponent {
  @Input() icon: string = 'assets/icons/error.png';
  @Input() title: string = 'Cerrar';
  @Output() click = new EventEmitter<void>();

  onClick(): void {
    this.click.emit();
  }
}


