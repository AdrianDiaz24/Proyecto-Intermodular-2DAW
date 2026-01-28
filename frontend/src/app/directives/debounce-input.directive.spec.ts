/**
 * @fileoverview Tests unitarios para DebounceInputDirective
 * Verifica debounce en inputs de búsqueda
 */

import { Component, DebugElement } from '@angular/core';
import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { DebounceInputDirective } from './debounce-input.directive';

@Component({
  template: `
    <input 
      type="text"
      appDebounceInput 
      [debounceTime]="debounceTime"
      [minLength]="minLength"
      (debounceValue)="onDebounceValue($event)">
  `
})
class TestHostComponent {
  debounceTime = 300;
  minLength = 0;
  lastValue = '';
  valueCount = 0;

  onDebounceValue(value: string) {
    this.lastValue = value;
    this.valueCount++;
  }
}

describe('DebounceInputDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let inputEl: DebugElement;
  let directive: DebounceInputDirective;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestHostComponent],
      imports: [DebounceInputDirective]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    inputEl = fixture.debugElement.query(By.directive(DebounceInputDirective));
    directive = inputEl.injector.get(DebounceInputDirective);
    fixture.detectChanges();
  });

  describe('Creación de la directiva', () => {
    it('debería crear la directiva', () => {
      expect(directive).toBeTruthy();
    });

    it('debería tener valores por defecto', () => {
      const defaultDirective = new DebounceInputDirective({} as any);
      expect(defaultDirective.debounceTime).toBe(300);
      expect(defaultDirective.minLength).toBe(0);
    });
  });

  describe('Inputs', () => {
    it('debería aceptar debounceTime personalizado', () => {
      component.debounceTime = 500;
      fixture.detectChanges();
      expect(directive.debounceTime).toBe(500);
    });

    it('debería aceptar minLength personalizado', () => {
      component.minLength = 3;
      fixture.detectChanges();
      expect(directive.minLength).toBe(3);
    });
  });

  describe('Debounce de input', () => {
    it('debería emitir valor después del tiempo de debounce', fakeAsync(() => {
      const input = inputEl.nativeElement as HTMLInputElement;

      input.value = 'test';
      input.dispatchEvent(new Event('input'));

      expect(component.lastValue).toBe(''); // Aún no emitido

      tick(350); // Después del debounce

      expect(component.lastValue).toBe('test');
    }));

    it('debería aplicar debounce a entradas rápidas', fakeAsync(() => {
      const input = inputEl.nativeElement as HTMLInputElement;

      // Escribir rápidamente
      input.value = 't';
      input.dispatchEvent(new Event('input'));
      tick(100);

      input.value = 'te';
      input.dispatchEvent(new Event('input'));
      tick(100);

      input.value = 'tes';
      input.dispatchEvent(new Event('input'));
      tick(100);

      input.value = 'test';
      input.dispatchEvent(new Event('input'));

      tick(350);

      // Solo debería emitir el valor final
      expect(component.lastValue).toBe('test');
      expect(component.valueCount).toBe(1);
    }));

    it('debería emitir string vacío si valor es menor que minLength', fakeAsync(() => {
      component.minLength = 3;
      fixture.detectChanges();

      const input = inputEl.nativeElement as HTMLInputElement;

      input.value = 'ab'; // Menor que minLength
      input.dispatchEvent(new Event('input'));

      tick(350);

      expect(component.lastValue).toBe('');
    }));

    it('debería emitir valor si cumple minLength', fakeAsync(() => {
      component.minLength = 3;
      fixture.detectChanges();

      const input = inputEl.nativeElement as HTMLInputElement;

      input.value = 'abc'; // Igual a minLength
      input.dispatchEvent(new Event('input'));

      tick(350);

      expect(component.lastValue).toBe('abc');
    }));

    it('debería eliminar espacios en blanco del valor', fakeAsync(() => {
      const input = inputEl.nativeElement as HTMLInputElement;

      input.value = '  test  ';
      input.dispatchEvent(new Event('input'));

      tick(350);

      expect(component.lastValue).toBe('test');
    }));

    it('no debería emitir si el valor no cambia', fakeAsync(() => {
      const input = inputEl.nativeElement as HTMLInputElement;

      input.value = 'test';
      input.dispatchEvent(new Event('input'));
      tick(350);

      const countAfterFirst = component.valueCount;

      // Mismo valor
      input.value = 'test';
      input.dispatchEvent(new Event('input'));
      tick(350);

      expect(component.valueCount).toBe(countAfterFirst);
    }));
  });

  describe('Limpieza', () => {
    it('debería limpiar suscripciones al destruir', () => {
      expect(() => {
        fixture.destroy();
      }).not.toThrow();
    });
  });
});

