import { Component, Input } from '@angular/core';

export type CardVariant = 'basic' | 'horizontal';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  // Propiedades de entrada
  @Input() variant: CardVariant = 'basic';
  @Input() imageSrc: string = '';
  @Input() imageAlt: string = '';
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() actionText: string = '';
  @Input() interactive: boolean = true;

  /**
   * Retorna las clases CSS dinámicas para la card
   * Usa nomenclatura BEM: .card, .card--{variant}
   */
  get cardClasses(): string {
    const classes = ['card'];

    // Agregar modificador de variante
    if (this.variant && this.variant !== 'basic') {
      classes.push(`card--${this.variant}`);
    }

    // Agregar clase interactiva si aplica
    if (this.interactive) {
      classes.push('card--interactive');
    }

    return classes.join(' ');
  }

  /**
   * Determina si mostrar la imagen
   */
  get hasImage(): boolean {
    return !!this.imageSrc;
  }

  /**
   * Determina si mostrar botón de acción
   */
  get hasAction(): boolean {
    return !!this.actionText;
  }
}

