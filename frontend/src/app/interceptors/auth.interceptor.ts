/**
 * @fileoverview Interceptor de autenticación
 * Añade automáticamente el token de autenticación a las peticiones HTTP
 */

import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Obtener el token del localStorage
    const token = localStorage.getItem(environment.tokenKey);

    // Si hay token, añadirlo al header
    if (token) {
      request = this.addTokenToRequest(request, token);
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Si es error 401, intentar refrescar el token
        if (error.status === 401 && token) {
          return this.handle401Error(request, next);
        }
        return throwError(() => error);
      })
    );
  }

  /**
   * Añade el token de autorización a la petición
   */
  private addTokenToRequest(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  /**
   * Maneja errores 401 intentando refrescar el token
   */
  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const refreshToken = localStorage.getItem(environment.refreshTokenKey);

      if (refreshToken) {
        return this.refreshToken(refreshToken).pipe(
          switchMap((response: any) => {
            this.isRefreshing = false;

            if (response.token) {
              localStorage.setItem(environment.tokenKey, response.token);
              this.refreshTokenSubject.next(response.token);
              return next.handle(this.addTokenToRequest(request, response.token));
            }

            // Si no hay nuevo token, hacer logout
            this.handleLogout();
            return throwError(() => new Error('Token refresh failed'));
          }),
          catchError((error) => {
            this.isRefreshing = false;
            this.handleLogout();
            return throwError(() => error);
          })
        );
      } else {
        this.isRefreshing = false;
        this.handleLogout();
        return throwError(() => new Error('No refresh token available'));
      }
    } else {
      // Esperar a que termine el refresh en curso
      return this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap((token) => {
          return next.handle(this.addTokenToRequest(request, token!));
        })
      );
    }
  }

  /**
   * Refresca el token de autenticación
   * En una implementación real, esto llamaría al endpoint de refresh
   */
  private refreshToken(refreshToken: string): Observable<any> {
    // TODO: Implementar llamada real al endpoint de refresh token
    // return this.http.post(`${environment.apiUrl}/auth/refresh`, { refreshToken });

    // Por ahora, simulamos que el refresh falla para forzar re-login
    return throwError(() => new Error('Refresh token endpoint not implemented'));
  }

  /**
   * Maneja el logout cuando el token no es válido
   */
  private handleLogout(): void {
    localStorage.removeItem(environment.tokenKey);
    localStorage.removeItem(environment.refreshTokenKey);
    localStorage.removeItem('currentUser');

    // Redirigir al login
    window.location.href = '/login';
  }
}

