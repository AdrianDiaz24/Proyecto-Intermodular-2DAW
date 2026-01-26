/**
 * @fileoverview Interfaces para respuestas HTTP y modelos de datos
 * Define las estructuras de datos utilizadas en la comunicación con el backend
 */

// ============================================================================
// RESPUESTAS HTTP GENÉRICAS
// ============================================================================

/**
 * Respuesta base de la API
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp?: string;
}

/**
 * Respuesta de error de la API
 */
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

/**
 * Respuesta paginada
 */
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

/**
 * Parámetros de paginación para requests
 */
export interface PaginationParams {
  page?: number;
  size?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

/**
 * Parámetros de filtrado
 */
export interface FilterParams {
  [key: string]: string | number | boolean | undefined;
}

// ============================================================================
// MODELOS DE USUARIO
// ============================================================================

/**
 * Usuario del sistema (coincide con UsuarioDTO del backend)
 */
export interface User {
  id: number;
  username: string;
  email: string;
  telefono?: string;
  phone?: string;
  role: UserRole;
  profileImage?: string;
  memberSince?: Date | string;
}

/**
 * Roles de usuario
 */
export type UserRole = 'USER' | 'ADMIN';

/**
 * Datos para crear usuario (coincide con UsuarioCreateDTO del backend)
 */
export interface UserCreateDto {
  username: string;
  email: string;
  password: string;
  telefono?: string;
  role: UserRole;
}

export interface UserUpdateDto {
  username?: string;
  email?: string;
  password?: string;
  telefono?: string;
  role?: UserRole;
}

// ============================================================================
// MODELOS DE AUTENTICACIÓN
// ============================================================================

/**
 * Credenciales de login (coincide con LoginRequest del backend)
 */
export interface LoginCredentials {
  username: string;
  password: string;
}

/**
 * Datos de registro
 */
export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword?: string;
  telefono?: string;
  role?: UserRole;
}

/**
 * Respuesta de autenticación (coincide con LoginResponse del backend)
 */
export interface AuthResponse {
  token: string;
  userId: number;
  username: string;
  email: string;
  role: string;
}

/**
 * Token decodificado
 */
export interface DecodedToken {
  sub: string;
  iat: number;
  exp: number;
}

// ============================================================================
// MODELOS DE PRODUCTO
// ============================================================================

/**
 * Producto (coincide con ProductoDTO del backend)
 */
export interface Product {
  id: number;
  nombre: string;
  marca: string;
  modelo?: string;
  imagenBase64?: string;
  peso?: number;
  ancho?: number;
  largo?: number;
  alto?: number;
  consumoElectrico?: string;
  otrasCaracteristicas?: string;
  usuarioId: number;
  usuarioUsername: string;
}

/**
 * DTO para crear producto (coincide con ProductoCreateDTO del backend)
 */
export interface ProductCreateDto {
  nombre: string;
  marca: string;
  modelo?: string;
  imagenBase64?: string;
  peso?: number;
  ancho?: number;
  largo?: number;
  alto?: number;
  consumoElectrico?: string;
  otrasCaracteristicas?: string;
  usuarioId: number;
}

/**
 * DTO para actualizar producto (coincide con ProductoUpdateDTO del backend)
 */
export interface ProductUpdateDto {
  nombre?: string;
  marca?: string;
  modelo?: string;
  imagenBase64?: string;
  peso?: number;
  ancho?: number;
  largo?: number;
  alto?: number;
  consumoElectrico?: string;
  otrasCaracteristicas?: string;
}

/**
 * Filtros de búsqueda de productos
 */
export interface ProductSearchParams extends PaginationParams {
  query?: string;
  brand?: string;
  category?: string;
}

// ============================================================================
// MODELOS DE INCIDENCIA
// ============================================================================

/**
 * Severidad de incidencia (coincide con Incidencia.Severidad del backend)
 */
export type IncidenceSeverity = 'BAJO' | 'MEDIO' | 'ALTO';

/**
 * Estado de incidencia (coincide con Incidencia.Estado del backend)
 */
export type IncidenceStatus = 'ABIERTA' | 'EN_PROGRESO' | 'CERRADA';

/**
 * Categoría de incidencia (coincide con Incidencia.Categoria del backend)
 */
export type IncidenceCategory = 'FUNCIONALIDAD' | 'RENDIMIENTO' | 'APARIENCIA' | 'OTRO';

/**
 * Incidencia (coincide con IncidenciaDTO del backend)
 */
export interface Incidence {
  id: number;
  titulo: string;
  descripcion: string;
  categoria: IncidenceCategory;
  severidad: IncidenceSeverity;
  estado: IncidenceStatus;
  fechaCreacion: string;
  productoId?: number;
  productoNombre?: string;
  usuarioId: number;
  usuarioUsername: string;
  totalSoluciones?: number;
}

/**
 * DTO para crear incidencia (coincide con IncidenciaCreateDTO del backend)
 */
export interface IncidenceCreateDto {
  titulo: string;
  descripcion: string;
  categoria: IncidenceCategory;
  severidad: IncidenceSeverity;
  productoId?: number;
  usuarioId: number;
}

/**
 * DTO para actualizar incidencia (coincide con IncidenciaUpdateDTO del backend)
 */
export interface IncidenceUpdateDto {
  titulo?: string;
  descripcion?: string;
  categoria?: IncidenceCategory;
  severidad?: IncidenceSeverity;
  estado?: IncidenceStatus;
}

/**
 * Filtros de búsqueda de incidencias
 */
export interface IncidenceSearchParams extends PaginationParams {
  productId?: number;
  status?: IncidenceStatus;
  severity?: IncidenceSeverity;
  category?: IncidenceCategory;
  query?: string;
}

// ============================================================================
// MODELOS DE ESTADO DE UI
// ============================================================================

/**
 * Estado de carga para operaciones HTTP
 */
export interface LoadingState {
  isLoading: boolean;
  operation?: string;
}

/**
 * Estado de error
 */
export interface ErrorState {
  hasError: boolean;
  message?: string;
  code?: string;
  retryable?: boolean;
}

/**
 * Estado combinado para componentes
 */
export interface RequestState<T> {
  data: T | null;
  loading: boolean;
  error: ErrorState | null;
  lastUpdated?: Date;
}

// ============================================================================
// MODELOS DE UPLOAD
// ============================================================================

/**
 * Respuesta de upload de archivo
 */
export interface FileUploadResponse {
  success: boolean;
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

/**
 * Progreso de upload
 */
export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}
