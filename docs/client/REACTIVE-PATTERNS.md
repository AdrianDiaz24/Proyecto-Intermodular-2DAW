# Patrones Reactivos - Guía de Implementación

> Ejemplos prácticos para ReparaFácil

---

## Índice

1. [Patrón de Estado con Signals](#1-patrón-de-estado-con-signals)
2. [Patrón de Estado con BehaviorSubject](#2-patrón-de-estado-con-behaviorsubject)
3. [Actualizaciones Optimistas](#3-actualizaciones-optimistas)
4. [Búsqueda con Debounce](#4-búsqueda-con-debounce)
5. [Scroll Infinito](#5-scroll-infinito)
6. [Gestión de Loading States](#6-gestión-de-loading-states)

---

## 1. Patrón de Estado con Signals

### Implementación para Incidencias

```typescript
// services/incidence-state.service.ts
import { Injectable, signal, computed } from '@angular/core';

export interface IncidenceFilters {
  status: 'all' | 'open' | 'closed';
  searchTerm: string;
  productId?: number;
}

@Injectable({ providedIn: 'root' })
export class IncidenceStateService {
  // Estado base
  private _incidences = signal<Incidence[]>([]);
  private _filters = signal<IncidenceFilters>({
    status: 'all',
    searchTerm: ''
  });
  private _loading = signal(false);
  
  // Selectores públicos (readonly)
  readonly incidences = this._incidences.asReadonly();
  readonly filters = this._filters.asReadonly();
  readonly loading = this._loading.asReadonly();
  
  // Estado derivado/computado
  readonly filteredIncidences = computed(() => {
    const all = this._incidences();
    const filters = this._filters();
    
    return all.filter(inc => {
      // Filtro por estado
      if (filters.status !== 'all') {
        const isOpen = inc.estado === 'ABIERTA';
        if (filters.status === 'open' && !isOpen) return false;
        if (filters.status === 'closed' && isOpen) return false;
      }
      
      // Filtro por búsqueda
      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        const matchTitle = inc.titulo.toLowerCase().includes(term);
        const matchDesc = inc.descripcion.toLowerCase().includes(term);
        if (!matchTitle && !matchDesc) return false;
      }
      
      // Filtro por producto
      if (filters.productId && inc.productoId !== filters.productId) {
        return false;
      }
      
      return true;
    });
  });
  
  // Contadores derivados
  readonly totalCount = computed(() => this._incidences().length);
  readonly openCount = computed(() => 
    this._incidences().filter(i => i.estado === 'ABIERTA').length
  );
  readonly closedCount = computed(() => 
    this._incidences().filter(i => i.estado === 'CERRADA').length
  );
  readonly filteredCount = computed(() => this.filteredIncidences().length);

  constructor(private incidenceService: ProductService) {}

  // Acciones
  loadIncidences(productId: number): void {
    this._loading.set(true);
    this._filters.update(f => ({ ...f, productId }));
    
    this.incidenceService.getIncidencesByProductId(productId).subscribe({
      next: (incidences) => {
        this._incidences.set(incidences);
        this._loading.set(false);
      },
      error: () => this._loading.set(false)
    });
  }

  setStatusFilter(status: 'all' | 'open' | 'closed'): void {
    this._filters.update(f => ({ ...f, status }));
  }

  setSearchTerm(term: string): void {
    this._filters.update(f => ({ ...f, searchTerm: term }));
  }

  addIncidence(incidence: Incidence): void {
    this._incidences.update(list => [...list, incidence]);
  }

  updateIncidence(id: number, updates: Partial<Incidence>): void {
    this._incidences.update(list =>
      list.map(inc => inc.id === id ? { ...inc, ...updates } : inc)
    );
  }

  removeIncidence(id: number): void {
    this._incidences.update(list => list.filter(inc => inc.id !== id));
  }

  markAsResolved(id: number): void {
    this.updateIncidence(id, { estado: 'CERRADA' });
  }
}
```

### Uso en Componente

```typescript
// pages/product/product.component.ts
@Component({
  selector: 'app-product',
  template: `
    <div class="product-detail">
      <!-- Filtros -->
      <div class="filters">
        <input 
          type="text" 
          [value]="incidenceState.filters().searchTerm"
          (input)="onSearch($event)"
          placeholder="Buscar incidencias...">
        
        <select (change)="onStatusChange($event)">
          <option value="all">Todas</option>
          <option value="open">Abiertas ({{ incidenceState.openCount() }})</option>
          <option value="closed">Cerradas ({{ incidenceState.closedCount() }})</option>
        </select>
      </div>

      <!-- Contador -->
      <p>Mostrando {{ incidenceState.filteredCount() }} de {{ incidenceState.totalCount() }}</p>

      <!-- Lista -->
      @if (incidenceState.loading()) {
        <app-loading></app-loading>
      } @else {
        @for (incidence of incidenceState.filteredIncidences(); track incidence.id) {
          <app-incidence-card 
            [incidence]="incidence"
            (resolve)="onResolve($event)">
          </app-incidence-card>
        } @empty {
          <p>No hay incidencias</p>
        }
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductComponent {
  incidenceState = inject(IncidenceStateService);

  onSearch(event: Event): void {
    const term = (event.target as HTMLInputElement).value;
    this.incidenceState.setSearchTerm(term);
  }

  onStatusChange(event: Event): void {
    const status = (event.target as HTMLSelectElement).value as 'all' | 'open' | 'closed';
    this.incidenceState.setStatusFilter(status);
  }

  onResolve(id: number): void {
    this.incidenceState.markAsResolved(id);
  }
}
```

---

## 2. Patrón de Estado con BehaviorSubject

### Servicio de Productos Mejorado

```typescript
// services/enhanced-product.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map, distinctUntilChanged, shareReplay } from 'rxjs/operators';

interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
  selectedId: number | null;
  filters: {
    brand: string;
    search: string;
  };
}

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
  selectedId: null,
  filters: {
    brand: '',
    search: ''
  }
};

@Injectable({ providedIn: 'root' })
export class EnhancedProductService {
  private state$ = new BehaviorSubject<ProductState>(initialState);

  // Selectores
  readonly products$ = this.select(s => s.products);
  readonly loading$ = this.select(s => s.loading);
  readonly error$ = this.select(s => s.error);
  readonly filters$ = this.select(s => s.filters);
  readonly selectedId$ = this.select(s => s.selectedId);

  // Selector derivado: producto seleccionado
  readonly selectedProduct$ = combineLatest([
    this.products$,
    this.selectedId$
  ]).pipe(
    map(([products, id]) => products.find(p => p.id === id) || null),
    shareReplay(1)
  );

  // Selector derivado: productos filtrados
  readonly filteredProducts$ = combineLatest([
    this.products$,
    this.filters$
  ]).pipe(
    map(([products, filters]) => {
      return products.filter(p => {
        if (filters.brand && p.marca !== filters.brand) return false;
        if (filters.search) {
          const term = filters.search.toLowerCase();
          if (!p.nombre.toLowerCase().includes(term)) return false;
        }
        return true;
      });
    }),
    shareReplay(1)
  );

  // Selector derivado: marcas únicas
  readonly brands$ = this.products$.pipe(
    map(products => [...new Set(products.map(p => p.marca))].sort()),
    shareReplay(1)
  );

  // Selector derivado: conteo
  readonly productCount$ = this.filteredProducts$.pipe(
    map(products => products.length)
  );

  constructor(private productService: ProductService) {}

  // Helper para crear selectores
  private select<T>(selector: (state: ProductState) => T): Observable<T> {
    return this.state$.pipe(
      map(selector),
      distinctUntilChanged(),
      shareReplay(1)
    );
  }

  // Actualizar estado
  private updateState(partial: Partial<ProductState>): void {
    this.state$.next({ ...this.state$.value, ...partial });
  }

  // ==================== ACCIONES ====================

  loadProducts(): void {
    this.updateState({ loading: true, error: null });
    
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.updateState({ products, loading: false });
      },
      error: (err) => {
        this.updateState({ 
          loading: false, 
          error: 'Error al cargar productos' 
        });
      }
    });
  }

  selectProduct(id: number | null): void {
    this.updateState({ selectedId: id });
  }

  setFilter(filter: Partial<ProductState['filters']>): void {
    this.updateState({
      filters: { ...this.state$.value.filters, ...filter }
    });
  }

  clearFilters(): void {
    this.updateState({
      filters: { brand: '', search: '' }
    });
  }

  addProduct(product: Product): void {
    const current = this.state$.value.products;
    this.updateState({ products: [...current, product] });
  }

  updateProduct(id: number, updates: Partial<Product>): void {
    const products = this.state$.value.products.map(p =>
      p.id === id ? { ...p, ...updates } : p
    );
    this.updateState({ products });
  }

  removeProduct(id: number): void {
    const products = this.state$.value.products.filter(p => p.id !== id);
    this.updateState({ products });
    
    // Limpiar selección si era el producto eliminado
    if (this.state$.value.selectedId === id) {
      this.updateState({ selectedId: null });
    }
  }
}
```

---

## 3. Actualizaciones Optimistas

### Patrón Completo

```typescript
// services/optimistic-crud.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError, finalize } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class OptimisticCrudService<T extends { id: number }> {
  protected items$ = new BehaviorSubject<T[]>([]);
  protected pendingOperations$ = new BehaviorSubject<Set<number>>(new Set());

  // Indicar qué items tienen operaciones pendientes
  isPending(id: number): Observable<boolean> {
    return this.pendingOperations$.pipe(
      map(pending => pending.has(id))
    );
  }

  protected optimisticCreate(
    item: Omit<T, 'id'>,
    apiCall: Observable<T>
  ): Observable<T> {
    const tempId = -Date.now(); // ID temporal negativo
    const optimisticItem = { ...item, id: tempId } as T;
    
    // 1. Añadir inmediatamente
    this.items$.next([...this.items$.value, optimisticItem]);
    this.markPending(tempId);

    return apiCall.pipe(
      tap(savedItem => {
        // 2. Reemplazar temporal con real
        const items = this.items$.value.map(i =>
          i.id === tempId ? savedItem : i
        );
        this.items$.next(items);
      }),
      catchError(error => {
        // 3. Revertir
        this.items$.next(this.items$.value.filter(i => i.id !== tempId));
        return throwError(() => error);
      }),
      finalize(() => this.unmarkPending(tempId))
    );
  }

  protected optimisticUpdate(
    id: number,
    updates: Partial<T>,
    apiCall: Observable<T>
  ): Observable<T> {
    const original = this.items$.value.find(i => i.id === id);
    if (!original) return throwError(() => new Error('Item not found'));

    // 1. Actualizar inmediatamente
    this.updateLocal(id, updates);
    this.markPending(id);

    return apiCall.pipe(
      tap(updatedItem => {
        // 2. Confirmar con datos del servidor
        this.updateLocal(id, updatedItem);
      }),
      catchError(error => {
        // 3. Revertir
        this.updateLocal(id, original);
        return throwError(() => error);
      }),
      finalize(() => this.unmarkPending(id))
    );
  }

  protected optimisticDelete(
    id: number,
    apiCall: Observable<void>
  ): Observable<void> {
    const original = this.items$.value.find(i => i.id === id);
    if (!original) return throwError(() => new Error('Item not found'));

    // 1. Eliminar inmediatamente
    this.items$.next(this.items$.value.filter(i => i.id !== id));
    this.markPending(id);

    return apiCall.pipe(
      catchError(error => {
        // 2. Restaurar si falla
        this.items$.next([...this.items$.value, original]);
        return throwError(() => error);
      }),
      finalize(() => this.unmarkPending(id))
    );
  }

  private updateLocal(id: number, updates: Partial<T>): void {
    const items = this.items$.value.map(i =>
      i.id === id ? { ...i, ...updates } : i
    );
    this.items$.next(items);
  }

  private markPending(id: number): void {
    const pending = new Set(this.pendingOperations$.value);
    pending.add(id);
    this.pendingOperations$.next(pending);
  }

  private unmarkPending(id: number): void {
    const pending = new Set(this.pendingOperations$.value);
    pending.delete(id);
    this.pendingOperations$.next(pending);
  }
}
```

### Uso del Servicio Optimista

```typescript
// services/product-crud.service.ts
@Injectable({ providedIn: 'root' })
export class ProductCrudService extends OptimisticCrudService<Product> {
  products$ = this.items$.asObservable();

  constructor(private api: ProductService) {
    super();
  }

  createProduct(data: ProductCreateDto): Observable<Product> {
    return this.optimisticCreate(
      data as Omit<Product, 'id'>,
      this.api.createProduct(data)
    );
  }

  updateProduct(id: number, data: ProductUpdateDto): Observable<Product> {
    return this.optimisticUpdate(
      id,
      data,
      this.api.updateProduct(id, data)
    );
  }

  deleteProduct(id: number): Observable<void> {
    return this.optimisticDelete(
      id,
      this.api.deleteProduct(id)
    );
  }
}
```

---

## 4. Búsqueda con Debounce

### Componente de Búsqueda Avanzada

```typescript
// components/advanced-search/advanced-search.component.ts
import { Component, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface SearchFilters {
  query: string;
  brand: string;
  minPrice: number | null;
  maxPrice: number | null;
}

@Component({
  selector: 'app-advanced-search',
  template: `
    <form [formGroup]="searchForm" class="advanced-search">
      <div class="search-field">
        <input 
          type="text" 
          formControlName="query"
          placeholder="Buscar productos..."
          class="search-input">
        
        <span *ngIf="isSearching" class="search-spinner">🔄</span>
      </div>

      <div class="filters">
        <select formControlName="brand">
          <option value="">Todas las marcas</option>
          <option *ngFor="let brand of brands$ | async" [value]="brand">
            {{ brand }}
          </option>
        </select>

        <input 
          type="number" 
          formControlName="minPrice"
          placeholder="Precio mín.">

        <input 
          type="number" 
          formControlName="maxPrice"
          placeholder="Precio máx.">
      </div>

      <button type="button" (click)="clearFilters()">Limpiar</button>
    </form>

    <!-- Resultados con contador -->
    <div class="search-results-info">
      <span *ngIf="resultCount !== null">
        {{ resultCount }} resultado(s) encontrado(s)
      </span>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdvancedSearchComponent implements OnInit {
  @Output() searchResults = new EventEmitter<Product[]>();
  @Output() filtersChanged = new EventEmitter<SearchFilters>();

  private productService = inject(EnhancedProductService);
  
  brands$ = this.productService.brands$;
  isSearching = false;
  resultCount: number | null = null;

  searchForm = new FormGroup({
    query: new FormControl(''),
    brand: new FormControl(''),
    minPrice: new FormControl<number | null>(null),
    maxPrice: new FormControl<number | null>(null)
  });

  constructor() {
    // Búsqueda con debounce solo para el campo de texto
    this.searchForm.get('query')!.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntilDestroyed()
    ).subscribe(() => this.emitFilters());

    // Filtros inmediatos (sin debounce)
    this.searchForm.valueChanges.pipe(
      // Ignorar cambios del query (ya tiene su propio debounce)
      filter(() => !this.searchForm.get('query')!.dirty),
      takeUntilDestroyed()
    ).subscribe(() => this.emitFilters());
  }

  ngOnInit(): void {
    // Suscribirse a resultados filtrados
    this.productService.filteredProducts$.pipe(
      takeUntilDestroyed()
    ).subscribe(products => {
      this.resultCount = products.length;
      this.searchResults.emit(products);
    });
  }

  private emitFilters(): void {
    const filters = this.searchForm.value as SearchFilters;
    this.filtersChanged.emit(filters);
    
    // Actualizar servicio
    this.productService.setFilter({
      brand: filters.brand,
      search: filters.query
    });
  }

  clearFilters(): void {
    this.searchForm.reset({
      query: '',
      brand: '',
      minPrice: null,
      maxPrice: null
    });
    this.productService.clearFilters();
  }
}
```

---

## 5. Scroll Infinito

### Directiva de Scroll Infinito

```typescript
// directives/infinite-scroll.directive.ts
import { 
  Directive, 
  ElementRef, 
  EventEmitter, 
  Input, 
  OnDestroy, 
  OnInit, 
  Output 
} from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, filter, takeUntil } from 'rxjs/operators';

@Directive({
  selector: '[appInfiniteScroll]',
  standalone: true
})
export class InfiniteScrollDirective implements OnInit, OnDestroy {
  @Input() scrollThreshold = 200; // Píxeles antes del final
  @Input() scrollDebounce = 150; // Debounce en ms
  @Input() scrollDisabled = false; // Deshabilitar scroll
  
  @Output() scrollEnd = new EventEmitter<void>();

  private destroy$ = new Subject<void>();

  constructor(private elementRef: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    const element = this.elementRef.nativeElement;

    fromEvent(element, 'scroll').pipe(
      debounceTime(this.scrollDebounce),
      filter(() => !this.scrollDisabled),
      filter(() => this.isNearBottom(element)),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.scrollEnd.emit();
    });
  }

  private isNearBottom(element: HTMLElement): boolean {
    const scrollPosition = element.scrollTop + element.clientHeight;
    const scrollHeight = element.scrollHeight;
    return scrollHeight - scrollPosition <= this.scrollThreshold;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

### Componente de Lista con Scroll Infinito

```typescript
// components/infinite-list/infinite-list.component.ts
@Component({
  selector: 'app-infinite-list',
  template: `
    <div 
      class="infinite-list"
      appInfiniteScroll
      [scrollThreshold]="150"
      [scrollDisabled]="loading() || !hasMore()"
      (scrollEnd)="loadMore()">
      
      <!-- Contenido -->
      @for (item of items(); track item.id) {
        <ng-container 
          [ngTemplateOutlet]="itemTemplate"
          [ngTemplateOutletContext]="{ $implicit: item }">
        </ng-container>
      }
      
      <!-- Loading indicator -->
      @if (loading()) {
        <div class="loading-indicator">
          <app-spinner></app-spinner>
          <span>Cargando más elementos...</span>
        </div>
      }
      
      <!-- Fin de lista -->
      @if (!hasMore() && items().length > 0) {
        <div class="end-of-list">
          <span>Has llegado al final</span>
        </div>
      }
      
      <!-- Lista vacía -->
      @if (!loading() && items().length === 0) {
        <div class="empty-state">
          <ng-content select="[empty]"></ng-content>
        </div>
      }
    </div>
  `,
  styles: [`
    .infinite-list {
      height: 100%;
      overflow-y: auto;
    }
    .loading-indicator {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      gap: 0.5rem;
    }
    .end-of-list {
      text-align: center;
      padding: 1rem;
      color: #666;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [InfiniteScrollDirective, NgTemplateOutlet]
})
export class InfiniteListComponent<T extends { id: number }> {
  @Input() items = signal<T[]>([]);
  @Input() loading = signal(false);
  @Input() hasMore = signal(true);
  @Input() itemTemplate!: TemplateRef<{ $implicit: T }>;
  
  @Output() loadMoreRequest = new EventEmitter<void>();

  loadMore(): void {
    if (!this.loading() && this.hasMore()) {
      this.loadMoreRequest.emit();
    }
  }
}
```

### Uso del Scroll Infinito

```typescript
// pages/products/products-page.component.ts
@Component({
  selector: 'app-products-page',
  template: `
    <app-infinite-list
      [items]="products"
      [loading]="loading"
      [hasMore]="hasMore"
      [itemTemplate]="productTemplate"
      (loadMoreRequest)="loadMoreProducts()">
      
      <div empty>
        <p>No hay productos disponibles</p>
      </div>
    </app-infinite-list>

    <ng-template #productTemplate let-product>
      <app-product-card 
        [product]="product"
        (click)="selectProduct(product)">
      </app-product-card>
    </ng-template>
  `
})
export class ProductsPageComponent {
  products = signal<Product[]>([]);
  loading = signal(false);
  hasMore = signal(true);
  
  private currentPage = 0;
  private pageSize = 20;

  constructor(private productService: ProductService) {
    this.loadMoreProducts();
  }

  loadMoreProducts(): void {
    this.loading.set(true);
    
    this.productService.getProductsPaginated({
      page: this.currentPage,
      size: this.pageSize
    }).subscribe({
      next: (response) => {
        this.products.update(current => [...current, ...response.data]);
        this.hasMore.set(response.pagination.hasNext);
        this.currentPage++;
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  selectProduct(product: Product): void {
    // Navegación
  }
}
```

---

## 6. Gestión de Loading States

### Servicio de Loading Global

```typescript
// services/loading.service.ts
import { Injectable, signal, computed } from '@angular/core';

interface LoadingState {
  [key: string]: boolean;
}

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private loadingState = signal<LoadingState>({});
  
  // ¿Hay algo cargando?
  readonly isLoading = computed(() => 
    Object.values(this.loadingState()).some(v => v)
  );
  
  // Obtener estado específico
  isLoadingKey(key: string): boolean {
    return this.loadingState()[key] ?? false;
  }

  startLoading(key: string): void {
    this.loadingState.update(state => ({ ...state, [key]: true }));
  }

  stopLoading(key: string): void {
    this.loadingState.update(state => ({ ...state, [key]: false }));
  }

  // Wrapper para observables
  withLoading<T>(key: string, observable: Observable<T>): Observable<T> {
    this.startLoading(key);
    return observable.pipe(
      finalize(() => this.stopLoading(key))
    );
  }
}
```

### Componente de Loading Overlay

```typescript
// components/loading-overlay/loading-overlay.component.ts
@Component({
  selector: 'app-loading-overlay',
  template: `
    @if (loadingService.isLoading()) {
      <div class="loading-overlay" @fadeInOut>
        <div class="loading-content">
          <app-spinner [size]="'large'"></app-spinner>
          <p *ngIf="message">{{ message }}</p>
        </div>
      </div>
    }
  `,
  styles: [`
    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    }
    .loading-content {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      text-align: center;
    }
  `],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0 }))
      ])
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingOverlayComponent {
  @Input() message?: string;
  
  loadingService = inject(LoadingService);
}
```

### Estados de Carga Locales

```typescript
// Patrón para múltiples estados de carga en un componente
@Component({
  template: `
    <div class="dashboard">
      <!-- Productos -->
      <section>
        <h2>Productos</h2>
        @if (loadingProducts()) {
          <app-skeleton-list [count]="3"></app-skeleton-list>
        } @else if (productsError()) {
          <app-error-message 
            [message]="productsError()"
            (retry)="loadProducts()">
          </app-error-message>
        } @else {
          <app-product-list [products]="products()"></app-product-list>
        }
      </section>

      <!-- Incidencias -->
      <section>
        <h2>Incidencias recientes</h2>
        @if (loadingIncidences()) {
          <app-skeleton-list [count]="5"></app-skeleton-list>
        } @else if (incidencesError()) {
          <app-error-message 
            [message]="incidencesError()"
            (retry)="loadIncidences()">
          </app-error-message>
        } @else {
          <app-incidence-list [incidences]="incidences()"></app-incidence-list>
        }
      </section>
    </div>
  `
})
export class DashboardComponent {
  // Productos
  products = signal<Product[]>([]);
  loadingProducts = signal(true);
  productsError = signal<string | null>(null);

  // Incidencias
  incidences = signal<Incidence[]>([]);
  loadingIncidences = signal(true);
  incidencesError = signal<string | null>(null);

  constructor(
    private productService: ProductService,
    private incidenceService: ProductService
  ) {
    this.loadProducts();
    this.loadIncidences();
  }

  loadProducts(): void {
    this.loadingProducts.set(true);
    this.productsError.set(null);
    
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products.set(data);
        this.loadingProducts.set(false);
      },
      error: (err) => {
        this.productsError.set('Error al cargar productos');
        this.loadingProducts.set(false);
      }
    });
  }

  loadIncidences(): void {
    this.loadingIncidences.set(true);
    this.incidencesError.set(null);
    
    this.incidenceService.getIncidencesByProductId(1).subscribe({
      next: (data) => {
        this.incidences.set(data);
        this.loadingIncidences.set(false);
      },
      error: (err) => {
        this.incidencesError.set('Error al cargar incidencias');
        this.loadingIncidences.set(false);
      }
    });
  }
}
```

---

## Resumen de Patrones

| Patrón | Uso | Complejidad |
|--------|-----|-------------|
| **Signals** | Estado local de componentes | Baja |
| **BehaviorSubject** | Estado compartido entre componentes | Media |
| **Actualizaciones optimistas** | UX mejorada en CRUD | Media |
| **Debounce** | Búsquedas, inputs | Baja |
| **Scroll infinito** | Listas grandes | Media |
| **Loading states** | Feedback al usuario | Baja |

---

*Documentación generada para ReparaFácil - Proyecto Intermodular 2DAW*
*Última actualización: Enero 2026*

