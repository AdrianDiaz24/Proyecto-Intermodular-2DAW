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
  PaginatedResponse,
  FileUploadResponse
} from '../models';

// Re-exportar modelos para acceso desde otros archivos
export { Product, Incidence, ProductCreateDto, ProductUpdateDto, IncidenceCreateDto, IncidenceUpdateDto, PaginatedResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ProductService extends BaseHttpService {
  private readonly PRODUCTS_ENDPOINT = 'products';
  private readonly INCIDENCES_ENDPOINT = 'incidences';

  // Estado de carga específico del servicio
  private productLoadingSubject = new BehaviorSubject<boolean>(false);
  public productLoading$ = this.productLoadingSubject.asObservable();

  // Datos mock para desarrollo
  private mockProducts: Product[] = [
    {
      id: 1,
      name: 'Lavadora Samsung',
      brand: 'Samsung',
      model: 'WW90T534DTW',
      image: 'assets/icons/logoNaranja.avif',
      weight: '65 kg',
      dimensions: { width: '60 cm', height: '85 cm', depth: '55 cm' },
      energyConsumption: '152 kWh/año',
      otherSpecs: 'Capacidad 9kg, 1400 rpm, Tecnología EcoBubble'
    },
    {
      id: 2,
      name: 'Refrigerador LG',
      brand: 'LG',
      model: 'GBB72PZVCN1',
      image: 'assets/icons/logoNaranja.avif',
      weight: '70 kg',
      dimensions: { width: '59.5 cm', height: '203 cm', depth: '68 cm' },
      energyConsumption: '220 kWh/año',
      otherSpecs: 'Capacidad 384L, No Frost, DoorCooling+'
    },
    {
      id: 3,
      name: 'Horno Bosch',
      brand: 'Bosch',
      model: 'HBA5740S0',
      image: 'assets/icons/logoNaranja.avif',
      weight: '35 kg',
      dimensions: { width: '59.4 cm', height: '59.5 cm', depth: '54.8 cm' },
      energyConsumption: '0.87 kWh/ciclo',
      otherSpecs: 'Capacidad 71L, Pirolítico, Clase A'
    },
    {
      id: 4,
      name: 'Aire Acondicionado Daikin',
      brand: 'Daikin',
      model: 'TXF35C',
      image: 'assets/icons/logoNaranja.avif',
      weight: '28 kg',
      dimensions: { width: '77 cm', height: '28.5 cm', depth: '22.5 cm' },
      energyConsumption: '980 kWh/año',
      otherSpecs: '3000 frigorías, Inverter, WiFi'
    },
    {
      id: 5,
      name: 'Microondas Panasonic',
      brand: 'Panasonic',
      model: 'NN-GD38HSSUG',
      image: 'assets/icons/logoNaranja.avif',
      weight: '11 kg',
      dimensions: { width: '52.5 cm', height: '31 cm', depth: '40 cm' },
      energyConsumption: '1000 W',
      otherSpecs: 'Capacidad 23L, Grill, Inverter'
    },
    {
      id: 6,
      name: 'Lavavajillas Electrolux',
      brand: 'Electrolux',
      model: 'EEM48300L',
      image: 'assets/icons/logoNaranja.avif',
      weight: '38 kg',
      dimensions: { width: '60 cm', height: '82 cm', depth: '55 cm' },
      energyConsumption: '238 kWh/año',
      otherSpecs: '14 cubiertos, 8 programas, Clase C'
    },
    {
      id: 7,
      name: 'Lavadora LG',
      brand: 'LG',
      model: 'F4WV3008S6W',
      image: 'assets/icons/logoNaranja.avif',
      weight: '65 kg',
      dimensions: { width: '60 cm', height: '85 cm', depth: '56 cm' },
      energyConsumption: '152 kWh/año',
      otherSpecs: 'Capacidad 8kg, 1400 rpm, Motor Inverter Direct Drive'
    },
    {
      id: 8,
      name: 'Aspiradora LG',
      brand: 'LG',
      model: 'A9K-ULTRA1B',
      image: 'assets/icons/logoNaranja.avif',
      weight: '2.7 kg',
      dimensions: { width: '27 cm', height: '110 cm', depth: '25 cm' },
      energyConsumption: '400 W',
      otherSpecs: 'Inalámbrica, Autonomía 80 min, Tecnología Power Drive Mop'
    }
  ];

  private mockIncidences: Incidence[] = [
    {
      id: 1,
      productId: 1,
      title: 'La lavadora no centrifuga correctamente',
      description: 'Al poner el programa de centrifugado, la lavadora hace ruidos extraños y no alcanza la velocidad indicada.',
      category: 'functionality',
      severity: 'high',
      status: 'pending',
      createdAt: new Date('2026-01-10'),
      createdBy: 'usuario123'
    },
    {
      id: 2,
      productId: 1,
      title: 'Error E3 en pantalla',
      description: 'Aparece el código de error E3 después de 10 minutos de lavado.',
      category: 'functionality',
      severity: 'medium',
      status: 'resolved',
      createdAt: new Date('2026-01-08'),
      createdBy: 'maria_tech'
    },
    {
      id: 3,
      productId: 1,
      title: 'Puerta no cierra bien',
      description: 'La puerta de la lavadora no cierra correctamente, hay que hacer fuerza.',
      category: 'appearance',
      severity: 'low',
      status: 'pending',
      createdAt: new Date('2026-01-12'),
      createdBy: 'pepe_repair'
    },
    {
      id: 4,
      productId: 2,
      title: 'Batería se descarga rápido',
      description: 'La batería dura menos de 30 minutos cuando debería durar 80.',
      category: 'performance',
      severity: 'high',
      status: 'pending',
      createdAt: new Date('2026-01-11'),
      createdBy: 'carlos_fix'
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
  filterIncidences(productId: number, status?: 'pending' | 'resolved'): Observable<Incidence[]> {
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
  searchIncidences(productId: number, term: string, status?: 'pending' | 'resolved'): Observable<Incidence[]> {
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
      p.name.toLowerCase().includes(lowerTerm) ||
      p.brand.toLowerCase().includes(lowerTerm) ||
      p.model.toLowerCase().includes(lowerTerm)
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
      createdAt: new Date().toISOString()
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
        ...product,
        updatedAt: new Date().toISOString()
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
    let filtered = this.mockIncidences.filter(i => i.productId === productId);

    if (params?.status) {
      filtered = filtered.filter(i => i.status === params.status);
    }
    if (params?.severity) {
      filtered = filtered.filter(i => i.severity === params.severity);
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
      status: 'pending',
      createdAt: new Date(),
      createdBy: 'current_user'
    };
    this.mockIncidences.push(newIncidence);
    return of(newIncidence).pipe(delay(500));
  }

  private mockUpdateIncidence(id: number, incidence: IncidenceUpdateDto): Observable<Incidence> {
    const index = this.mockIncidences.findIndex(i => i.id === id);
    if (index !== -1) {
      this.mockIncidences[index] = {
        ...this.mockIncidences[index],
        ...incidence,
        updatedAt: new Date()
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

  private mockSearchIncidences(productId: number, term: string, status?: 'pending' | 'resolved'): Observable<Incidence[]> {
    const lowerTerm = term.toLowerCase();
    let filtered = this.mockIncidences.filter(i =>
      i.productId === productId &&
      (i.title.toLowerCase().includes(lowerTerm) ||
       i.description.toLowerCase().includes(lowerTerm))
    );
    if (status) {
      filtered = filtered.filter(i => i.status === status);
    }
    return of(filtered).pipe(delay(300));
  }
}

