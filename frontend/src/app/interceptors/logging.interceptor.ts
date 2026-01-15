/**
 * @fileoverview Interceptor de logging HTTP
 * Registra todas las peticiones y respuestas HTTP para debugging
 */

import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';
import { environment } from '../../environments/environment';

/**
 * Estructura del log de petición HTTP
 */
interface HttpLog {
  id: string;
  timestamp: string;
  method: string;
  url: string;
  headers?: Record<string, string>;
  body?: any;
  duration?: number;
  status?: number;
  response?: any;
}

@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
  private requestCounter = 0;

  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Solo loggear si está habilitado en environment
    if (!environment.enableLogging) {
      return next.handle(request);
    }

    const requestId = this.generateRequestId();
    const startTime = Date.now();

    // Log de la petición saliente
    this.logRequest(requestId, request);

    return next.handle(request).pipe(
      tap({
        next: (event) => {
          if (event instanceof HttpResponse) {
            const duration = Date.now() - startTime;
            this.logResponse(requestId, event, duration);
          }
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          this.logError(requestId, error, duration);
        }
      }),
      finalize(() => {
        // Log adicional cuando la petición se completa
        const totalTime = Date.now() - startTime;
        this.logComplete(requestId, totalTime);
      })
    );
  }

  /**
   * Genera un ID único para cada petición
   */
  private generateRequestId(): string {
    this.requestCounter++;
    return `REQ-${Date.now()}-${this.requestCounter}`;
  }

  /**
   * Loggea la petición saliente
   */
  private logRequest(requestId: string, request: HttpRequest<any>): void {
    const log: HttpLog = {
      id: requestId,
      timestamp: new Date().toISOString(),
      method: request.method,
      url: request.urlWithParams
    };

    // Solo incluir body para métodos que lo tienen
    if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
      // No loggear datos sensibles
      log.body = this.sanitizeBody(request.body);
    }

    console.group(`🌐 [${requestId}] HTTP Request`);
    console.log(`%c${request.method}`, this.getMethodStyle(request.method), request.urlWithParams);

    if (log.body) {
      console.log('Body:', log.body);
    }

    // Loggear headers relevantes (no sensibles)
    const relevantHeaders = this.getRelevantHeaders(request);
    if (Object.keys(relevantHeaders).length > 0) {
      console.log('Headers:', relevantHeaders);
    }

    console.groupEnd();
  }

  /**
   * Loggea la respuesta exitosa
   */
  private logResponse(requestId: string, response: HttpResponse<any>, duration: number): void {
    const statusColor = response.status >= 200 && response.status < 300 ? '#4CAF50' : '#FF9800';

    console.group(`✅ [${requestId}] HTTP Response`);
    console.log(`%cStatus: ${response.status}`, `color: ${statusColor}; font-weight: bold`);
    console.log(`Duration: ${duration}ms`);

    // Loggear solo preview de la respuesta (evitar datos grandes)
    if (response.body) {
      const preview = this.getResponsePreview(response.body);
      console.log('Response:', preview);
    }

    console.groupEnd();
  }

  /**
   * Loggea errores de petición
   */
  private logError(requestId: string, error: any, duration: number): void {
    console.group(`❌ [${requestId}] HTTP Error`);
    console.error(`Status: ${error.status}`);
    console.error(`Duration: ${duration}ms`);
    console.error('Error:', error.message || error);
    console.groupEnd();
  }

  /**
   * Log de finalización
   */
  private logComplete(requestId: string, totalTime: number): void {
    if (totalTime > 3000) {
      console.warn(`⚠️ [${requestId}] Slow request: ${totalTime}ms`);
    }
  }

  /**
   * Sanitiza el body para evitar loggear datos sensibles
   */
  private sanitizeBody(body: any): any {
    if (!body) return null;

    const sensitiveFields = ['password', 'token', 'secret', 'apiKey', 'creditCard'];

    if (typeof body === 'object') {
      const sanitized = { ...body };
      sensitiveFields.forEach(field => {
        if (sanitized[field]) {
          sanitized[field] = '***HIDDEN***';
        }
      });
      return sanitized;
    }

    return body;
  }

  /**
   * Obtiene headers relevantes (no sensibles)
   */
  private getRelevantHeaders(request: HttpRequest<any>): Record<string, string> {
    const headers: Record<string, string> = {};
    const relevantHeaderNames = ['Content-Type', 'Accept', 'X-Request-ID'];

    relevantHeaderNames.forEach(name => {
      const value = request.headers.get(name);
      if (value) {
        headers[name] = value;
      }
    });

    return headers;
  }

  /**
   * Obtiene un preview de la respuesta (limitado en tamaño)
   */
  private getResponsePreview(body: any): any {
    if (!body) return null;

    const jsonString = JSON.stringify(body);

    // Si la respuesta es muy grande, mostrar solo preview
    if (jsonString.length > 1000) {
      if (Array.isArray(body)) {
        return {
          _preview: true,
          _type: 'Array',
          _length: body.length,
          _sample: body.slice(0, 2)
        };
      }
      return {
        _preview: true,
        _type: 'Object',
        _keys: Object.keys(body).slice(0, 10)
      };
    }

    return body;
  }

  /**
   * Obtiene el estilo CSS para el método HTTP
   */
  private getMethodStyle(method: string): string {
    const colors: Record<string, string> = {
      'GET': '#61affe',
      'POST': '#49cc90',
      'PUT': '#fca130',
      'PATCH': '#50e3c2',
      'DELETE': '#f93e3e'
    };

    const color = colors[method] || '#999';
    return `color: white; background: ${color}; padding: 2px 6px; border-radius: 3px; font-weight: bold`;
  }
}

