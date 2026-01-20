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
  UserUpdateDto
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
   * @param credentials Credenciales de login (email y password)
   * @returns Observable con la respuesta de autenticación
   */
  login(credentials: LoginCredentials): Observable<AuthResponse>;
  login(email: string, password: string): Observable<AuthResponse>;
  login(emailOrCredentials: string | LoginCredentials, password?: string): Observable<AuthResponse> {
    const credentials: LoginCredentials = typeof emailOrCredentials === 'string'
      ? { email: emailOrCredentials, password: password! }
      : emailOrCredentials;

    // Si estamos en modo mock, usar datos simulados
    if (environment.enableMockData) {
      return this.mockLogin(credentials);
    }

    return this.post<LoginCredentials, AuthResponse>(`${this.AUTH_ENDPOINT}/login`, credentials).pipe(
      tap(response => this.handleAuthSuccess(response)),
      catchError(error => {
        console.error('Login error:', error);
        return throwError(() => ({
          success: false,
          error: error.message || 'Error de autenticación'
        }));
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
      ? { username: usernameOrData, email: email!, password: password!, confirmPassword: password! }
      : usernameOrData;

    // Si estamos en modo mock, usar datos simulados
    if (environment.enableMockData) {
      return this.mockRegister(data);
    }

    return this.post<RegisterData, AuthResponse>(`${this.AUTH_ENDPOINT}/register`, data).pipe(
      tap(response => this.handleAuthSuccess(response)),
      catchError(error => {
        console.error('Register error:', error);
        return throwError(() => ({
          success: false,
          error: error.message || 'Error de registro'
        }));
      })
    );
  }

  /**
   * Cierra la sesión del usuario
   */
  logout(): void {
    // Si hay API, notificar al servidor
    if (!environment.enableMockData) {
      this.post(`${this.AUTH_ENDPOINT}/logout`, {}).subscribe({
        error: (err) => console.error('Error al cerrar sesión en servidor:', err)
      });
    }

    this.clearAuthData();
    this.router.navigate(['/']);
  }

  /**
   * Refresca el token de autenticación
   */
  refreshToken(): Observable<AuthResponse> {
    const refreshToken = localStorage.getItem(environment.refreshTokenKey);

    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.post<{ refreshToken: string }, AuthResponse>(
      `${this.AUTH_ENDPOINT}/refresh`,
      { refreshToken }
    ).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem(environment.tokenKey, response.token);
          if (response.refreshToken) {
            localStorage.setItem(environment.refreshTokenKey, response.refreshToken);
          }
        }
      })
    );
  }

  /**
   * Obtiene el perfil del usuario actual desde el servidor
   */
  getProfile(): Observable<User> {
    return this.get<User>(`${this.AUTH_ENDPOINT}/profile`).pipe(
      tap(user => {
        this.currentUserSubject.next(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
      })
    );
  }

  /**
   * Actualiza los datos del usuario
   * @param userData Datos a actualizar
   */
  updateUser(userData: UserUpdateDto): Observable<User> {
    // Si estamos en modo mock, usar datos simulados
    if (environment.enableMockData) {
      return this.mockUpdateUser(userData);
    }

    return this.patch<UserUpdateDto, User>(`${this.AUTH_ENDPOINT}/profile`, userData).pipe(
      tap(updatedUser => {
        this.currentUserSubject.next(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      })
    );
  }

  /**
   * Cambia la contraseña del usuario
   */
  changePassword(currentPassword: string, newPassword: string): Observable<{ success: boolean }> {
    return this.post<any, { success: boolean }>(`${this.AUTH_ENDPOINT}/change-password`, {
      currentPassword,
      newPassword
    });
  }

  /**
   * Solicita recuperación de contraseña
   */
  forgotPassword(email: string): Observable<{ success: boolean; message: string }> {
    return this.post(`${this.AUTH_ENDPOINT}/forgot-password`, { email });
  }

  /**
   * Restablece la contraseña con token
   */
  resetPassword(token: string, newPassword: string): Observable<{ success: boolean }> {
    return this.post(`${this.AUTH_ENDPOINT}/reset-password`, { token, newPassword });
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

  // ============================================================================
  // MÉTODOS PRIVADOS
  // ============================================================================

  /**
   * Maneja el éxito de autenticación
   */
  private handleAuthSuccess(response: AuthResponse): void {
    if (response.success && response.user) {
      this.currentUserSubject.next(response.user);
      this.isLoggedInSubject.next(true);
      localStorage.setItem('currentUser', JSON.stringify(response.user));

      if (response.token) {
        localStorage.setItem(environment.tokenKey, response.token);
      }
      if (response.refreshToken) {
        localStorage.setItem(environment.refreshTokenKey, response.refreshToken);
      }
    }
  }

  /**
   * Limpia los datos de autenticación
   */
  private clearAuthData(): void {
    this.currentUserSubject.next(null);
    this.isLoggedInSubject.next(false);
    localStorage.removeItem('currentUser');
    localStorage.removeItem(environment.tokenKey);
    localStorage.removeItem(environment.refreshTokenKey);
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
        if (credentials.email && credentials.password.length >= 6) {
          const user: User = {
            id: 1,
            username: credentials.email.split('@')[0],
            email: credentials.email,
            memberSince: new Date('2026-01-10'),
            phone: '+34 612 345 678',
            profileImage: 'assets/icons/UsuarioBlanco.avif',
            joinDate: '2026-01-10'
          };

          const response: AuthResponse = {
            success: true,
            user,
            token: 'mock-jwt-token-' + Date.now(),
            refreshToken: 'mock-refresh-token-' + Date.now(),
            expiresIn: environment.tokenExpiry
          };

          this.handleAuthSuccess(response);
          return response;
        } else {
          return { success: false, error: 'Credenciales inválidas' };
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
          const user: User = {
            id: Math.floor(Math.random() * 1000),
            username: data.username,
            email: data.email,
            memberSince: new Date(),
            phone: '',
            profileImage: 'assets/icons/UsuarioBlanco.avif',
            joinDate: new Date().toISOString().split('T')[0]
          };

          const response: AuthResponse = {
            success: true,
            user,
            token: 'mock-jwt-token-' + Date.now(),
            refreshToken: 'mock-refresh-token-' + Date.now(),
            expiresIn: environment.tokenExpiry
          };

          this.handleAuthSuccess(response);
          return response;
        } else {
          return { success: false, error: 'Datos de registro inválidos' };
        }
      })
    );
  }

  /**
   * Simula la actualización de usuario
   */
  private mockUpdateUser(userData: UserUpdateDto): Observable<User> {
    return of(null).pipe(
      delay(500),
      map(() => {
        const currentUser = this.currentUserSubject.value;
        if (currentUser) {
          const updatedUser = { ...currentUser, ...userData };
          this.currentUserSubject.next(updatedUser);
          localStorage.setItem('currentUser', JSON.stringify(updatedUser));
          return updatedUser;
        }
        throw new Error('No user logged in');
      })
    );
  }
}

