import { Component, Input, OnInit, HostListener } from '@angular/core';

/**
 * Interfaz para definir la estructura de cada imagen de la galería
 */
export interface GalleryImage {
  src: string;
  alt: string;
  caption: string;
  srcset?: string;
}

/**
 * Componente de galería de imágenes accesible
 * Implementa navegación por teclado, lazy loading y descripciones alternativas
 */
@Component({
  selector: 'app-image-gallery',
  templateUrl: './image-gallery.component.html',
  styleUrls: ['./image-gallery.component.scss']
})
export class ImageGalleryComponent implements OnInit {
  /** Array de imágenes a mostrar en la galería */
  @Input() images: GalleryImage[] = [];

  /** Título de la galería para accesibilidad */
  @Input() galleryTitle: string = 'Galería de imágenes';

  /** Número de columnas en desktop */
  @Input() columns: number = 3;

  /** Imagen actualmente seleccionada para el modal */
  selectedImage: GalleryImage | null = null;

  /** Índice de la imagen seleccionada */
  selectedIndex: number = -1;

  /** Control de visibilidad del modal */
  isModalOpen: boolean = false;

  ngOnInit(): void {
    // Inicialización del componente
  }

  /**
   * Abre el modal con la imagen seleccionada
   * @param image - Imagen a mostrar
   * @param index - Índice de la imagen en el array
   */
  openModal(image: GalleryImage, index: number): void {
    this.selectedImage = image;
    this.selectedIndex = index;
    this.isModalOpen = true;
    // Prevenir scroll del body cuando el modal está abierto
    document.body.style.overflow = 'hidden';
  }

  /**
   * Cierra el modal
   */
  closeModal(): void {
    this.isModalOpen = false;
    this.selectedImage = null;
    this.selectedIndex = -1;
    document.body.style.overflow = '';
  }

  /**
   * Navega a la imagen anterior
   */
  previousImage(): void {
    if (this.selectedIndex > 0) {
      this.selectedIndex--;
      this.selectedImage = this.images[this.selectedIndex];
    } else {
      // Ir a la última imagen (navegación circular)
      this.selectedIndex = this.images.length - 1;
      this.selectedImage = this.images[this.selectedIndex];
    }
  }

  /**
   * Navega a la siguiente imagen
   */
  nextImage(): void {
    if (this.selectedIndex < this.images.length - 1) {
      this.selectedIndex++;
      this.selectedImage = this.images[this.selectedIndex];
    } else {
      // Ir a la primera imagen (navegación circular)
      this.selectedIndex = 0;
      this.selectedImage = this.images[this.selectedIndex];
    }
  }

  /**
   * Maneja eventos de teclado para navegación accesible
   * @param event - Evento de teclado
   */
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (!this.isModalOpen) return;

    switch (event.key) {
      case 'Escape':
        this.closeModal();
        event.preventDefault();
        break;
      case 'ArrowLeft':
        this.previousImage();
        event.preventDefault();
        break;
      case 'ArrowRight':
        this.nextImage();
        event.preventDefault();
        break;
      case 'Home':
        this.selectedIndex = 0;
        this.selectedImage = this.images[0];
        event.preventDefault();
        break;
      case 'End':
        this.selectedIndex = this.images.length - 1;
        this.selectedImage = this.images[this.selectedIndex];
        event.preventDefault();
        break;
    }
  }

  /**
   * Obtiene el texto del indicador de posición
   * @returns String con formato "X de Y"
   */
  getPositionIndicator(): string {
    return `${this.selectedIndex + 1} de ${this.images.length}`;
  }
}
