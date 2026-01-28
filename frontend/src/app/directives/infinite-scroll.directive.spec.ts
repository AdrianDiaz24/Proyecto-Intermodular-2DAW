/**
 * @fileoverview Tests unitarios para InfiniteScrollDirective
 * Verifica detección de scroll y emisión de eventos
 */

import { Component, DebugElement } from '@angular/core';
import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { InfiniteScrollDirective } from './infinite-scroll.directive';

@Component({
  template: `
    <div 
      appInfiniteScroll 
      [threshold]="threshold"
      [debounceMs]="debounceMs"
      [disabled]="disabled"
      (scrolledToBottom)="onScrolledToBottom()"
      style="height: 200px; overflow-y: auto;">
      <div style="height: 1000px;">Contenido largo</div>
    </div>
  `
})
class TestHostComponent {
  threshold = 100;
  debounceMs = 200;
  disabled = false;
  scrollCount = 0;

  onScrolledToBottom() {
    this.scrollCount++;
  }
}

describe('InfiniteScrollDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let directiveEl: DebugElement;
  let directive: InfiniteScrollDirective;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestHostComponent],
      imports: [InfiniteScrollDirective]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    directiveEl = fixture.debugElement.query(By.directive(InfiniteScrollDirective));
    directive = directiveEl.injector.get(InfiniteScrollDirective);
    fixture.detectChanges();
  });

  describe('Creación de la directiva', () => {
    it('debería crear la directiva', () => {
      expect(directive).toBeTruthy();
    });

    it('debería tener valores por defecto', () => {
      const defaultDirective = new InfiniteScrollDirective({} as any);
      expect(defaultDirective.threshold).toBe(100);
      expect(defaultDirective.debounceMs).toBe(200);
      expect(defaultDirective.disabled).toBeFalse();
    });
  });

  describe('Inputs', () => {
    it('debería aceptar threshold personalizado', () => {
      component.threshold = 150;
      fixture.detectChanges();
      expect(directive.threshold).toBe(150);
    });

    it('debería aceptar debounceMs personalizado', () => {
      component.debounceMs = 300;
      fixture.detectChanges();
      expect(directive.debounceMs).toBe(300);
    });

    it('debería aceptar disabled', () => {
      component.disabled = true;
      fixture.detectChanges();
      expect(directive.disabled).toBeTrue();
    });
  });

  describe('Detección de scroll', () => {
    it('debería emitir evento al llegar al final del scroll', fakeAsync(() => {
      const container = directiveEl.nativeElement;

      // Simular scroll hasta el final
      container.scrollTop = container.scrollHeight - container.clientHeight;
      container.dispatchEvent(new Event('scroll'));

      tick(250); // Esperar debounce

      expect(component.scrollCount).toBeGreaterThan(0);
    }));

    it('no debería emitir evento si está deshabilitado', fakeAsync(() => {
      component.disabled = true;
      fixture.detectChanges();

      const container = directiveEl.nativeElement;
      container.scrollTop = container.scrollHeight - container.clientHeight;
      container.dispatchEvent(new Event('scroll'));

      tick(250);

      expect(component.scrollCount).toBe(0);
    }));

    it('debería aplicar debounce a los eventos de scroll', fakeAsync(() => {
      const container = directiveEl.nativeElement;

      // Disparar múltiples eventos de scroll rápidamente
      for (let i = 0; i < 5; i++) {
        container.scrollTop = container.scrollHeight - container.clientHeight;
        container.dispatchEvent(new Event('scroll'));
      }

      tick(100); // Antes del debounce
      expect(component.scrollCount).toBe(0);

      tick(150); // Después del debounce
      expect(component.scrollCount).toBe(1); // Solo un evento
    }));
  });

  describe('Método checkScrollPosition', () => {
    it('debería tener método público checkScrollPosition', () => {
      expect(typeof directive.checkScrollPosition).toBe('function');
    });
  });

  describe('Limpieza', () => {
    it('debería limpiar suscripciones al destruir', () => {
      // No debería lanzar errores al destruir
      expect(() => {
        fixture.destroy();
      }).not.toThrow();
    });
  });
});

