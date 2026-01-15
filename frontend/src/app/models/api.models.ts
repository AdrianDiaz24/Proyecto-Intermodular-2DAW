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
 * Usuario del sistema
 */
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

/**
 * Roles de usuario
 */
export type UserRole = 'admin' | 'user' | 'moderator';

/**
 * Datos para crear/actualizar usuario
 */
export interface UserCreateDto {
  username: string;
  email: string;
  password: string;
  phone?: string;
}

export interface UserUpdateDto {
  username?: string;
  email?: string;
  phone?: string;
  profileImage?: string;
}

// ============================================================================
// MODELOS DE AUTENTICACIÓN
// ============================================================================

/**
 * Credenciales de login
 */
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * Datos de registro
 */
export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

/**
 * Respuesta de autenticación
 */
export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  refreshToken?: string;
  expiresIn?: number;
  error?: string;
}

/**
 * Token decodificado
 */
export interface DecodedToken {
  sub: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}

// ============================================================================
// MODELOS DE PRODUCTO
// ============================================================================

/**
 * Producto
 */
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

/**
 * Dimensiones del producto
 */
export interface ProductDimensions {
  width: string;
  height: string;
  depth: string;
}

/**
 * DTO para crear producto
 */
export interface ProductCreateDto {
  name: string;
  brand: string;
  model: string;
  image?: string;
  weight?: string;
  dimensions?: ProductDimensions;
  energyConsumption?: string;
  otherSpecs?: string;
}

/**
 * DTO para actualizar producto
 */
export interface ProductUpdateDto extends Partial<ProductCreateDto> {}

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
 * Severidad de incidencia
 */
export type IncidenceSeverity = 'low' | 'medium' | 'high';

/**
 * Estado de incidencia
 */
export type IncidenceStatus = 'pending' | 'in_progress' | 'resolved' | 'closed';

/**
 * Categoría de incidencia
 */
export type IncidenceCategory = 'functionality' | 'performance' | 'appearance' | 'safety' | 'other';

/**
 * Incidencia
 */
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

/**
 * DTO para crear incidencia
 */
export interface IncidenceCreateDto {
  productId: number;
  title: string;
  description: string;
  category: IncidenceCategory;
  severity: IncidenceSeverity;
}

/**
 * DTO para actualizar incidencia
 */
export interface IncidenceUpdateDto {
  title?: string;
  description?: string;
  category?: IncidenceCategory;
  severity?: IncidenceSeverity;
  status?: IncidenceStatus;
  assignedTo?: string;
  resolution?: string;
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

