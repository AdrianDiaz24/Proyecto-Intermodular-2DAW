/**
 * @fileoverview Directiva de Debounce para inputs
 * Aplica debounce automático a eventos de input
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
import { debounceTime, distinctUntilChanged, map, takeUntil } from 'rxjs/operators';

/**
 * Directiva para aplicar debounce a inputs de búsqueda
 *
 * @example
 * ```html
 * <input
 *   type="text"
 *   appDebounceInput
 *   [debounceTime]="300"
 *   [minLength]="2"
 *   (debounceValue)="onSearch($event)">
 * ```
 */
@Directive({
  selector: '[appDebounceInput]',
  standalone: true
})
export class DebounceInputDirective implements OnInit, OnDestroy {
  /**
   * Tiempo de debounce en milisegundos
   * @default 300
   */
  @Input() debounceTime = 300;

  /**
   * Longitud mínima para emitir el valor
   * Si el valor es menor, se emite string vacío
   * @default 0
   */
  @Input() minLength = 0;

  /**
   * Evento emitido con el valor después del debounce
   */
  @Output() debounceValue = new EventEmitter<string>();

  private destroy$ = new Subject<void>();

  constructor(private el: ElementRef<HTMLInputElement>) {}

  ngOnInit(): void {
    this.setupInputListener();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Configura el listener de input con debounce
   */
  private setupInputListener(): void {
    fromEvent<InputEvent>(this.el.nativeElement, 'input')
      .pipe(
        map(() => this.el.nativeElement.value.trim()),
        debounceTime(this.debounceTime),
        distinctUntilChanged(),
        map((value: string) => value.length >= this.minLength ? value : ''),
        takeUntil(this.destroy$)
      )
      .subscribe((value: string) => {
        this.debounceValue.emit(value);
      });
  }
}

