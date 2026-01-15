/**
 * @fileoverview Interceptor de errores HTTP
 * Maneja errores globales de las peticiones HTTP
 */

import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

/**
 * Servicio de notificaciones (a implementar según necesidades)
 */
export interface NotificationService {
  showError(message: string): void;
  showWarning(message: string): void;
}

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // No interceptar errores 401 (los maneja AuthInterceptor)
        if (error.status === 401) {
          return throwError(() => error);
        }

        const errorMessage = this.getErrorMessage(error);

        // Log del error para debugging
        this.logError(error, request);

        // Mostrar notificación al usuario según el tipo de error
        this.showUserNotification(error, errorMessage);

        return throwError(() => error);
      })
    );
  }

  /**
   * Obtiene un mensaje de error legible
   */
  private getErrorMessage(error: HttpErrorResponse): string {
    if (error.error instanceof ErrorEvent) {
      // Error del cliente
      return `Error: ${error.error.message}`;
    }

    // Error del servidor
    if (error.error?.message) {
      return error.error.message;
    }

    // Mensajes predefinidos por código de estado
    switch (error.status) {
      case 0:
        return 'No se puede conectar con el servidor. Verifica tu conexión a internet.';
      case 400:
        return 'Solicitud incorrecta. Por favor, verifica los datos enviados.';
      case 403:
        return 'No tienes permisos para realizar esta acción.';
      case 404:
        return 'El recurso solicitado no fue encontrado.';
      case 409:
        return 'Conflicto: el recurso ya existe o hay un conflicto con el estado actual.';
      case 422:
        return 'Los datos proporcionados no son válidos.';
      case 429:
        return 'Demasiadas solicitudes. Por favor, espera un momento.';
      case 500:
        return 'Error interno del servidor. Por favor, intenta más tarde.';
      case 502:
        return 'Error de gateway. El servidor no está disponible.';
      case 503:
        return 'Servicio no disponible. Por favor, intenta más tarde.';
      case 504:
        return 'Tiempo de espera agotado. Por favor, intenta nuevamente.';
      default:
        return `Error inesperado (${error.status}). Por favor, intenta más tarde.`;
    }
  }

  /**
   * Registra el error para debugging
   */
  private logError(error: HttpErrorResponse, request: HttpRequest<any>): void {
    const errorInfo = {
      timestamp: new Date().toISOString(),
      status: error.status,
      statusText: error.statusText,
      url: request.url,
      method: request.method,
      message: error.message,
      error: error.error
    };

    console.group('🔴 HTTP Error');
    console.error('Request URL:', errorInfo.url);
    console.error('Method:', errorInfo.method);
    console.error('Status:', `${errorInfo.status} ${errorInfo.statusText}`);
    console.error('Message:', errorInfo.message);
    console.error('Response:', errorInfo.error);
    console.error('Timestamp:', errorInfo.timestamp);
    console.groupEnd();

    // TODO: Enviar a servicio de logging remoto (ej: Sentry, LogRocket)
    // this.loggingService.logError(errorInfo);
  }

  /**
   * Muestra notificación al usuario
   */
  private showUserNotification(error: HttpErrorResponse, message: string): void {
    // Solo mostrar notificaciones para errores relevantes al usuario
    // Evitar mostrar para errores de validación que se manejan en formularios

    const silentErrors = [400, 422]; // Errores manejados en formularios

    if (!silentErrors.includes(error.status)) {
      // TODO: Integrar con servicio de notificaciones/toasts
      // this.notificationService.showError(message);

      // Por ahora, usar console para desarrollo
      console.warn('📢 User notification:', message);
    }
  }
}

