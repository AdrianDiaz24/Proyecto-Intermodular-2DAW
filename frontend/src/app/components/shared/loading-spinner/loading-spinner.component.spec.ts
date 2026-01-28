/**
 * @fileoverview Tests unitarios para LoadingSpinnerComponent
 * Verifica visualización y configuración del spinner de carga
 */

import { TestBed, ComponentFixture } from '@angular/core/testing';

import { LoadingSpinnerComponent } from './loading-spinner.component';

describe('LoadingSpinnerComponent', () => {
  let component: LoadingSpinnerComponent;
  let fixture: ComponentFixture<LoadingSpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoadingSpinnerComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Creación del componente', () => {
    it('debería crear el componente', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('Valores por defecto', () => {
    it('debería tener mensaje por defecto "Cargando..."', () => {
      expect(component.message).toBe('Cargando...');
    });

    it('debería tener tamaño medium por defecto', () => {
      expect(component.size).toBe('medium');
    });

    it('debería tener fullScreen desactivado por defecto', () => {
      expect(component.fullScreen).toBeFalse();
    });
  });

  describe('Inputs configurables', () => {
    it('debería permitir personalizar el mensaje', () => {
      component.message = 'Procesando datos...';
      fixture.detectChanges();
      expect(component.message).toBe('Procesando datos...');
    });

    it('debería permitir tamaño small', () => {
      component.size = 'small';
      fixture.detectChanges();
      expect(component.size).toBe('small');
    });

    it('debería permitir tamaño large', () => {
      component.size = 'large';
      fixture.detectChanges();
      expect(component.size).toBe('large');
    });

    it('debería permitir activar fullScreen', () => {
      component.fullScreen = true;
      fixture.detectChanges();
      expect(component.fullScreen).toBeTrue();
    });
  });

  describe('Renderizado', () => {
    it('debería renderizar el componente', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled).toBeTruthy();
    });
  });
});

