/**
 * @fileoverview Directiva de Scroll Infinito
 * Detecta cuando el usuario llega al final del contenedor y emite evento
 * para cargar más datos
 */

import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { Subject, fromEvent } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

/**
 * Directiva para implementar scroll infinito en listados
 * 
 * @example
 * ```html
 * <div 
 *   class="list-container" 
 *   appInfiniteScroll 
 *   [threshold]="150"
 *   (scrolledToBottom)="loadMore()">
 *   <app-card *ngFor="let item of items" [item]="item"></app-card>
 * </div>
 * ```
 */
@Directive({
  selector: '[appInfiniteScroll]',
  standalone: true
})
export class InfiniteScrollDirective implements OnInit, OnDestroy {
  /**
   * Distancia en píxeles antes del final para disparar el evento
   * @default 100
   */
  @Input() threshold = 100;

  /**
   * Tiempo de debounce en milisegundos para evitar múltiples eventos
   * @default 200
   */
  @Input() debounceMs = 200;

  /**
   * Si es true, desactiva la detección de scroll
   */
  @Input() disabled = false;

  /**
   * Evento emitido cuando el usuario se acerca al final del scroll
   */
  @Output() scrolledToBottom = new EventEmitter<void>();

  private destroy$ = new Subject<void>();

  constructor(private el: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    this.setupScrollListener();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Configura el listener de scroll con debounce
   */
  private setupScrollListener(): void {
    fromEvent(this.el.nativeElement, 'scroll')
      .pipe(
        debounceTime(this.debounceMs),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.onScroll());
  }

  /**
   * Maneja el evento de scroll y detecta si se llegó al final
   */
  private onScroll(): void {
    if (this.disabled) {
      return;
    }

    const element = this.el.nativeElement;
    const scrollPosition = element.scrollTop + element.clientHeight;
    const scrollHeight = element.scrollHeight;

    // Emitir evento si estamos cerca del final
    if (scrollHeight - scrollPosition <= this.threshold) {
      this.scrolledToBottom.emit();
    }
  }

  /**
   * Método público para verificar manualmente la posición
   * Útil después de cargar nuevos datos
   */
  checkScrollPosition(): void {
    this.onScroll();
  }
}

