import { Component, Input } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  // Propiedades de entrada
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() disabled: boolean = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() fullWidth: boolean = false;
  @Input() loading: boolean = false;
  @Input() ariaLabel: string = '';

  /**
   * Retorna las clases CSS dinámicas para el botón
   * Usa nomenclatura BEM: .button, .button--variant, .button--size
   */
  get buttonClasses(): string {
    const classes = ['button'];

    // Agregar modificador de variante
    classes.push(`button--${this.variant}`);

    // Agregar modificador de tamaño
    classes.push(`button--${this.size}`);

    // Agregar estado disabled
    if (this.disabled) {
      classes.push('button--disabled');
    }

    // Agregar estado fullWidth
    if (this.fullWidth) {
      classes.push('button--block');
    }

    // Agregar estado loading
    if (this.loading) {
      classes.push('button--loading');
    }

    return classes.join(' ');
  }

  /**
   * Maneja el clic del botón
   * No permite clic si está disabled o loading
   */
  onClick(): void {
    if (this.disabled || this.loading) {
      return;
    }
    // Evento personalizado si es necesario
  }
}

