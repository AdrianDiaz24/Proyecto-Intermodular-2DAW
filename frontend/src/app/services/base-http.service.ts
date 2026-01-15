/**
 * @fileoverview Servicio base HTTP con funcionalidades comunes
 * Proporciona métodos genéricos para operaciones CRUD y manejo de errores
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, timer } from 'rxjs';
import { catchError, retry, tap, finalize } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {
  PaginatedResponse,
  LoadingState,
  ErrorState,
  PaginationParams,
  FilterParams
} from '../models';

/**
 * Opciones para las peticiones HTTP
 */
export interface HttpRequestOptions {
  headers?: HttpHeaders | { [header: string]: string | string[] };
  params?: HttpParams | { [param: string]: string | string[] };
  reportProgress?: boolean;
  withCredentials?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class BaseHttpService {
  protected baseUrl = environment.apiUrl;

  // Estado de carga global
  private loadingSubject = new BehaviorSubject<LoadingState>({ isLoading: false });
  public loading$ = this.loadingSubject.asObservable();

  // Estado de error global
  private errorSubject = new BehaviorSubject<ErrorState | null>(null);
  public error$ = this.errorSubject.asObservable();

  // Contador de peticiones activas
  private activeRequests = 0;

  constructor(protected http: HttpClient) {}

  // ============================================================================
  // MÉTODOS CRUD GENÉRICOS
  // ============================================================================

  /**
   * GET - Obtener un recurso por ID
   */
  protected get<T>(endpoint: string, options?: HttpRequestOptions): Observable<T> {
    this.startLoading('GET');
    return this.http.get<T>(`${this.baseUrl}/${endpoint}`, options).pipe(
      retry({ count: environment.retryAttempts, delay: this.retryStrategy }),
      tap(() => this.clearError()),
      catchError(error => this.handleError(error)),
      finalize(() => this.stopLoading())
    );
  }

  /**
   * GET - Obtener lista de recursos
   */
  protected getAll<T>(endpoint: string, options?: HttpRequestOptions): Observable<T[]> {
    this.startLoading('GET_ALL');
    return this.http.get<T[]>(`${this.baseUrl}/${endpoint}`, options).pipe(
      retry({ count: environment.retryAttempts, delay: this.retryStrategy }),
      tap(() => this.clearError()),
      catchError(error => this.handleError(error)),
      finalize(() => this.stopLoading())
    );
  }

  /**
   * GET - Obtener recursos paginados
   */
  protected getPaginated<T>(
    endpoint: string,
    pagination?: PaginationParams,
    filters?: FilterParams
  ): Observable<PaginatedResponse<T>> {
    this.startLoading('GET_PAGINATED');
    const params = this.buildParams(pagination, filters);

    return this.http.get<PaginatedResponse<T>>(`${this.baseUrl}/${endpoint}`, { params }).pipe(
      retry({ count: environment.retryAttempts, delay: this.retryStrategy }),
      tap(() => this.clearError()),
      catchError(error => this.handleError(error)),
      finalize(() => this.stopLoading())
    );
  }

  /**
   * POST - Crear un nuevo recurso
   */
  protected post<T, R = T>(endpoint: string, body: T, options?: HttpRequestOptions): Observable<R> {
    this.startLoading('POST');
    return this.http.post<R>(`${this.baseUrl}/${endpoint}`, body, options).pipe(
      tap(() => this.clearError()),
      catchError(error => this.handleError(error)),
      finalize(() => this.stopLoading())
    );
  }

  /**
   * PUT - Actualizar un recurso completamente
   */
  protected put<T, R = T>(endpoint: string, body: T, options?: HttpRequestOptions): Observable<R> {
    this.startLoading('PUT');
    return this.http.put<R>(`${this.baseUrl}/${endpoint}`, body, options).pipe(
      tap(() => this.clearError()),
      catchError(error => this.handleError(error)),
      finalize(() => this.stopLoading())
    );
  }

  /**
   * PATCH - Actualizar parcialmente un recurso
   */
  protected patch<T, R = T>(endpoint: string, body: Partial<T>, options?: HttpRequestOptions): Observable<R> {
    this.startLoading('PATCH');
    return this.http.patch<R>(`${this.baseUrl}/${endpoint}`, body, options).pipe(
      tap(() => this.clearError()),
      catchError(error => this.handleError(error)),
      finalize(() => this.stopLoading())
    );
  }

  /**
   * DELETE - Eliminar un recurso
   */
  protected delete<T = void>(endpoint: string, options?: HttpRequestOptions): Observable<T> {
    this.startLoading('DELETE');
    return this.http.delete<T>(`${this.baseUrl}/${endpoint}`, options).pipe(
      tap(() => this.clearError()),
      catchError(error => this.handleError(error)),
      finalize(() => this.stopLoading())
    );
  }

  // ============================================================================
  // UPLOAD DE ARCHIVOS
  // ============================================================================

  /**
   * POST - Upload de archivo con FormData
   */
  protected uploadFile<T>(endpoint: string, file: File, additionalData?: Record<string, string>): Observable<T> {
    this.startLoading('UPLOAD');
    const formData = new FormData();
    formData.append('file', file, file.name);

    if (additionalData) {
      Object.keys(additionalData).forEach(key => {
        formData.append(key, additionalData[key]);
      });
    }

    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, formData, {
      reportProgress: true
    }).pipe(
      tap(() => this.clearError()),
      catchError(error => this.handleError(error)),
      finalize(() => this.stopLoading())
    );
  }

  /**
   * POST - Upload de múltiples archivos
   */
  protected uploadFiles<T>(endpoint: string, files: File[], additionalData?: Record<string, string>): Observable<T> {
    this.startLoading('UPLOAD_MULTIPLE');
    const formData = new FormData();

    files.forEach((file, index) => {
      formData.append(`files`, file, file.name);
    });

    if (additionalData) {
      Object.keys(additionalData).forEach(key => {
        formData.append(key, additionalData[key]);
      });
    }

    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, formData).pipe(
      tap(() => this.clearError()),
      catchError(error => this.handleError(error)),
      finalize(() => this.stopLoading())
    );
  }

  // ============================================================================
  // HELPERS
  // ============================================================================

  /**
   * Construye HttpParams desde objetos de paginación y filtros
   */
  protected buildParams(pagination?: PaginationParams, filters?: FilterParams): HttpParams {
    let params = new HttpParams();

    if (pagination) {
      if (pagination.page !== undefined) params = params.set('page', pagination.page.toString());
      if (pagination.size !== undefined) params = params.set('size', pagination.size.toString());
      if (pagination.sort) params = params.set('sort', pagination.sort);
      if (pagination.order) params = params.set('order', pagination.order);
    }

    if (filters) {
      Object.keys(filters).forEach(key => {
        const value = filters[key];
        if (value !== undefined && value !== null && value !== '') {
          params = params.set(key, value.toString());
        }
      });
    }

    return params;
  }

  /**
   * Crea headers personalizados
   */
  protected createHeaders(customHeaders?: Record<string, string>): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    if (customHeaders) {
      Object.keys(customHeaders).forEach(key => {
        headers = headers.set(key, customHeaders[key]);
      });
    }

    return headers;
  }

  // ============================================================================
  // MANEJO DE ESTADOS
  // ============================================================================

  /**
   * Inicia el estado de carga
   */
  private startLoading(operation?: string): void {
    this.activeRequests++;
    this.loadingSubject.next({ isLoading: true, operation });
  }

  /**
   * Detiene el estado de carga
   */
  private stopLoading(): void {
    this.activeRequests--;
    if (this.activeRequests <= 0) {
      this.activeRequests = 0;
      this.loadingSubject.next({ isLoading: false });
    }
  }

  /**
   * Limpia el estado de error
   */
  private clearError(): void {
    this.errorSubject.next(null);
  }

  // ============================================================================
  // MANEJO DE ERRORES
  // ============================================================================

  /**
   * Estrategia de reintentos
   */
  private retryStrategy = (error: HttpErrorResponse, retryCount: number): Observable<number> => {
    // No reintentar para errores del cliente (4xx) excepto 408 (timeout) y 429 (rate limit)
    if (error.status >= 400 && error.status < 500 && error.status !== 408 && error.status !== 429) {
      return throwError(() => error);
    }

    // Incrementar delay exponencialmente
    const delay = Math.pow(2, retryCount) * environment.retryDelay;
    console.log(`Reintentando petición... Intento ${retryCount + 1}/${environment.retryAttempts} en ${delay}ms`);
    return timer(delay);
  };

  /**
   * Maneja errores HTTP de forma centralizada
   */
  protected handleError(error: HttpErrorResponse): Observable<never> {
    let errorState: ErrorState;

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente o de red
      errorState = {
        hasError: true,
        message: 'Error de conexión. Por favor, verifica tu conexión a internet.',
        code: 'NETWORK_ERROR',
        retryable: true
      };
      console.error('Error del cliente:', error.error.message);
    } else {
      // Error del servidor
      errorState = this.parseServerError(error);
      console.error(`Error del servidor: ${error.status}`, error.error);
    }

    this.errorSubject.next(errorState);
    return throwError(() => errorState);
  }

  /**
   * Parsea errores del servidor
   */
  private parseServerError(error: HttpErrorResponse): ErrorState {
    const errorMessages: Record<number, string> = {
      400: 'Solicitud incorrecta. Por favor, verifica los datos enviados.',
      401: 'No autorizado. Por favor, inicia sesión nuevamente.',
      403: 'Acceso denegado. No tienes permisos para esta acción.',
      404: 'Recurso no encontrado.',
      408: 'La solicitud ha expirado. Intenta nuevamente.',
      409: 'Conflicto con el estado actual del recurso.',
      422: 'Los datos proporcionados no son válidos.',
      429: 'Demasiadas solicitudes. Por favor, espera un momento.',
      500: 'Error interno del servidor. Intenta más tarde.',
      502: 'Error de gateway. El servidor no responde.',
      503: 'Servicio no disponible. Intenta más tarde.',
      504: 'Tiempo de espera agotado. El servidor tardó demasiado.'
    };

    const message = error.error?.error?.message ||
                    errorMessages[error.status] ||
                    'Ha ocurrido un error inesperado.';

    return {
      hasError: true,
      message,
      code: error.error?.error?.code || `HTTP_${error.status}`,
      retryable: error.status >= 500 || error.status === 408 || error.status === 429
    };
  }

  // ============================================================================
  // MÉTODOS PÚBLICOS DE UTILIDAD
  // ============================================================================

  /**
   * Verifica si hay una carga activa
   */
  public isLoading(): boolean {
    return this.loadingSubject.value.isLoading;
  }

  /**
   * Obtiene el estado de error actual
   */
  public getCurrentError(): ErrorState | null {
    return this.errorSubject.value;
  }

  /**
   * Limpia el estado de error manualmente
   */
  public clearCurrentError(): void {
    this.clearError();
  }
}

