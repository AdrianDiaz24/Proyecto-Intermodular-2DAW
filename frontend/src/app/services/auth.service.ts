/**
 * @fileoverview Servicio de autenticación
 * Gestiona login, registro, logout y estado de autenticación usando HttpClient
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap, delay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { BaseHttpService } from './base-http.service';
import {
  User,
  AuthResponse,
  LoginCredentials,
  RegisterData,
  UserUpdateDto,
  UserCreateDto
} from '../models';

// Re-exportar modelos para acceso desde otros archivos
export { User, AuthResponse, LoginCredentials, RegisterData, UserUpdateDto } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseHttpService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();

  private readonly AUTH_ENDPOINT = 'auth';

  constructor(
    protected override http: HttpClient,
    private router: Router
  ) {
    super(http);
    this.initializeAuthState();
  }

  /**
   * Inicializa el estado de autenticación desde localStorage
   */
  private initializeAuthState(): void {
    const storedUser = localStorage.getItem('currentUser');
    const token = localStorage.getItem(environment.tokenKey);

    if (storedUser && token) {
      try {
        const user = JSON.parse(storedUser);
        this.currentUserSubject.next(user);
        this.isLoggedInSubject.next(true);
      } catch (e) {
        this.clearAuthData();
      }
    }
  }

  /**
   * Login de usuario
   * @param credentials Credenciales de login (username y password)
   * @returns Observable con la respuesta de autenticación
   */
  login(credentials: LoginCredentials): Observable<AuthResponse>;
  login(username: string, password: string): Observable<AuthResponse>;
  login(usernameOrCredentials: string | LoginCredentials, password?: string): Observable<AuthResponse> {
    const credentials: LoginCredentials = typeof usernameOrCredentials === 'string'
      ? { username: usernameOrCredentials, password: password! }
      : usernameOrCredentials;

    // Si estamos en modo mock, usar datos simulados
    if (environment.enableMockData) {
      return this.mockLogin(credentials);
    }

    return this.post<LoginCredentials, AuthResponse>(`${this.AUTH_ENDPOINT}/login`, credentials).pipe(
      tap(response => this.handleAuthSuccess(response)),
      catchError(error => {
        console.error('Login error:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Registro de nuevo usuario
   * @param userData Datos de registro
   * @returns Observable con la respuesta de autenticación
   */
  register(userData: RegisterData): Observable<AuthResponse>;
  register(username: string, email: string, password: string): Observable<AuthResponse>;
  register(
    usernameOrData: string | RegisterData,
    email?: string,
    password?: string
  ): Observable<AuthResponse> {
    const data: RegisterData = typeof usernameOrData === 'string'
      ? { username: usernameOrData, email: email!, password: password! }
      : usernameOrData;

    // Si estamos en modo mock, usar datos simulados
    if (environment.enableMockData) {
      return this.mockRegister(data);
    }

    // Crear el DTO para el backend
    const createDto: UserCreateDto = {
      username: data.username,
      email: data.email,
      password: data.password,
      telefono: data.telefono,
      role: data.role || 'USER'
    };

    return this.post<UserCreateDto, AuthResponse>(`${this.AUTH_ENDPOINT}/register`, createDto).pipe(
      tap(response => this.handleAuthSuccess(response)),
      catchError(error => {
        console.error('Register error:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Cierra la sesión del usuario
   */
  logout(): void {
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  // ============================================================================
  // MÉTODOS DE ACCESO SÍNCRONO
  // ============================================================================

  /**
   * Obtiene el usuario actual de forma síncrona
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Verifica si el usuario está autenticado de forma síncrona
   */
  isAuthenticated(): boolean {
    return this.isLoggedInSubject.value;
  }

  /**
   * Obtiene el token actual
   */
  getToken(): string | null {
    return localStorage.getItem(environment.tokenKey);
  }

  /**
   * Obtiene el ID del usuario actual
   */
  getCurrentUserId(): number | null {
    const user = this.currentUserSubject.value;
    return user ? user.id : null;
  }

  // ============================================================================
  // MÉTODOS PRIVADOS
  // ============================================================================

  /**
   * Maneja el éxito de autenticación
   */
  private handleAuthSuccess(response: AuthResponse): void {
    if (response && response.token) {
      // Construir el objeto User desde AuthResponse
      const user: User = {
        id: response.userId,
        username: response.username,
        email: response.email,
        role: response.role as 'USER' | 'ADMIN',
        memberSince: new Date()
      };

      this.currentUserSubject.next(user);
      this.isLoggedInSubject.next(true);
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem(environment.tokenKey, response.token);
    }
  }

  /**
   * Actualiza los datos del usuario
   * @param userData Datos a actualizar
   * @returns Observable con el usuario actualizado
   */
  updateUser(userData: Partial<User>): Observable<User> {
    const currentUser = this.currentUserSubject.value;
    if (!currentUser) {
      return throwError(() => new Error('No hay usuario autenticado'));
    }

    // Si estamos en modo mock, actualizar localmente
    if (environment.enableMockData) {
      const updatedUser: User = { ...currentUser, ...userData };
      this.currentUserSubject.next(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      return of(updatedUser);
    }

    return this.put<Partial<User>, User>(`usuarios/${currentUser.id}`, userData).pipe(
      tap(updatedUser => {
        this.currentUserSubject.next(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      }),
      catchError(error => {
        console.error('Update user error:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Limpia los datos de autenticación
   */
  private clearAuthData(): void {
    this.currentUserSubject.next(null);
    this.isLoggedInSubject.next(false);
    localStorage.removeItem('currentUser');
    localStorage.removeItem(environment.tokenKey);
  }

  // ============================================================================
  // MÉTODOS MOCK (para desarrollo sin backend)
  // ============================================================================

  /**
   * Simula el login de un usuario
   */
  private mockLogin(credentials: LoginCredentials): Observable<AuthResponse> {
    return of(null).pipe(
      delay(1000),
      map(() => {
        if (credentials.username && credentials.password.length >= 6) {
          const response: AuthResponse = {
            token: 'mock-jwt-token-' + Date.now(),
            userId: 1,
            username: credentials.username,
            email: credentials.username + '@example.com',
            role: 'USER'
          };

          this.handleAuthSuccess(response);
          return response;
        } else {
          throw new Error('Credenciales inválidas');
        }
      })
    );
  }

  /**
   * Simula el registro de un usuario
   */
  private mockRegister(data: RegisterData): Observable<AuthResponse> {
    return of(null).pipe(
      delay(1000),
      map(() => {
        if (data.username && data.email && data.password.length >= 6) {
          const response: AuthResponse = {
            token: 'mock-jwt-token-' + Date.now(),
            userId: Math.floor(Math.random() * 1000),
            username: data.username,
            email: data.email,
            role: 'USER'
          };

          this.handleAuthSuccess(response);
          return response;
        } else {
          throw new Error('Datos de registro inválidos');
        }
      })
    );
  }
}
