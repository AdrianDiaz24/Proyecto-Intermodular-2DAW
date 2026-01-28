/**
 * @fileoverview Tests unitarios para AuthService
 * Verifica login, registro, logout y gestión de estado de autenticación
 */

import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { User, AuthResponse, LoginCredentials, RegisterData } from '../models';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: Router;

  // Mock data - ajustado a los tipos reales
  const mockUser: User = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    role: 'USER'
  };

  const mockAuthResponse: AuthResponse = {
    token: 'mock-jwt-token-12345',
    userId: 1,
    username: 'testuser',
    email: 'test@example.com',
    role: 'USER'
  };

  const mockCredentials: LoginCredentials = {
    username: 'testuser',
    password: 'password123'
  };

  const mockRegisterData: RegisterData = {
    username: 'newuser',
    email: 'newuser@example.com',
    password: 'password123'
  };

  beforeEach(() => {
    // Limpiar localStorage antes de cada test
    localStorage.clear();

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [AuthService]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  describe('Creación del servicio', () => {
    it('debería crear el servicio', () => {
      expect(service).toBeTruthy();
    });

    it('debería inicializar con usuario no autenticado', (done) => {
      service.isLoggedIn$.subscribe(isLoggedIn => {
        expect(isLoggedIn).toBeFalse();
        done();
      });
    });

    it('debería inicializar currentUser como null', (done) => {
      service.currentUser$.subscribe(user => {
        expect(user).toBeNull();
        done();
      });
    });
  });

  describe('Login', () => {
    it('debería hacer login correctamente con credenciales válidas', fakeAsync(() => {
      // Habilitar mock data para este test
      const originalEnableMock = environment.enableMockData;
      environment.enableMockData = true;

      let result: AuthResponse | null = null;

      service.login(mockCredentials).subscribe(response => {
        result = response;
      });

      tick(500); // Esperar el delay del mock

      expect(result).toBeTruthy();
      expect(result?.token).toBeTruthy();
      expect(result?.username).toBeTruthy();

      // Restaurar configuración
      environment.enableMockData = originalEnableMock;
    }));

    it('debería actualizar el estado de autenticación después del login', fakeAsync(() => {
      const originalEnableMock = environment.enableMockData;
      environment.enableMockData = true;

      service.login(mockCredentials).subscribe();
      tick(500);

      service.isLoggedIn$.subscribe(isLoggedIn => {
        expect(isLoggedIn).toBeTrue();
      });

      environment.enableMockData = originalEnableMock;
    }));

    it('debería guardar el token en localStorage', fakeAsync(() => {
      const originalEnableMock = environment.enableMockData;
      environment.enableMockData = true;

      service.login(mockCredentials).subscribe();
      tick(500);

      const token = localStorage.getItem(environment.tokenKey);
      expect(token).toBeTruthy();

      environment.enableMockData = originalEnableMock;
    }));

    it('debería aceptar credenciales como objeto o parámetros separados', fakeAsync(() => {
      const originalEnableMock = environment.enableMockData;
      environment.enableMockData = true;

      // Test con objeto
      service.login(mockCredentials).subscribe();
      tick(500);

      // Test con parámetros separados
      service.login('testuser', 'password123').subscribe();
      tick(500);

      environment.enableMockData = originalEnableMock;
    }));
  });

  describe('Logout', () => {
    it('debería limpiar el estado de autenticación', fakeAsync(() => {
      const originalEnableMock = environment.enableMockData;
      environment.enableMockData = true;

      // Primero hacer login
      service.login(mockCredentials).subscribe();
      tick(500);

      // Luego logout
      service.logout();

      service.isLoggedIn$.subscribe(isLoggedIn => {
        expect(isLoggedIn).toBeFalse();
      });

      service.currentUser$.subscribe(user => {
        expect(user).toBeNull();
      });

      environment.enableMockData = originalEnableMock;
    }));

    it('debería eliminar el token de localStorage', fakeAsync(() => {
      const originalEnableMock = environment.enableMockData;
      environment.enableMockData = true;

      service.login(mockCredentials).subscribe();
      tick(500);

      service.logout();

      const token = localStorage.getItem(environment.tokenKey);
      expect(token).toBeNull();

      environment.enableMockData = originalEnableMock;
    }));
  });

  describe('Registro', () => {
    it('debería registrar un nuevo usuario', fakeAsync(() => {
      const originalEnableMock = environment.enableMockData;
      environment.enableMockData = true;

      let result: AuthResponse | null = null;

      service.register(mockRegisterData).subscribe(response => {
        result = response;
      });

      tick(800); // Mayor delay para registro

      expect(result).toBeTruthy();
      expect(result?.username).toBeTruthy();

      environment.enableMockData = originalEnableMock;
    }));
  });

  describe('Estado de autenticación', () => {
    it('debería restaurar el estado desde localStorage al inicializar', () => {
      // Simular datos guardados
      localStorage.setItem('currentUser', JSON.stringify(mockUser));
      localStorage.setItem(environment.tokenKey, 'mock-token');

      // Crear nueva instancia del servicio
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [
          HttpClientTestingModule,
          RouterTestingModule.withRoutes([])
        ],
        providers: [AuthService]
      });

      const newService = TestBed.inject(AuthService);

      newService.isLoggedIn$.subscribe(isLoggedIn => {
        expect(isLoggedIn).toBeTrue();
      });

      newService.currentUser$.subscribe(user => {
        expect(user?.username).toBe('testuser');
      });
    });

    it('debería verificar si el usuario está autenticado', fakeAsync(() => {
      const originalEnableMock = environment.enableMockData;
      environment.enableMockData = true;

      expect(service.isAuthenticated()).toBeFalse();

      service.login(mockCredentials).subscribe();
      tick(500);

      expect(service.isAuthenticated()).toBeTrue();

      environment.enableMockData = originalEnableMock;
    }));

    it('debería obtener el usuario actual', fakeAsync(() => {
      const originalEnableMock = environment.enableMockData;
      environment.enableMockData = true;

      expect(service.getCurrentUser()).toBeNull();

      service.login(mockCredentials).subscribe();
      tick(500);

      const currentUser = service.getCurrentUser();
      expect(currentUser).toBeTruthy();
      expect(currentUser?.username).toBeTruthy();

      environment.enableMockData = originalEnableMock;
    }));
  });
});

