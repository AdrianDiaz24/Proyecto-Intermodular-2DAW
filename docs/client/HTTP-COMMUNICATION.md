# Comunicación HTTP con el Backend

---

## 1. Configuración de HttpClient

### 1.1 Importación de HttpClientModule

El módulo `HttpClientModule` se importa en el módulo principal de la aplicación para habilitar las comunicaciones HTTP.

**Archivo:** `app.module.ts`

```typescript
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

@NgModule({
    imports: [
        BrowserModule,
        CommonModule,
        HttpClientModule, // Habilita peticiones HTTP
        RouterModule.forRoot(appRoutes, { ... }),
        ReactiveFormsModule,
        FormsModule
    ],
    // ...
})
export class AppModule { }
```

### 1.2 Configuración del Entorno

**Archivo:** `environments/environment.ts`

```typescript
export const environment = {
  production: false,
  
  // API Configuration
  apiUrl: 'http://localhost:8080/api',
  apiVersion: 'v1',
  
  // Timeouts (en milisegundos)
  httpTimeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000,
  
  // Feature flags
  enableLogging: true,
  enableMockData: false, // true para desarrollo sin backend
  
  // Authentication
  tokenKey: 'auth_token',
  refreshTokenKey: 'refresh_token',
  tokenExpiry: 3600,
  
  // Pagination defaults
  defaultPageSize: 10,
  maxPageSize: 100
};
```

### 1.3 Servicio Base HTTP

El servicio `BaseHttpService` proporciona métodos genéricos para todas las operaciones CRUD.

**Archivo:** `services/base-http.service.ts`

```typescript
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

  constructor(protected http: HttpClient) {}

  // Métodos CRUD genéricos disponibles:
  // - get<T>(endpoint, options)
  // - getAll<T>(endpoint, options)
  // - getPaginated<T>(endpoint, pagination, filters)
  // - post<T, R>(endpoint, body, options)
  // - put<T, R>(endpoint, body, options)
  // - patch<T, R>(endpoint, body, options)
  // - delete<T>(endpoint, options)
  // - uploadFile<T>(endpoint, file, additionalData)
  // - uploadFiles<T>(endpoint, files, additionalData)
}
```

---

## 2. Operaciones CRUD Completas

### 2.1 GET - Obtener Recursos

```typescript
// Obtener un elemento por ID
protected get<T>(endpoint: string, options?: HttpRequestOptions): Observable<T> {
  this.startLoading('GET');
  return this.http.get<T>(`${this.baseUrl}/${endpoint}`, options).pipe(
    retry({ count: environment.retryAttempts, delay: this.retryStrategy }),
    tap(() => this.clearError()),
    catchError(error => this.handleError(error)),
    finalize(() => this.stopLoading())
  );
}

// Obtener lista de elementos
protected getAll<T>(endpoint: string, options?: HttpRequestOptions): Observable<T[]> {
  this.startLoading('GET_ALL');
  return this.http.get<T[]>(`${this.baseUrl}/${endpoint}`, options).pipe(
    retry({ count: environment.retryAttempts, delay: this.retryStrategy }),
    tap(() => this.clearError()),
    catchError(error => this.handleError(error)),
    finalize(() => this.stopLoading())
  );
}
```

**Uso en servicio de productos:**

```typescript
// ProductService
getProducts(params?: ProductSearchParams): Observable<Product[]> {
  return this.getAll<Product>('products', {
    params: this.buildParams(params)
  });
}

getProductById(id: number): Observable<Product | undefined> {
  return this.get<Product>(`products/${id}`);
}
```

### 2.2 POST - Crear Recursos

```typescript
protected post<T, R = T>(endpoint: string, body: T, options?: HttpRequestOptions): Observable<R> {
  this.startLoading('POST');
  return this.http.post<R>(`${this.baseUrl}/${endpoint}`, body, options).pipe(
    tap(() => this.clearError()),
    catchError(error => this.handleError(error)),
    finalize(() => this.stopLoading())
  );
}
```

**Uso:**

```typescript
// Crear producto
createProduct(product: ProductCreateDto): Observable<Product> {
  return this.post<ProductCreateDto, Product>('products', product);
}

// Login de usuario
login(credentials: LoginCredentials): Observable<AuthResponse> {
  return this.post<LoginCredentials, AuthResponse>('auth/login', credentials);
}
```

### 2.3 PUT/PATCH - Actualizar Recursos

```typescript
// Actualización completa
protected put<T, R = T>(endpoint: string, body: T, options?: HttpRequestOptions): Observable<R> {
  this.startLoading('PUT');
  return this.http.put<R>(`${this.baseUrl}/${endpoint}`, body, options).pipe(
    tap(() => this.clearError()),
    catchError(error => this.handleError(error)),
    finalize(() => this.stopLoading())
  );
}

// Actualización parcial
protected patch<T, R = T>(endpoint: string, body: Partial<T>, options?: HttpRequestOptions): Observable<R> {
  this.startLoading('PATCH');
  return this.http.patch<R>(`${this.baseUrl}/${endpoint}`, body, options).pipe(
    tap(() => this.clearError()),
    catchError(error => this.handleError(error)),
    finalize(() => this.stopLoading())
  );
}
```

**Uso:**

```typescript
// Actualización completa de producto
updateProduct(id: number, product: ProductUpdateDto): Observable<Product> {
  return this.put<ProductUpdateDto, Product>(`products/${id}`, product);
}

// Actualización parcial del perfil
updateUser(userData: UserUpdateDto): Observable<User> {
  return this.patch<UserUpdateDto, User>('auth/profile', userData);
}
```

### 2.4 DELETE - Eliminar Recursos

```typescript
protected delete<T = void>(endpoint: string, options?: HttpRequestOptions): Observable<T> {
  this.startLoading('DELETE');
  return this.http.delete<T>(`${this.baseUrl}/${endpoint}`, options).pipe(
    tap(() => this.clearError()),
    catchError(error => this.handleError(error)),
    finalize(() => this.stopLoading())
  );
}
```

**Uso:**

```typescript
deleteProduct(id: number): Observable<void> {
  return this.delete<void>(`products/${id}`);
}

deleteIncidence(id: number): Observable<void> {
  return this.delete<void>(`incidences/${id}`);
}
```

---

## 3. Manejo de Respuestas

### 3.1 Tipado de Respuestas con Interfaces TypeScript

**Archivo:** `models/api.models.ts`

```typescript
// Respuesta base de la API
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp?: string;
}

// Respuesta de error
export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: string[];
    field?: string;
  };
  timestamp: string;
}

// Respuesta paginada
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}
```

**Modelos de dominio:**

```typescript
// Usuario
export interface User {
  id: number;
  username: string;
  email: string;
  memberSince: Date | string;
  phone?: string;
  profileImage?: string;
  joinDate?: string;
  role?: UserRole;
}

// Producto
export interface Product {
  id: number;
  name: string;
  brand: string;
  model: string;
  image?: string;
  weight?: string;
  dimensions?: ProductDimensions;
  energyConsumption?: string;
  otherSpecs?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Incidencia
export interface Incidence {
  id: number;
  productId: number;
  title: string;
  description: string;
  category: IncidenceCategory;
  severity: IncidenceSeverity;
  status: IncidenceStatus;
  createdAt: Date | string;
  updatedAt?: Date | string;
  createdBy: string;
  assignedTo?: string;
  resolution?: string;
}
```

### 3.2 Transformación de Datos con map

```typescript
// Transformar fechas de string a Date
getProducts(): Observable<Product[]> {
  return this.http.get<Product[]>(`${this.baseUrl}/products`).pipe(
    map(products => products.map(p => ({
      ...p,
      createdAt: p.createdAt ? new Date(p.createdAt) : undefined,
      updatedAt: p.updatedAt ? new Date(p.updatedAt) : undefined
    })))
  );
}

// Transformar respuesta API a modelo de dominio
getIncidences(productId: number): Observable<Incidence[]> {
  return this.http.get<ApiResponse<Incidence[]>>(`${this.baseUrl}/incidences`).pipe(
    map(response => response.data),
    map(incidences => incidences.filter(i => i.productId === productId))
  );
}
```

### 3.3 Manejo de Errores con catchError

```typescript
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
  } else {
    // Error del servidor
    errorState = this.parseServerError(error);
  }

  this.errorSubject.next(errorState);
  return throwError(() => errorState);
}

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

  return {
    hasError: true,
    message: error.error?.error?.message || errorMessages[error.status] || 'Error inesperado.',
    code: error.error?.error?.code || `HTTP_${error.status}`,
    retryable: error.status >= 500 || error.status === 408 || error.status === 429
  };
}
```

### 3.4 Retry Logic para Peticiones Fallidas

```typescript
private retryStrategy = (error: HttpErrorResponse, retryCount: number): Observable<number> => {
  // No reintentar para errores del cliente (4xx) excepto timeout y rate limit
  if (error.status >= 400 && error.status < 500 && error.status !== 408 && error.status !== 429) {
    return throwError(() => error);
  }
  
  // Incrementar delay exponencialmente (exponential backoff)
  const delay = Math.pow(2, retryCount) * environment.retryDelay;
  console.log(`Reintentando... Intento ${retryCount + 1}/${environment.retryAttempts} en ${delay}ms`);
  return timer(delay);
};

// Uso en peticiones
return this.http.get<T>(url).pipe(
  retry({ count: environment.retryAttempts, delay: this.retryStrategy }),
  catchError(error => this.handleError(error))
);
```

---

## 4. Diferentes Formatos de Datos

### 4.1 JSON (Principal)

```typescript
// Headers por defecto para JSON
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
```

### 4.2 FormData para Upload de Archivos

```typescript
// Upload de un archivo
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
    catchError(error => this.handleError(error)),
    finalize(() => this.stopLoading())
  );
}

// Upload de múltiples archivos
protected uploadFiles<T>(endpoint: string, files: File[]): Observable<T> {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file, file.name);
  });

  return this.http.post<T>(`${this.baseUrl}/${endpoint}`, formData);
}
```

**Uso:**

```typescript
// Subir imagen de producto
uploadProductImage(productId: number, file: File): Observable<FileUploadResponse> {
  return this.uploadFile<FileUploadResponse>(
    `products/${productId}/image`,
    file
  );
}
```

---

## 5. Query Params y Headers Personalizados

### 5.1 Query Params para Filtros y Paginación

```typescript
// Interfaces de parámetros
export interface PaginationParams {
  page?: number;
  size?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface FilterParams {
  [key: string]: string | number | boolean | undefined;
}

// Construcción de HttpParams
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
```

**Uso:**

```typescript
// Búsqueda con paginación y filtros
searchProducts(term: string, params?: ProductSearchParams): Observable<Product[]> {
  const searchParams = { ...params, query: term };
  return this.getAll<Product>('products/search', {
    params: this.buildParams(searchParams)
  });
}

// Ejemplo de URL generada:
// GET /api/products/search?query=lavadora&page=0&size=10&brand=LG&sort=name&order=asc
```

### 5.2 Headers Personalizados

```typescript
// Petición con headers custom
protected get<T>(endpoint: string, options?: HttpRequestOptions): Observable<T> {
  const headers = new HttpHeaders({
    'X-Custom-Header': 'valor',
    'Accept-Language': 'es-ES'
  });
  
  return this.http.get<T>(`${this.baseUrl}/${endpoint}`, { 
    ...options, 
    headers 
  });
}
```

---

## 6. Estados de Carga y Error

### 6.1 Loading State Durante Peticiones

```typescript
// Estado de carga
export interface LoadingState {
  isLoading: boolean;
  operation?: string;
}

// Implementación en servicio base
private loadingSubject = new BehaviorSubject<LoadingState>({ isLoading: false });
public loading$ = this.loadingSubject.asObservable();

private activeRequests = 0;

private startLoading(operation?: string): void {
  this.activeRequests++;
  this.loadingSubject.next({ isLoading: true, operation });
}

private stopLoading(): void {
  this.activeRequests--;
  if (this.activeRequests <= 0) {
    this.activeRequests = 0;
    this.loadingSubject.next({ isLoading: false });
  }
}
```

**Uso en componentes:**

```typescript
// Componente
@Component({...})
export class ProductListComponent implements OnInit {
  loading$ = this.productService.loading$;
  
  constructor(private productService: ProductService) {}
}

// Template
<div *ngIf="loading$ | async" class="loading-overlay">
  <app-loading-spinner></app-loading-spinner>
</div>

<div *ngIf="!(loading$ | async)">
  <!-- Contenido -->
</div>
```

### 6.2 Error State con Mensajes al Usuario

```typescript
// Estado de error
export interface ErrorState {
  hasError: boolean;
  message?: string;
  code?: string;
  retryable?: boolean;
}

// Observable de errores
private errorSubject = new BehaviorSubject<ErrorState | null>(null);
public error$ = this.errorSubject.asObservable();
```

**Uso en componentes:**

```html
<!-- Template con manejo de errores -->
<app-alert 
  *ngIf="error$ | async as error"
  [type]="'error'"
  [dismissible]="true">
  {{ error.message }}
  <button *ngIf="error.retryable" (click)="retry()">Reintentar</button>
</app-alert>
```

### 6.3 Empty State Cuando No Hay Datos

```html
<!-- Template con empty state -->
<ng-container *ngIf="products$ | async as products">
  <div *ngIf="products.length === 0" class="empty-state">
    <img src="assets/images/empty.svg" alt="Sin resultados">
    <h3>No hay productos disponibles</h3>
    <p>Intenta con otros criterios de búsqueda</p>
    <app-button (click)="clearFilters()">Limpiar filtros</app-button>
  </div>
  
  <div *ngIf="products.length > 0" class="products-grid">
    <app-card *ngFor="let product of products" [product]="product"></app-card>
  </div>
</ng-container>
```

### 6.4 Success Feedback Después de Operaciones

```typescript
// Servicio con feedback
createProduct(product: ProductCreateDto): Observable<Product> {
  return this.post<ProductCreateDto, Product>('products', product).pipe(
    tap(created => {
      // Notificar éxito
      this.notificationService.success(`Producto "${created.name}" creado correctamente`);
    })
  );
}

// En componente
onSubmit(): void {
  this.productService.createProduct(this.form.value).subscribe({
    next: (product) => {
      this.router.navigate(['/products', product.id]);
    },
    error: (error) => {
      // El error ya se maneja en el interceptor
    }
  });
}
```

---

## 7. Interceptores HTTP

### 7.1 Interceptor de Autenticación

**Archivo:** `interceptors/auth.interceptor.ts`

```typescript
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem(environment.tokenKey);

    // Añadir token a todas las peticiones
    if (token) {
      request = this.addTokenToRequest(request, token);
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && token) {
          return this.handle401Error(request, next);
        }
        return throwError(() => error);
      })
    );
  }

  private addTokenToRequest(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Lógica de refresh token...
  }
}
```

### 7.2 Interceptor de Manejo Global de Errores

**Archivo:** `interceptors/error.interceptor.ts`

```typescript
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // No interceptar 401 (lo maneja AuthInterceptor)
        if (error.status === 401) {
          return throwError(() => error);
        }

        const errorMessage = this.getErrorMessage(error);
        this.logError(error, request);
        this.showUserNotification(error, errorMessage);

        return throwError(() => error);
      })
    );
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    // Mensajes predefinidos por código de estado
    const messages: Record<number, string> = {
      0: 'No se puede conectar con el servidor.',
      400: 'Solicitud incorrecta.',
      403: 'No tienes permisos para esta acción.',
      404: 'Recurso no encontrado.',
      500: 'Error interno del servidor.',
      // ...
    };
    return error.error?.message || messages[error.status] || 'Error inesperado.';
  }
}
```

### 7.3 Interceptor de Logging

**Archivo:** `interceptors/logging.interceptor.ts`

```typescript
@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
  private requestCounter = 0;

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!environment.enableLogging) {
      return next.handle(request);
    }

    const requestId = this.generateRequestId();
    const startTime = Date.now();

    this.logRequest(requestId, request);

    return next.handle(request).pipe(
      tap({
        next: (event) => {
          if (event instanceof HttpResponse) {
            this.logResponse(requestId, event, Date.now() - startTime);
          }
        },
        error: (error) => {
          this.logError(requestId, error, Date.now() - startTime);
        }
      })
    );
  }

  private logRequest(requestId: string, request: HttpRequest<any>): void {
    console.group(`🌐 [${requestId}] HTTP Request`);
    console.log(`${request.method} ${request.urlWithParams}`);
    console.groupEnd();
  }

  private logResponse(requestId: string, response: HttpResponse<any>, duration: number): void {
    console.group(`✅ [${requestId}] HTTP Response`);
    console.log(`Status: ${response.status} | Duration: ${duration}ms`);
    console.groupEnd();
  }
}
```

### 7.4 Configuración de Interceptores

**Archivo:** `app.module.ts`

```typescript
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { LoggingInterceptor } from './interceptors/logging.interceptor';

@NgModule({
  providers: [
    // El orden de los interceptores importa
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoggingInterceptor,  // 1º: Logging (antes de enviar)
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,     // 2º: Añadir token
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,    // 3º: Manejo de errores
      multi: true
    }
  ]
})
export class AppModule { }
```

---

## 8. Catálogo de Endpoints Consumidos

### 8.1 Autenticación

| Método | Endpoint | Descripción | Body | Response |
|--------|----------|-------------|------|----------|
| POST | `/auth/login` | Login de usuario | `LoginCredentials` | `AuthResponse` |
| POST | `/auth/register` | Registro de usuario | `RegisterData` | `AuthResponse` |
| POST | `/auth/logout` | Cerrar sesión | - | `{ success: boolean }` |
| POST | `/auth/refresh` | Refrescar token | `{ refreshToken }` | `AuthResponse` |
| GET | `/auth/profile` | Obtener perfil | - | `User` |
| PATCH | `/auth/profile` | Actualizar perfil | `UserUpdateDto` | `User` |
| POST | `/auth/change-password` | Cambiar contraseña | `{ currentPassword, newPassword }` | `{ success }` |
| POST | `/auth/forgot-password` | Recuperar contraseña | `{ email }` | `{ success, message }` |
| POST | `/auth/reset-password` | Restablecer contraseña | `{ token, newPassword }` | `{ success }` |

### 8.2 Productos

| Método | Endpoint | Descripción | Body | Response |
|--------|----------|-------------|------|----------|
| GET | `/products` | Listar productos | - | `Product[]` |
| GET | `/products?page=0&size=10` | Listar paginado | - | `PaginatedResponse<Product>` |
| GET | `/products/:id` | Obtener producto | - | `Product` |
| GET | `/products/search?query=term` | Buscar productos | - | `Product[]` |
| POST | `/products` | Crear producto | `ProductCreateDto` | `Product` |
| PUT | `/products/:id` | Actualizar producto | `ProductUpdateDto` | `Product` |
| PATCH | `/products/:id` | Actualizar parcial | `Partial<ProductUpdateDto>` | `Product` |
| DELETE | `/products/:id` | Eliminar producto | - | `void` |
| POST | `/products/:id/image` | Subir imagen | `FormData` | `FileUploadResponse` |

### 8.3 Incidencias

| Método | Endpoint | Descripción | Body | Response |
|--------|----------|-------------|------|----------|
| GET | `/products/:id/incidences` | Incidencias de producto | - | `Incidence[]` |
| GET | `/incidences/:id` | Obtener incidencia | - | `Incidence` |
| GET | `/incidences/search?query=term` | Buscar incidencias | - | `Incidence[]` |
| POST | `/incidences` | Crear incidencia | `IncidenceCreateDto` | `Incidence` |
| PATCH | `/incidences/:id` | Actualizar incidencia | `IncidenceUpdateDto` | `Incidence` |
| DELETE | `/incidences/:id` | Eliminar incidencia | - | `void` |

---

## 9. Estructura de Datos (Interfaces)

```
models/
├── api.models.ts
│   ├── ApiResponse<T>        # Respuesta genérica
│   ├── ApiError              # Error de API
│   ├── PaginatedResponse<T>  # Respuesta paginada
│   ├── PaginationParams      # Parámetros de paginación
│   ├── FilterParams          # Parámetros de filtrado
│   │
│   ├── User                  # Usuario
│   ├── UserRole              # Roles de usuario
│   ├── UserCreateDto         # DTO crear usuario
│   ├── UserUpdateDto         # DTO actualizar usuario
│   │
│   ├── LoginCredentials      # Credenciales login
│   ├── RegisterData          # Datos registro
│   ├── AuthResponse          # Respuesta auth
│   ├── DecodedToken          # Token decodificado
│   │
│   ├── Product               # Producto
│   ├── ProductDimensions     # Dimensiones producto
│   ├── ProductCreateDto      # DTO crear producto
│   ├── ProductUpdateDto      # DTO actualizar producto
│   ├── ProductSearchParams   # Parámetros búsqueda
│   │
│   ├── Incidence             # Incidencia
│   ├── IncidenceSeverity     # Severidad (low/medium/high)
│   ├── IncidenceStatus       # Estado (pending/resolved/...)
│   ├── IncidenceCategory     # Categoría
│   ├── IncidenceCreateDto    # DTO crear incidencia
│   ├── IncidenceUpdateDto    # DTO actualizar incidencia
│   │
│   ├── LoadingState          # Estado de carga
│   ├── ErrorState            # Estado de error
│   ├── RequestState<T>       # Estado combinado
│   │
│   ├── FileUploadResponse    # Respuesta upload
│   └── UploadProgress        # Progreso upload
│
└── index.ts                  # Re-exports
```

---

## 10. Diagrama de Flujo de Peticiones HTTP

```
┌─────────────┐     ┌───────────────────┐     ┌──────────────────┐
│  Componente │────▶│ ProductService    │────▶│ BaseHttpService  │
└─────────────┘     └───────────────────┘     └──────────────────┘
                                                       │
                                                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                         INTERCEPTORS                              │
├─────────────────────────────────────────────────────────────────┤
│  1. LoggingInterceptor    → Log de request                       │
│  2. AuthInterceptor       → Añade token Bearer                   │
│  3. ErrorInterceptor      → Captura errores                      │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
                    ┌───────────────────┐
                    │   HttpClient      │
                    │   (Angular)       │
                    └───────────────────┘
                                │
                                ▼
                    ┌───────────────────┐
                    │   Backend API     │
                    │   (Spring Boot)   │
                    └───────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                         RESPONSE FLOW                            │
├─────────────────────────────────────────────────────────────────┤
│  ← ErrorInterceptor    → Procesa errores, muestra notificación  │
│  ← AuthInterceptor     → Maneja 401, refresh token              │
│  ← LoggingInterceptor  → Log de response/error                  │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BaseHttpService                             │
├─────────────────────────────────────────────────────────────────┤
│  • retry()     → Reintenta si es error 5xx                      │
│  • catchError  → Convierte a ErrorState                         │
│  • tap         → Limpia errores previos                         │
│  • finalize    → Actualiza loading state                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## 11. Modo Mock para Desarrollo

Para desarrollar sin backend, se puede activar el modo mock en `environment.ts`:

```typescript
export const environment = {
  // ...
  enableMockData: true, // Activa datos simulados
  // ...
};
```

Los servicios detectan automáticamente este flag y devuelven datos simulados:

```typescript
// En ProductService
getProducts(params?: ProductSearchParams): Observable<Product[]> {
  if (environment.enableMockData) {
    return this.mockGetProducts(params); // Devuelve datos mock
  }
  
  return this.getAll<Product>(this.PRODUCTS_ENDPOINT, {
    params: this.buildParams(params)
  });
}
```

---

## 12. Resumen de Archivos Creados/Modificados

```
frontend/src/
├── environments/
│   ├── environment.ts        # Config desarrollo
│   └── environment.prod.ts   # Config producción
│
├── app/
│   ├── models/
│   │   ├── api.models.ts     # Interfaces TypeScript
│   │   └── index.ts          # Re-exports
│   │
│   ├── services/
│   │   ├── base-http.service.ts  # Servicio base HTTP
│   │   ├── auth.service.ts       # Servicio autenticación
│   │   ├── product.service.ts    # Servicio productos
│   │   └── index.ts              # Re-exports
│   │
│   ├── interceptors/
│   │   ├── auth.interceptor.ts     # Añade token
│   │   ├── error.interceptor.ts    # Manejo errores
│   │   ├── logging.interceptor.ts  # Logging requests
│   │   └── index.ts                # Re-exports
│   │
│   └── app.module.ts         # Configuración módulo
```

