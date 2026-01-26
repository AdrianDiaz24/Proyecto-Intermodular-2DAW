/**
 * @fileoverview Servicio de productos
 * Gestiona operaciones CRUD de productos e incidencias usando HttpClient
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, finalize } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { BaseHttpService } from './base-http.service';
import {
  Product,
  ProductCreateDto,
  ProductUpdateDto,
  ProductSearchParams,
  Incidence,
  IncidenceCreateDto,
  IncidenceUpdateDto,
  IncidenceSearchParams,
  IncidenceStatus,
  PaginatedResponse,
  FileUploadResponse
} from '../models';

// Re-exportar modelos para acceso desde otros archivos
export { Product, Incidence, ProductCreateDto, ProductUpdateDto, IncidenceCreateDto, IncidenceUpdateDto, PaginatedResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ProductService extends BaseHttpService {
  private readonly PRODUCTS_ENDPOINT = 'productos';
  private readonly INCIDENCES_ENDPOINT = 'incidencias';

  // Estado de carga específico del servicio
  private productLoadingSubject = new BehaviorSubject<boolean>(false);
  public productLoading$ = this.productLoadingSubject.asObservable();

  // Datos mock para desarrollo
  private mockProducts: Product[] = [
    {
      id: 1,
      nombre: 'Lavadora Samsung',
      marca: 'Samsung',
      modelo: 'WW90T534DTW',
      imagenBase64: undefined,
      peso: 65,
      ancho: 60,
      largo: 55,
      alto: 85,
      consumoElectrico: '152 kWh/año',
      otrasCaracteristicas: 'Capacidad 9kg, 1400 rpm, Tecnología EcoBubble',
      usuarioId: 1,
      usuarioUsername: 'admin'
    },
    {
      id: 2,
      nombre: 'Refrigerador LG',
      marca: 'LG',
      modelo: 'GBB72PZVCN1',
      imagenBase64: undefined,
      peso: 70,
      ancho: 59.5,
      largo: 68,
      alto: 203,
      consumoElectrico: '220 kWh/año',
      otrasCaracteristicas: 'Capacidad 384L, No Frost, DoorCooling+',
      usuarioId: 1,
      usuarioUsername: 'admin'
    },
    {
      id: 3,
      nombre: 'Horno Bosch',
      marca: 'Bosch',
      modelo: 'HBA5740S0',
      imagenBase64: undefined,
      peso: 35,
      ancho: 59.4,
      largo: 54.8,
      alto: 59.5,
      consumoElectrico: '0.87 kWh/ciclo',
      otrasCaracteristicas: 'Capacidad 71L, Pirolítico, Clase A',
      usuarioId: 1,
      usuarioUsername: 'admin'
    },
    {
      id: 4,
      nombre: 'Aire Acondicionado Daikin',
      marca: 'Daikin',
      modelo: 'TXF35C',
      imagenBase64: undefined,
      peso: 28,
      ancho: 77,
      largo: 22.5,
      alto: 28.5,
      consumoElectrico: '980 kWh/año',
      otrasCaracteristicas: '3000 frigorías, Inverter, WiFi',
      usuarioId: 1,
      usuarioUsername: 'admin'
    },
    {
      id: 5,
      nombre: 'Microondas Panasonic',
      marca: 'Panasonic',
      modelo: 'NN-GD38HSSUG',
      imagenBase64: undefined,
      peso: 11,
      ancho: 52.5,
      largo: 40,
      alto: 31,
      consumoElectrico: '1000 W',
      otrasCaracteristicas: 'Capacidad 23L, Grill, Inverter',
      usuarioId: 1,
      usuarioUsername: 'admin'
    }
  ];

  private mockIncidences: Incidence[] = [
    {
      id: 1,
      productoId: 1,
      titulo: 'La lavadora no centrifuga correctamente',
      descripcion: 'Al poner el programa de centrifugado, la lavadora hace ruidos extraños y no alcanza la velocidad indicada.',
      categoria: 'FUNCIONALIDAD',
      severidad: 'ALTO',
      estado: 'ABIERTA',
      fechaCreacion: '2026-01-10T10:00:00',
      usuarioId: 1,
      usuarioUsername: 'admin',
      totalSoluciones: 0
    },
    {
      id: 2,
      productoId: 1,
      titulo: 'Error E3 en pantalla',
      descripcion: 'Aparece el código de error E3 después de 10 minutos de lavado.',
      categoria: 'FUNCIONALIDAD',
      severidad: 'MEDIO',
      estado: 'CERRADA',
      fechaCreacion: '2026-01-08T14:30:00',
      usuarioId: 1,
      usuarioUsername: 'admin',
      totalSoluciones: 1
    },
    {
      id: 3,
      productoId: 1,
      titulo: 'Puerta no cierra bien',
      descripcion: 'La puerta de la lavadora no cierra correctamente, hay que hacer fuerza.',
      categoria: 'APARIENCIA',
      severidad: 'BAJO',
      estado: 'ABIERTA',
      fechaCreacion: '2026-01-12T09:15:00',
      usuarioId: 1,
      usuarioUsername: 'admin',
      totalSoluciones: 0
    },
    {
      id: 4,
      productoId: 2,
      titulo: 'No enfría correctamente',
      descripcion: 'El refrigerador no mantiene la temperatura adecuada.',
      categoria: 'RENDIMIENTO',
      severidad: 'ALTO',
      estado: 'ABIERTA',
      fechaCreacion: '2026-01-11T16:00:00',
      usuarioId: 1,
      usuarioUsername: 'admin',
      totalSoluciones: 0
    }
  ];

  constructor(protected override http: HttpClient) {
    super(http);
  }

  // ============================================================================
  // OPERACIONES CRUD DE PRODUCTOS
  // ============================================================================

  /**
   * Obtiene todos los productos
   * @param params Parámetros de búsqueda y paginación opcionales
   */
  getProducts(params?: ProductSearchParams): Observable<Product[]> {
    if (environment.enableMockData) {
      return this.mockGetProducts(params);
    }

    this.productLoadingSubject.next(true);
    return this.getAll<Product>(this.PRODUCTS_ENDPOINT, {
      params: this.buildParams(params)
    }).pipe(
      finalize(() => this.productLoadingSubject.next(false))
    );
  }

  /**
   * Obtiene productos con paginación
   */
  getProductsPaginated(params?: ProductSearchParams): Observable<PaginatedResponse<Product>> {
    if (environment.enableMockData) {
      return this.mockGetProductsPaginated(params);
    }

    return this.getPaginated<Product>(this.PRODUCTS_ENDPOINT, params);
  }

  /**
   * Obtiene un producto por su ID
   * @param id ID del producto
   */
  getProductById(id: number): Observable<Product | undefined> {
    if (environment.enableMockData) {
      return this.mockGetProductById(id);
    }

    this.productLoadingSubject.next(true);
    return this.get<Product>(`${this.PRODUCTS_ENDPOINT}/${id}`).pipe(
      finalize(() => this.productLoadingSubject.next(false))
    );
  }

  /**
   * Busca productos por término
   * @param term Término de búsqueda
   * @param params Parámetros adicionales de búsqueda
   */
  searchProducts(term: string, params?: ProductSearchParams): Observable<Product[]> {
    if (environment.enableMockData) {
      return this.mockSearchProducts(term);
    }

    const searchParams = { ...params, query: term };
    return this.getAll<Product>(`${this.PRODUCTS_ENDPOINT}/search`, {
      params: this.buildParams(searchParams)
    });
  }

  /**
   * Crea un nuevo producto
   * @param product Datos del producto a crear
   */
  createProduct(product: ProductCreateDto): Observable<Product> {
    if (environment.enableMockData) {
      return this.mockCreateProduct(product);
    }

    return this.post<ProductCreateDto, Product>(this.PRODUCTS_ENDPOINT, product);
  }

  /**
   * Actualiza un producto existente
   * @param id ID del producto
   * @param product Datos a actualizar
   */
  updateProduct(id: number, product: ProductUpdateDto): Observable<Product> {
    if (environment.enableMockData) {
      return this.mockUpdateProduct(id, product);
    }

    return this.put<ProductUpdateDto, Product>(`${this.PRODUCTS_ENDPOINT}/${id}`, product);
  }

  /**
   * Actualiza parcialmente un producto
   * @param id ID del producto
   * @param product Datos parciales a actualizar
   */
  patchProduct(id: number, product: Partial<ProductUpdateDto>): Observable<Product> {
    if (environment.enableMockData) {
      return this.mockUpdateProduct(id, product);
    }

    return this.patch<ProductUpdateDto, Product>(`${this.PRODUCTS_ENDPOINT}/${id}`, product);
  }

  /**
   * Elimina un producto
   * @param id ID del producto
   */
  deleteProduct(id: number): Observable<void> {
    if (environment.enableMockData) {
      return this.mockDeleteProduct(id);
    }

    return this.delete<void>(`${this.PRODUCTS_ENDPOINT}/${id}`);
  }

  /**
   * Sube imagen de producto
   * @param productId ID del producto
   * @param file Archivo de imagen
   */
  uploadProductImage(productId: number, file: File): Observable<FileUploadResponse> {
    if (environment.enableMockData) {
      return this.mockUploadImage(file);
    }

    return this.uploadFile<FileUploadResponse>(
      `${this.PRODUCTS_ENDPOINT}/${productId}/image`,
      file
    );
  }

  // ============================================================================
  // OPERACIONES CRUD DE INCIDENCIAS
  // ============================================================================

  /**
   * Obtiene las incidencias de un producto
   * @param productId ID del producto
   * @param params Parámetros de búsqueda
   */
  getIncidencesByProductId(productId: number, params?: IncidenceSearchParams): Observable<Incidence[]> {
    if (environment.enableMockData) {
      return this.mockGetIncidences(productId, params);
    }

    return this.getAll<Incidence>(`${this.PRODUCTS_ENDPOINT}/${productId}/${this.INCIDENCES_ENDPOINT}`, {
      params: this.buildParams(params)
    });
  }

  /**
   * Obtiene una incidencia por ID
   * @param id ID de la incidencia
   */
  getIncidenceById(id: number): Observable<Incidence | undefined> {
    if (environment.enableMockData) {
      return this.mockGetIncidenceById(id);
    }

    return this.get<Incidence>(`${this.INCIDENCES_ENDPOINT}/${id}`);
  }

  /**
   * Crea una nueva incidencia
   * @param incidence Datos de la incidencia
   */
  createIncidence(incidence: IncidenceCreateDto): Observable<Incidence> {
    if (environment.enableMockData) {
      return this.mockCreateIncidence(incidence);
    }

    return this.post<IncidenceCreateDto, Incidence>(this.INCIDENCES_ENDPOINT, incidence);
  }

  /**
   * Alias para compatibilidad con código existente
   */
  addIncidence(incidence: Omit<Incidence, 'id' | 'createdAt'>): Observable<Incidence> {
    return this.createIncidence(incidence as IncidenceCreateDto);
  }

  /**
   * Actualiza una incidencia
   * @param id ID de la incidencia
   * @param incidence Datos a actualizar
   */
  updateIncidence(id: number, incidence: IncidenceUpdateDto): Observable<Incidence> {
    if (environment.enableMockData) {
      return this.mockUpdateIncidence(id, incidence);
    }

    return this.patch<IncidenceUpdateDto, Incidence>(`${this.INCIDENCES_ENDPOINT}/${id}`, incidence);
  }

  /**
   * Elimina una incidencia
   * @param id ID de la incidencia
   */
  deleteIncidence(id: number): Observable<void> {
    if (environment.enableMockData) {
      return this.mockDeleteIncidence(id);
    }

    return this.delete<void>(`${this.INCIDENCES_ENDPOINT}/${id}`);
  }

  /**
   * Filtra incidencias por estado
   * @param productId ID del producto
   * @param status Estado a filtrar
   */
  filterIncidences(productId: number, status?: IncidenceStatus): Observable<Incidence[]> {
    const params: IncidenceSearchParams = { productId };
    if (status) {
      params.status = status;
    }
    return this.getIncidencesByProductId(productId, params);
  }

  /**
   * Busca incidencias por término
   * @param productId ID del producto
   * @param term Término de búsqueda
   * @param status Estado opcional
   */
  searchIncidences(productId: number, term: string, status?: IncidenceStatus): Observable<Incidence[]> {
    if (environment.enableMockData) {
      return this.mockSearchIncidences(productId, term, status);
    }

    const params: IncidenceSearchParams = { productId, query: term };
    if (status) {
      params.status = status;
    }
    return this.getAll<Incidence>(`${this.INCIDENCES_ENDPOINT}/search`, {
      params: this.buildParams(params)
    });
  }

  // ============================================================================
  // MÉTODOS MOCK (para desarrollo sin backend)
  // ============================================================================

  private mockGetProducts(params?: ProductSearchParams): Observable<Product[]> {
    this.productLoadingSubject.next(true);
    return of(this.mockProducts).pipe(
      delay(500),
      finalize(() => this.productLoadingSubject.next(false))
    );
  }

  private mockGetProductsPaginated(params?: ProductSearchParams): Observable<PaginatedResponse<Product>> {
    const page = params?.page || 0;
    const size = params?.size || environment.defaultPageSize;
    const start = page * size;
    const items = this.mockProducts.slice(start, start + size);

    return of({
      success: true,
      data: items,
      pagination: {
        currentPage: page,
        pageSize: size,
        totalItems: this.mockProducts.length,
        totalPages: Math.ceil(this.mockProducts.length / size),
        hasNext: start + size < this.mockProducts.length,
        hasPrevious: page > 0
      }
    }).pipe(delay(500));
  }

  private mockGetProductById(id: number): Observable<Product | undefined> {
    this.productLoadingSubject.next(true);
    return of(this.mockProducts.find(p => p.id === id)).pipe(
      delay(800),
      finalize(() => this.productLoadingSubject.next(false))
    );
  }

  private mockSearchProducts(term: string): Observable<Product[]> {
    this.productLoadingSubject.next(true);
    const lowerTerm = term.toLowerCase();
    const results = this.mockProducts.filter(p =>
      p.nombre.toLowerCase().includes(lowerTerm) ||
      p.marca.toLowerCase().includes(lowerTerm) ||
      (p.modelo && p.modelo.toLowerCase().includes(lowerTerm))
    );
    return of(results).pipe(
      delay(500),
      finalize(() => this.productLoadingSubject.next(false))
    );
  }

  private mockCreateProduct(product: ProductCreateDto): Observable<Product> {
    const newProduct: Product = {
      ...product,
      id: Math.max(...this.mockProducts.map(p => p.id)) + 1,
      usuarioId: product.usuarioId,
      usuarioUsername: 'current_user'
    };
    this.mockProducts.push(newProduct);
    return of(newProduct).pipe(delay(500));
  }

  /**
   * Alias para compatibilidad con código existente
   */
  addProduct(product: Omit<Product, 'id'>): Observable<Product> {
    return this.createProduct(product as ProductCreateDto);
  }

  private mockUpdateProduct(id: number, product: Partial<ProductUpdateDto>): Observable<Product> {
    const index = this.mockProducts.findIndex(p => p.id === id);
    if (index !== -1) {
      this.mockProducts[index] = {
        ...this.mockProducts[index],
        ...product
      };
      return of(this.mockProducts[index]).pipe(delay(500));
    }
    return throwError(() => ({ message: 'Product not found' }));
  }

  private mockDeleteProduct(id: number): Observable<void> {
    const index = this.mockProducts.findIndex(p => p.id === id);
    if (index !== -1) {
      this.mockProducts.splice(index, 1);
      return of(void 0).pipe(delay(500));
    }
    return throwError(() => ({ message: 'Product not found' }));
  }

  private mockUploadImage(file: File): Observable<FileUploadResponse> {
    return of({
      success: true,
      url: URL.createObjectURL(file),
      filename: file.name,
      size: file.size,
      mimeType: file.type
    }).pipe(delay(1000));
  }

  private mockGetIncidences(productId: number, params?: IncidenceSearchParams): Observable<Incidence[]> {
    let filtered = this.mockIncidences.filter(i => i.productoId === productId);

    if (params?.status) {
      filtered = filtered.filter(i => i.estado === params.status);
    }
    if (params?.severity) {
      filtered = filtered.filter(i => i.severidad === params.severity);
    }

    return of(filtered).pipe(delay(300));
  }

  private mockGetIncidenceById(id: number): Observable<Incidence | undefined> {
    return of(this.mockIncidences.find(i => i.id === id)).pipe(delay(300));
  }

  private mockCreateIncidence(incidence: IncidenceCreateDto): Observable<Incidence> {
    const newIncidence: Incidence = {
      ...incidence,
      id: Math.max(...this.mockIncidences.map(i => i.id)) + 1,
      estado: 'ABIERTA',
      fechaCreacion: new Date().toISOString(),
      usuarioUsername: 'current_user',
      totalSoluciones: 0
    };
    this.mockIncidences.push(newIncidence);
    return of(newIncidence).pipe(delay(500));
  }

  private mockUpdateIncidence(id: number, incidence: IncidenceUpdateDto): Observable<Incidence> {
    const index = this.mockIncidences.findIndex(i => i.id === id);
    if (index !== -1) {
      this.mockIncidences[index] = {
        ...this.mockIncidences[index],
        ...incidence
      };
      return of(this.mockIncidences[index]).pipe(delay(500));
    }
    return throwError(() => ({ message: 'Incidence not found' }));
  }

  private mockDeleteIncidence(id: number): Observable<void> {
    const index = this.mockIncidences.findIndex(i => i.id === id);
    if (index !== -1) {
      this.mockIncidences.splice(index, 1);
      return of(void 0).pipe(delay(500));
    }
    return throwError(() => ({ message: 'Incidence not found' }));
  }

  private mockSearchIncidences(productId: number, term: string, status?: IncidenceStatus): Observable<Incidence[]> {
    const lowerTerm = term.toLowerCase();
    let filtered = this.mockIncidences.filter(i =>
      i.productoId === productId &&
      (i.titulo.toLowerCase().includes(lowerTerm) ||
       i.descripcion.toLowerCase().includes(lowerTerm))
    );
    if (status) {
      filtered = filtered.filter(i => i.estado === status);
    }
    return of(filtered).pipe(delay(300));
  }
}

