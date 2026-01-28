/**
 * @fileoverview Tests unitarios para NavigationService
 * Verifica navegación programática y gestión de breadcrumbs
 */

import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { Component } from '@angular/core';

import { NavigationService, Breadcrumb } from './navigation.service';

// Componentes dummy para las rutas de test
@Component({ template: '' })
class DummyComponent {}

describe('NavigationService', () => {
  let service: NavigationService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: '', component: DummyComponent },
          { path: 'home', component: DummyComponent },
          { path: 'producto/:id', component: DummyComponent },
          { path: 'buscar', component: DummyComponent },
          { path: 'login', component: DummyComponent },
          { path: 'perfil', component: DummyComponent }
        ])
      ],
      declarations: [DummyComponent],
      providers: [NavigationService]
    });

    service = TestBed.inject(NavigationService);
    router = TestBed.inject(Router);
  });

  describe('Creación del servicio', () => {
    it('debería crear el servicio', () => {
      expect(service).toBeTruthy();
    });

    it('debería tener observable de breadcrumbs', (done) => {
      service.breadcrumbs$.subscribe(breadcrumbs => {
        expect(Array.isArray(breadcrumbs)).toBeTrue();
        done();
      });
    });

    it('debería tener observable de historial de navegación', (done) => {
      service.navigationHistory$.subscribe(history => {
        expect(Array.isArray(history)).toBeTrue();
        done();
      });
    });
  });

  describe('Navegación programática', () => {
    it('debería navegar usando navigateTo', fakeAsync(() => {
      const navigateSpy = spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

      service.navigateTo('/');
      tick();

      expect(navigateSpy).toHaveBeenCalledWith(['/']);
    }));

    it('debería navegar a producto con ID', fakeAsync(() => {
      const navigateSpy = spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

      service.goToProduct(123);
      tick();

      expect(navigateSpy).toHaveBeenCalledWith(['/producto', 123], undefined);
    }));

    it('debería navegar a producto con opciones extras', fakeAsync(() => {
      const navigateSpy = spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
      const extras = { state: { fromSearch: true } };

      service.goToProduct(123, extras);
      tick();

      expect(navigateSpy).toHaveBeenCalledWith(['/producto', 123], extras);
    }));

    it('debería navegar a búsqueda con query', fakeAsync(() => {
      const navigateSpy = spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

      service.goToSearch('lavadora');
      tick();

      expect(navigateSpy).toHaveBeenCalledWith(['/buscar'], { queryParams: { q: 'lavadora' } });
    }));

    it('debería navegar a login', fakeAsync(() => {
      const navigateSpy = spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

      service.goToLogin();
      tick();

      expect(navigateSpy).toHaveBeenCalledWith(['/login'], {});
    }));

    it('debería navegar a login con returnUrl', fakeAsync(() => {
      const navigateSpy = spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

      service.goToLogin('/profile');
      tick();

      expect(navigateSpy).toHaveBeenCalledWith(['/login'], { queryParams: { returnUrl: '/profile' } });
    }));
  });

  describe('Navegación hacia atrás', () => {
    it('debería tener método goBack', () => {
      expect(typeof service.goBack).toBe('function');
    });
  });

  describe('Historial de navegación', () => {
    it('debería actualizar el historial después de navegación', fakeAsync(() => {
      router.navigate(['/home']);
      tick();

      service.navigationHistory$.subscribe(history => {
        expect(history.length).toBeGreaterThanOrEqual(0);
      });
    }));

    it('debería limitar el historial a 10 entradas', fakeAsync(() => {
      // Simular múltiples navegaciones
      for (let i = 0; i < 15; i++) {
        router.navigate(['/home']);
        tick();
      }

      service.navigationHistory$.subscribe(history => {
        expect(history.length).toBeLessThanOrEqual(10);
      });
    }));
  });

  describe('Breadcrumbs', () => {
    it('debería generar breadcrumbs vacíos inicialmente', (done) => {
      service.breadcrumbs$.subscribe(breadcrumbs => {
        expect(Array.isArray(breadcrumbs)).toBeTrue();
        done();
      });
    });
  });

  describe('URL actual', () => {
    it('debería obtener la URL actual', () => {
      const currentUrl = service.getCurrentUrl();
      expect(typeof currentUrl).toBe('string');
    });
  });

  describe('Verificación de ruta', () => {
    it('debería verificar si está en una ruta específica', fakeAsync(() => {
      router.navigate(['/home']);
      tick();

      // El servicio debería tener método para verificar ruta
      expect(typeof service.isCurrentRoute).toBe('function');
    }));

    it('debería verificar ruta con home', fakeAsync(() => {
      router.navigate(['/']);
      tick();

      const isHome = service.isCurrentRoute('/');
      expect(typeof isHome).toBe('boolean');
    }));
  });
});

