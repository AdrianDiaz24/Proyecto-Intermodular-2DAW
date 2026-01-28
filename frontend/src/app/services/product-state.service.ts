/**
 * @fileoverview Servicio de gestión de estado de productos
 * Implementa patrón reactivo con BehaviorSubject + Signals
 * para actualizaciones dinámicas sin recargas
 */

import { Injectable, signal, computed, inject, DestroyRef } from '@angular/core';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { map, tap, catchError, finalize, distinctUntilChanged, shareReplay } from 'rxjs/operators';
import { ProductService } from './product.service';
import {
  Product,
  ProductCreateDto,
  ProductUpdateDto,
  ProductSearchParams,
  PaginatedResponse
} from '../models';

/**
 * Estado interno del servicio de productos
 */
interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
  selectedId: number | null;
  filters: ProductFilters;
  pagination: PaginationState;
}

/**
 * Filtros de productos
 */
export interface ProductFilters {
  searchTerm: string;
  brand: string;
}

/**
 * Estado de paginación
 */
export interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasMore: boolean;
}

/**
 * Estado inicial
 */
const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
  selectedId: null,
  filters: {
    searchTerm: '',
    brand: ''
  },
  pagination: {
    currentPage: 0,
    pageSize: 20,
    totalItems: 0,
    totalPages: 0,
    hasMore: true
  }
};

@Injectable({
  providedIn: 'root'
})
export class ProductStateService {
  private readonly productService = inject(ProductService);

  // ============================================================================
  // ESTADO CON BEHAVIORSUBJECT (para compatibilidad con async pipe)
  // ============================================================================
  
  private state$ = new BehaviorSubject<ProductState>(initialState);

  // Selectores como Observables (para usar con async pipe)
  readonly products$ = this.select(s => s.products);
  readonly loading$ = this.select(s => s.loading);
  readonly error$ = this.select(s => s.error);
  readonly filters$ = this.select(s => s.filters);
  readonly pagination$ = this.select(s => s.pagination);
  readonly selectedId$ = this.select(s => s.selectedId);

  // Selectores derivados
  readonly selectedProduct$ = this.products$.pipe(
    map(products => {
      const id = this.state$.value.selectedId;
      return products.find(p => p.id === id) || null;
    }),
    shareReplay(1)
  );

  readonly filteredProducts$ = this.createFilteredProductsObservable();

  readonly brands$ = this.products$.pipe(
    map(products => [...new Set(products.map(p => p.marca))].sort()),
    shareReplay(1)
  );

  readonly productCount$ = this.products$.pipe(
    map(products => products.length)
  );

  // ============================================================================
  // ESTADO CON SIGNALS (Angular 17+ - para nuevo código)
  // ============================================================================

  // Signals base
  readonly products = signal<Product[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly selectedId = signal<number | null>(null);
  readonly filters = signal<ProductFilters>({ searchTerm: '', brand: '' });
  readonly pagination = signal<PaginationState>(initialState.pagination);

  // Signals computados (derivados)
  readonly filteredProducts = computed(() => {
    const allProducts = this.products();
    const currentFilters = this.filters();
    
    return allProducts.filter(product => {
      // Filtro por marca
      if (currentFilters.brand && product.marca !== currentFilters.brand) {
        return false;
      }
      
      // Filtro por término de búsqueda
      if (currentFilters.searchTerm) {
        const term = currentFilters.searchTerm.toLowerCase();
        const matchesName = product.nombre.toLowerCase().includes(term);
        const matchesBrand = product.marca.toLowerCase().includes(term);
        const matchesModel = product.modelo?.toLowerCase().includes(term) || false;
        if (!matchesName && !matchesBrand && !matchesModel) {
          return false;
        }
      }
      
      return true;
    });
  });

  readonly selectedProduct = computed(() => {
    const id = this.selectedId();
    return this.products().find(p => p.id === id) || null;
  });

  readonly brands = computed(() => {
    const allBrands = this.products().map(p => p.marca);
    return [...new Set(allBrands)].sort();
  });

  readonly productCount = computed(() => this.products().length);
  readonly filteredCount = computed(() => this.filteredProducts().length);
  readonly hasMore = computed(() => this.pagination().hasMore);

  // ============================================================================
  // CONSTRUCTOR - Sincronización entre BehaviorSubject y Signals
  // ============================================================================

  constructor() {
    // Sincronizar BehaviorSubject con Signals
    this.state$.subscribe(state => {
      this.products.set(state.products);
      this.loading.set(state.loading);
      this.error.set(state.error);
      this.selectedId.set(state.selectedId);
      this.filters.set(state.filters);
      this.pagination.set(state.pagination);
    });
  }

  // ============================================================================
  // HELPERS PRIVADOS
  // ============================================================================

  /**
   * Selector genérico para crear observables del estado
   */
  private select<T>(selector: (state: ProductState) => T): Observable<T> {
    return this.state$.pipe(
      map(selector),
      distinctUntilChanged(),
      shareReplay(1)
    );
  }

  /**
   * Actualiza el estado de forma inmutable
   */
  private updateState(partial: Partial<ProductState>): void {
    const currentState = this.state$.value;
    this.state$.next({ ...currentState, ...partial });
  }

  /**
   * Crea el observable de productos filtrados
   */
  private createFilteredProductsObservable(): Observable<Product[]> {
    return this.state$.pipe(
      map(state => {
        const { products, filters } = state;
        
        return products.filter(product => {
          if (filters.brand && product.marca !== filters.brand) {
            return false;
          }
          
          if (filters.searchTerm) {
            const term = filters.searchTerm.toLowerCase();
            const matchesName = product.nombre.toLowerCase().includes(term);
            const matchesBrand = product.marca.toLowerCase().includes(term);
            const matchesModel = product.modelo?.toLowerCase().includes(term) || false;
            if (!matchesName && !matchesBrand && !matchesModel) {
              return false;
            }
          }
          
          return true;
        });
      }),
      shareReplay(1)
    );
  }

  // ============================================================================
  // ACCIONES - CRUD
  // ============================================================================

  /**
   * Carga inicial de productos
   */
  loadProducts(): void {
    this.updateState({ loading: true, error: null });
    
    this.productService.getProducts().pipe(
      tap(products => {
        this.updateState({
          products,
          loading: false,
          pagination: {
            ...this.state$.value.pagination,
            totalItems: products.length,
            totalPages: Math.ceil(products.length / this.state$.value.pagination.pageSize)
          }
        });
      }),
      catchError(error => {
        this.updateState({
          loading: false,
          error: 'Error al cargar productos'
        });
        return throwError(() => error);
      })
    ).subscribe();
  }

  /**
   * Carga productos con paginación
   */
  loadProductsPaginated(page: number = 0, append: boolean = false): void {
    const { pageSize } = this.state$.value.pagination;
    
    this.updateState({ loading: true, error: null });
    
    this.productService.getProductsPaginated({ page, size: pageSize }).pipe(
      tap(response => {
        const currentProducts = append ? this.state$.value.products : [];
        
        this.updateState({
          products: [...currentProducts, ...response.data],
          loading: false,
          pagination: {
            currentPage: response.pagination.currentPage,
            pageSize: response.pagination.pageSize,
            totalItems: response.pagination.totalItems,
            totalPages: response.pagination.totalPages,
            hasMore: response.pagination.hasNext
          }
        });
      }),
      catchError(error => {
        this.updateState({
          loading: false,
          error: 'Error al cargar productos'
        });
        return throwError(() => error);
      })
    ).subscribe();
  }

  /**
   * Carga más productos (scroll infinito)
   */
  loadMore(): void {
    const { currentPage, hasMore } = this.state$.value.pagination;
    
    if (!hasMore || this.state$.value.loading) {
      return;
    }
    
    this.loadProductsPaginated(currentPage + 1, true);
  }

  /**
   * Crear producto con actualización optimista
   */
  createProduct(productData: ProductCreateDto): Observable<Product> {
    const tempId = -Date.now();
    const optimisticProduct: Product = {
      ...productData,
      id: tempId,
      usuarioUsername: 'current_user'
    };
    
    // Actualización optimista
    const currentProducts = this.state$.value.products;
    this.updateState({
      products: [...currentProducts, optimisticProduct]
    });
    
    return this.productService.createProduct(productData).pipe(
      tap(savedProduct => {
        // Reemplazar producto temporal con el real
        const products = this.state$.value.products.map(p =>
          p.id === tempId ? savedProduct : p
        );
        this.updateState({ products });
      }),
      catchError(error => {
        // Revertir en caso de error
        const products = this.state$.value.products.filter(p => p.id !== tempId);
        this.updateState({
          products,
          error: 'Error al crear producto'
        });
        return throwError(() => error);
      })
    );
  }

  /**
   * Actualizar producto con actualización optimista
   */
  updateProduct(id: number, updates: ProductUpdateDto): Observable<Product> {
    const currentProducts = this.state$.value.products;
    const originalProduct = currentProducts.find(p => p.id === id);
    
    if (!originalProduct) {
      return throwError(() => new Error('Producto no encontrado'));
    }
    
    // Actualización optimista
    this.updateState({
      products: currentProducts.map(p =>
        p.id === id ? { ...p, ...updates } : p
      )
    });
    
    return this.productService.updateProduct(id, updates).pipe(
      tap(updatedProduct => {
        // Confirmar con datos del servidor
        const products = this.state$.value.products.map(p =>
          p.id === id ? updatedProduct : p
        );
        this.updateState({ products });
      }),
      catchError(error => {
        // Revertir en caso de error
        const products = this.state$.value.products.map(p =>
          p.id === id ? originalProduct : p
        );
        this.updateState({
          products,
          error: 'Error al actualizar producto'
        });
        return throwError(() => error);
      })
    );
  }

  /**
   * Eliminar producto con actualización optimista
   */
  deleteProduct(id: number): Observable<void> {
    const currentProducts = this.state$.value.products;
    const deletedProduct = currentProducts.find(p => p.id === id);
    
    if (!deletedProduct) {
      return throwError(() => new Error('Producto no encontrado'));
    }
    
    // Actualización optimista
    this.updateState({
      products: currentProducts.filter(p => p.id !== id)
    });
    
    // Limpiar selección si era el producto eliminado
    if (this.state$.value.selectedId === id) {
      this.updateState({ selectedId: null });
    }
    
    return this.productService.deleteProduct(id).pipe(
      catchError(error => {
        // Restaurar en caso de error
        this.updateState({
          products: [...this.state$.value.products, deletedProduct],
          error: 'Error al eliminar producto'
        });
        return throwError(() => error);
      })
    );
  }

  // ============================================================================
  // ACCIONES - SELECCIÓN Y FILTROS
  // ============================================================================

  /**
   * Seleccionar un producto
   */
  selectProduct(id: number | null): void {
    this.updateState({ selectedId: id });
  }

  /**
   * Actualizar filtro de búsqueda
   */
  setSearchTerm(term: string): void {
    this.updateState({
      filters: { ...this.state$.value.filters, searchTerm: term }
    });
  }

  /**
   * Actualizar filtro de marca
   */
  setBrandFilter(brand: string): void {
    this.updateState({
      filters: { ...this.state$.value.filters, brand }
    });
  }

  /**
   * Actualizar todos los filtros
   */
  setFilters(filters: Partial<ProductFilters>): void {
    this.updateState({
      filters: { ...this.state$.value.filters, ...filters }
    });
  }

  /**
   * Limpiar filtros
   */
  clearFilters(): void {
    this.updateState({
      filters: { searchTerm: '', brand: '' }
    });
  }

  /**
   * Limpiar error
   */
  clearError(): void {
    this.updateState({ error: null });
  }

  /**
   * Resetear estado completo
   */
  reset(): void {
    this.state$.next(initialState);
  }

  // ============================================================================
  // ACCIONES - PARA USO EXTERNO (WebSocket/Polling)
  // ============================================================================

  /**
   * Añadir producto a la lista (desde WebSocket)
   */
  addProductToList(product: Product): void {
    const exists = this.state$.value.products.some(p => p.id === product.id);
    if (!exists) {
      this.updateState({
        products: [...this.state$.value.products, product]
      });
    }
  }

  /**
   * Actualizar producto en la lista (desde WebSocket)
   */
  updateProductInList(product: Product): void {
    const products = this.state$.value.products.map(p =>
      p.id === product.id ? product : p
    );
    this.updateState({ products });
  }

  /**
   * Eliminar producto de la lista (desde WebSocket)
   */
  removeProductFromList(id: number): void {
    const products = this.state$.value.products.filter(p => p.id !== id);
    this.updateState({ products });
    
    if (this.state$.value.selectedId === id) {
      this.updateState({ selectedId: null });
    }
  }

  /**
   * Reemplazar todos los productos (desde polling)
   */
  setProducts(products: Product[]): void {
    this.updateState({ products });
  }
}

