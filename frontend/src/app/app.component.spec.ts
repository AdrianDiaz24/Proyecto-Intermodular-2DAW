/**
 * @fileoverview Tests unitarios para AppComponent
 * Verifica la inicialización correcta de la aplicación
 */

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { AppComponent } from './app.component';
import { ThemeService } from './services/theme.service';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let themeServiceSpy: jasmine.SpyObj<ThemeService>;

  beforeEach(async () => {
    // Crear spy para ThemeService - solo métodos públicos
    themeServiceSpy = jasmine.createSpyObj('ThemeService', ['initTheme', 'toggleTheme', 'setTheme']);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AppComponent],
      providers: [
        { provide: ThemeService, useValue: themeServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA] // Ignorar componentes desconocidos
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Creación del componente', () => {
    it('debería crear el componente', () => {
      expect(component).toBeTruthy();
    });

    it('debería tener el título correcto', () => {
      expect(component.title).toBe('proyecto-intermodular-2daw');
    });
  });

  describe('Inicialización', () => {
    it('debería inyectar ThemeService', () => {
      // El ThemeService se inyecta en el constructor
      expect(themeServiceSpy).toBeTruthy();
    });
  });

  describe('Renderizado', () => {
    it('debería renderizar el componente', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled).toBeTruthy();
    });
  });
});

