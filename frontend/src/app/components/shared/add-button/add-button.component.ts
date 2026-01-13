import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-add-button',
  templateUrl: './add-button.component.html',
  styleUrls: ['./add-button.component.scss']
})
export class AddButtonComponent {
  @Input() title: string = 'Añadir';
  @Output() click = new EventEmitter<void>();

  onClick(): void {
    this.click.emit();
  }
}

