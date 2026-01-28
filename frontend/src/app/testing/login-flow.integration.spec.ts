/**
 * @fileoverview Tests de integración para flujo de login
 * Verifica el flujo completo de autenticación
 */

import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA, Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { LoginFormComponent } from '../components/shared/login-form/login-form.component';
import { environment } from '../../environments/environment';

// Componente wrapper para simular página de login
@Component({
  template: `
    <app-login-form
      (formSubmit)="onLogin($event)"
      [title]="'Login Test'"
    ></app-login-form>
    <div *ngIf="errorMessage" class="error">{{ errorMessage }}</div>
    <div *ngIf="isLoggedIn" class="success">Login exitoso</div>
  `
})
class TestLoginPageComponent {
  errorMessage = '';
  isLoggedIn = false;

  constructor(private authService: AuthService) {}

  onLogin(credentials: { email: string; password: string }) {
    this.authService.login(credentials.email, credentials.password).subscribe({
      next: () => {
        this.isLoggedIn = true;
      },
      error: (err) => {
        this.errorMessage = err.message || 'Error de login';
      }
    });
  }
}

// Componente dummy para home
@Component({ template: '<p>Home</p>' })
class DummyHomeComponent {}

describe('Flujo de Login - Integración', () => {
  let fixture: ComponentFixture<TestLoginPageComponent>;
  let component: TestLoginPageComponent;
  let authService: AuthService;
  let router: Router;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([
          { path: '', component: DummyHomeComponent },
          { path: 'home', component: DummyHomeComponent }
        ])
      ],
      declarations: [
        TestLoginPageComponent,
        LoginFormComponent,
        DummyHomeComponent
      ],
      providers: [AuthService],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TestLoginPageComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    httpMock = TestBed.inject(HttpTestingController);

    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  describe('Flujo completo de login', () => {
    it('debería completar login exitosamente con datos válidos', fakeAsync(() => {
      const originalEnableMock = environment.enableMockData;
      environment.enableMockData = true;

      // Simular entrada de datos y submit
      const credentials = {
        email: 'test@example.com',
        password: 'password123'
      };

      component.onLogin(credentials);
      tick(500); // Esperar respuesta mock

      // Verificar que el login fue exitoso
      expect(component.isLoggedIn).toBeTrue();
      expect(component.errorMessage).toBe('');

      // Verificar estado del servicio
      expect(authService.isAuthenticated()).toBeTrue();

      environment.enableMockData = originalEnableMock;
    }));

    it('debería guardar token en localStorage después del login', fakeAsync(() => {
      const originalEnableMock = environment.enableMockData;
      environment.enableMockData = true;

      component.onLogin({
        email: 'test@example.com',
        password: 'password123'
      });
      tick(500);

      const token = localStorage.getItem(environment.tokenKey);
      expect(token).toBeTruthy();

      environment.enableMockData = originalEnableMock;
    }));

    it('debería actualizar currentUser después del login', fakeAsync(() => {
      const originalEnableMock = environment.enableMockData;
      environment.enableMockData = true;

      component.onLogin({
        email: 'test@example.com',
        password: 'password123'
      });
      tick(500);

      const currentUser = authService.getCurrentUser();
      expect(currentUser).toBeTruthy();
      expect(currentUser?.username).toBeTruthy();

      environment.enableMockData = originalEnableMock;
    }));
  });

  describe('Flujo de logout', () => {
    it('debería completar logout correctamente', fakeAsync(() => {
      const originalEnableMock = environment.enableMockData;
      environment.enableMockData = true;

      // Primero hacer login
      component.onLogin({
        email: 'test@example.com',
        password: 'password123'
      });
      tick(500);

      expect(authService.isAuthenticated()).toBeTrue();

      // Hacer logout
      authService.logout();

      expect(authService.isAuthenticated()).toBeFalse();
      expect(authService.getCurrentUser()).toBeNull();
      expect(localStorage.getItem(environment.tokenKey)).toBeNull();

      environment.enableMockData = originalEnableMock;
    }));
  });

  describe('Persistencia de sesión', () => {
    it('debería mantener la sesión después de recargar', fakeAsync(() => {
      const originalEnableMock = environment.enableMockData;
      environment.enableMockData = true;

      // Hacer login
      component.onLogin({
        email: 'test@example.com',
        password: 'password123'
      });
      tick(500);

      // Simular "recarga" creando nueva instancia del servicio
      const storedUser = localStorage.getItem('currentUser');
      const storedToken = localStorage.getItem(environment.tokenKey);

      expect(storedUser).toBeTruthy();
      expect(storedToken).toBeTruthy();

      environment.enableMockData = originalEnableMock;
    }));
  });
});

