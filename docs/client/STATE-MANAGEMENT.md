# Gestión de Estado y Reactividad en Tiempo Real

> **ReparaFácil** - Documentación técnica del sistema de gestión de estado

---

## Índice

1. [Patrón de Estado Elegido](#1-patrón-de-estado-elegido)
2. [Comparativa de Opciones Evaluadas](#2-comparativa-de-opciones-evaluadas)
3. [Actualización Dinámica sin Recargas](#3-actualización-dinámica-sin-recargas)
4. [Optimización de Rendimiento](#4-optimización-de-rendimiento)
5. [Paginación y Scroll Infinito](#5-paginación-y-scroll-infinito)
6. [Búsqueda y Filtrado en Tiempo Real](#6-búsqueda-y-filtrado-en-tiempo-real)
7. [WebSockets y Polling (Opcional)](#7-websockets-y-polling-opcional)
8. [Ejemplos de Implementación](#8-ejemplos-de-implementación)

---

## 1. Patrón de Estado Elegido

### 🎯 Decisión: Servicios con BehaviorSubject + Signals de Angular

Para ReparaFácil hemos elegido un **enfoque híbrido** que combina:

1. **Servicios con BehaviorSubject** para estado compartido existente
2. **Signals de Angular 17** para nuevo estado reactivo local

### Justificación de la Elección

| Factor | BehaviorSubject | Signals | NgRx |
|--------|-----------------|---------|------|
| **Curva de aprendizaje** | Baja ✅ | Baja ✅ | Alta ❌ |
| **Complejidad del proyecto** | Adecuada ✅ | Adecuada ✅ | Sobredimensionado ❌ |
| **Integración con RxJS** | Nativa ✅ | Buena ✅ | Nativa ✅ |
| **Rendimiento** | Bueno ✅ | Excelente ✅ | Bueno ✅ |
| **Soporte Angular 17** | Total ✅ | Total ✅ | Total ✅ |
| **Boilerplate** | Mínimo ✅ | Mínimo ✅ | Alto ❌ |

### ¿Por qué NO NgRx?

NgRx es excelente para aplicaciones empresariales muy grandes con:
- Múltiples equipos de desarrollo
- Estado extremadamente complejo
- Necesidad de time-travel debugging

Para ReparaFácil, NgRx añadiría complejidad innecesaria:
- Solo 8-10 páginas principales
- Estado relativamente simple (usuarios, productos, incidencias)
- Equipo pequeño de desarrollo

### ¿Por qué Signals + BehaviorSubject?

**Signals (Angular 17+):**
- API más simple y moderna
- Mejor integración con change detection
- Menos boilerplate que Observables
- Perfecto para estado local de componentes

**BehaviorSubject:**
- Ya implementado en servicios existentes
- Excelente para estado compartido entre componentes
- Integración natural con HttpClient y operadores RxJS
- Patrón bien conocido en Angular

---

## 2. Comparativa de Opciones Evaluadas

### 2.1 Servicios con BehaviorSubject

```typescript
// ✅ IMPLEMENTACIÓN ACTUAL EN EL PROYECTO

@Injectable({ providedIn: 'root' })
export class ProductService extends BaseHttpService {
  // Estado reactivo con BehaviorSubject
  private productsSubject = new BehaviorSubject<Product[]>([]);
  public products$ = this.productsSubject.asObservable();
  
  // Estado de carga
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();
  
  // Actualizar estado
  refreshProducts(): void {
    this.loadingSubject.next(true);
    this.getProducts().subscribe({
      next: (products) => {
        this.productsSubject.next(products);
        this.loadingSubject.next(false);
      },
      error: () => this.loadingSubject.next(false)
    });
  }
}
```

**Ventajas:**
- ✅ Patrón conocido y estable
- ✅ Integración perfecta con async pipe
- ✅ Fácil de testear
- ✅ Ya implementado en el proyecto

**Desventajas:**
- ❌ Requiere gestión manual de suscripciones
- ❌ Más verboso que Signals

---

### 2.2 Signals de Angular (Recomendado para nuevo código)

```typescript
// ✅ RECOMENDADO PARA NUEVOS COMPONENTES

import { signal, computed, effect } from '@angular/core';

@Component({
  selector: 'app-product-list',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent {
  // Estado con Signals
  products = signal<Product[]>([]);
  searchTerm = signal<string>('');
  loading = signal<boolean>(false);
  
  // Estado computado (derivado)
  filteredProducts = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.products().filter(p => 
      p.nombre.toLowerCase().includes(term)
    );
  });
  
  // Contador derivado
  totalProducts = computed(() => this.filteredProducts().length);
  
  // Efecto para logging/side effects
  constructor() {
    effect(() => {
      console.log('Productos actualizados:', this.products().length);
    });
  }
  
  // Actualizar estado
  addProduct(product: Product): void {
    this.products.update(current => [...current, product]);
  }
  
  removeProduct(id: number): void {
    this.products.update(current => current.filter(p => p.id !== id));
  }
}
```

**Ventajas:**
- ✅ API más simple y declarativa
- ✅ Mejor rendimiento con change detection
- ✅ Sin necesidad de suscripciones manuales
- ✅ Perfecto con OnPush strategy

**Desventajas:**
- ❌ Nuevo en Angular (menos documentación de comunidad)
- ❌ Requiere adaptar código existente

---

### 2.3 NgRx (No seleccionado)

```typescript
// ❌ DESCARTADO - Demasiado complejo para este proyecto

// actions/product.actions.ts
export const loadProducts = createAction('[Product] Load Products');
export const loadProductsSuccess = createAction(
  '[Product] Load Products Success',
  props<{ products: Product[] }>()
);

// reducers/product.reducer.ts
export const productReducer = createReducer(
  initialState,
  on(loadProductsSuccess, (state, { products }) => ({
    ...state,
    products,
    loading: false
  }))
);

// effects/product.effects.ts
loadProducts$ = createEffect(() => this.actions$.pipe(
  ofType(loadProducts),
  switchMap(() => this.productService.getProducts().pipe(
    map(products => loadProductsSuccess({ products }))
  ))
));
```

**Ventajas:**
- ✅ Estado predecible y centralizado
- ✅ DevTools para debugging
- ✅ Time-travel debugging

**Desventajas para ReparaFácil:**
- ❌ Demasiado boilerplate
- ❌ Curva de aprendizaje alta
- ❌ Sobredimensionado para el alcance del proyecto

---

## 3. Actualización Dinámica sin Recargas

### 3.1 Actualizar Listas después de CRUD

#### Patrón Optimista (Recomendado)

```typescript
// services/product-state.service.ts
@Injectable({ providedIn: 'root' })
export class ProductStateService {
  private productsSubject = new BehaviorSubject<Product[]>([]);
  products$ = this.productsSubject.asObservable();

  constructor(private productService: ProductService) {}

  // CREAR - Actualización optimista
  createProduct(product: ProductCreateDto): Observable<Product> {
    const tempId = Date.now(); // ID temporal
    const optimisticProduct = { ...product, id: tempId } as Product;
    
    // 1. Actualizar UI inmediatamente
    this.productsSubject.next([...this.productsSubject.value, optimisticProduct]);
    
    // 2. Enviar al servidor
    return this.productService.createProduct(product).pipe(
      tap(savedProduct => {
        // 3. Reemplazar con producto real
        const products = this.productsSubject.value.map(p =>
          p.id === tempId ? savedProduct : p
        );
        this.productsSubject.next(products);
      }),
      catchError(error => {
        // 4. Revertir si falla
        const products = this.productsSubject.value.filter(p => p.id !== tempId);
        this.productsSubject.next(products);
        return throwError(() => error);
      })
    );
  }

  // ACTUALIZAR
  updateProduct(id: number, updates: ProductUpdateDto): Observable<Product> {
    const currentProducts = this.productsSubject.value;
    const originalProduct = currentProducts.find(p => p.id === id);
    
    // Actualización optimista
    this.productsSubject.next(
      currentProducts.map(p => p.id === id ? { ...p, ...updates } : p)
    );
    
    return this.productService.updateProduct(id, updates).pipe(
      catchError(error => {
        // Revertir
        if (originalProduct) {
          this.productsSubject.next(
            this.productsSubject.value.map(p => p.id === id ? originalProduct : p)
          );
        }
        return throwError(() => error);
      })
    );
  }

  // ELIMINAR
  deleteProduct(id: number): Observable<void> {
    const currentProducts = this.productsSubject.value;
    const deletedProduct = currentProducts.find(p => p.id === id);
    
    // Eliminar de UI
    this.productsSubject.next(currentProducts.filter(p => p.id !== id));
    
    return this.productService.deleteProduct(id).pipe(
      catchError(error => {
        // Restaurar si falla
        if (deletedProduct) {
          this.productsSubject.next([...this.productsSubject.value, deletedProduct]);
        }
        return throwError(() => error);
      })
    );
  }
}
```

### 3.2 Actualizar Contadores en Tiempo Real

```typescript
// services/stats.service.ts
@Injectable({ providedIn: 'root' })
export class StatsService {
  // Contadores reactivos
  private statsSubject = new BehaviorSubject<DashboardStats>({
    totalProducts: 0,
    totalIncidences: 0,
    resolvedIncidences: 0,
    pendingIncidences: 0
  });
  
  stats$ = this.statsSubject.asObservable();
  
  // Contadores derivados con Signals (Angular 17+)
  stats = signal<DashboardStats>(this.statsSubject.value);
  
  resolvedPercentage = computed(() => {
    const s = this.stats();
    return s.totalIncidences > 0 
      ? Math.round((s.resolvedIncidences / s.totalIncidences) * 100) 
      : 0;
  });

  updateStats(partial: Partial<DashboardStats>): void {
    const current = this.statsSubject.value;
    const updated = { ...current, ...partial };
    this.statsSubject.next(updated);
    this.stats.set(updated);
  }

  incrementIncidences(): void {
    this.updateStats({
      totalIncidences: this.stats().totalIncidences + 1,
      pendingIncidences: this.stats().pendingIncidences + 1
    });
  }

  markIncidenceResolved(): void {
    this.updateStats({
      resolvedIncidences: this.stats().resolvedIncidences + 1,
      pendingIncidences: this.stats().pendingIncidences - 1
    });
  }
}
```

### 3.3 Refrescar Datos sin Perder Scroll Position

```typescript
// components/incidence-list.component.ts
@Component({
  selector: 'app-incidence-list',
  template: `
    <div class="incidence-list" #listContainer>
      <app-incidence-card 
        *ngFor="let incidence of incidences$ | async; trackBy: trackByFn"
        [incidence]="incidence">
      </app-incidence-card>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IncidenceListComponent {
  @ViewChild('listContainer') listContainer!: ElementRef;
  
  incidences$ = this.incidenceService.incidences$;
  
  // Guardar posición del scroll
  private scrollPosition = 0;
  
  refreshData(): void {
    // 1. Guardar posición actual
    this.scrollPosition = this.listContainer.nativeElement.scrollTop;
    
    // 2. Refrescar datos
    this.incidenceService.refresh().subscribe(() => {
      // 3. Restaurar posición después del render
      setTimeout(() => {
        this.listContainer.nativeElement.scrollTop = this.scrollPosition;
      }, 0);
    });
  }
  
  // También se puede usar afterNextRender (Angular 17+)
  constructor() {
    afterNextRender(() => {
      if (this.scrollPosition > 0) {
        this.listContainer.nativeElement.scrollTop = this.scrollPosition;
      }
    });
  }
  
  trackByFn(index: number, item: Incidence): number {
    return item.id;
  }
}
```

---

## 4. Optimización de Rendimiento

### 4.1 OnPush ChangeDetectionStrategy

```typescript
// ✅ APLICAR EN TODOS LOS COMPONENTES DE LISTA

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush // ← IMPORTANTE
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Output() onSelect = new EventEmitter<Product>();
}

// Componente padre también con OnPush
@Component({
  selector: 'app-product-list',
  template: `
    <app-product-card 
      *ngFor="let product of products$ | async; trackBy: trackByProductId"
      [product]="product"
      (onSelect)="selectProduct($event)">
    </app-product-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent {
  products$ = this.productService.products$;
  
  trackByProductId(index: number, product: Product): number {
    return product.id;
  }
}
```

### 4.2 TrackBy en ngFor para Listas Grandes

```typescript
// ✅ SIEMPRE usar trackBy en listas

// En el componente
@Component({
  template: `
    <!-- ✅ CORRECTO -->
    <div *ngFor="let item of items; trackBy: trackByFn">
      {{ item.name }}
    </div>
    
    <!-- ❌ INCORRECTO - Sin trackBy -->
    <div *ngFor="let item of items">
      {{ item.name }}
    </div>
  `
})
export class ListComponent {
  // TrackBy function para productos
  trackByFn(index: number, item: { id: number }): number {
    return item.id;
  }
  
  // TrackBy genérico por índice (menos óptimo)
  trackByIndex(index: number): number {
    return index;
  }
}
```

### 4.3 Unsubscribe de Observables

```typescript
// ✅ PATRÓN 1: takeUntilDestroyed (Angular 16+) - RECOMENDADO

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({...})
export class MyComponent {
  constructor(private productService: ProductService) {
    // Se desuscribe automáticamente al destruirse el componente
    this.productService.products$
      .pipe(takeUntilDestroyed())
      .subscribe(products => this.handleProducts(products));
  }
}

// ✅ PATRÓN 2: Subject destroy manual

@Component({...})
export class MyComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  
  ngOnInit(): void {
    this.productService.products$
      .pipe(takeUntil(this.destroy$))
      .subscribe(products => this.handleProducts(products));
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

// ✅ PATRÓN 3: DestroyRef (Angular 16+)

@Component({...})
export class MyComponent {
  private destroyRef = inject(DestroyRef);
  
  ngOnInit(): void {
    const subscription = this.productService.products$.subscribe();
    
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}
```

### 4.4 Async Pipe para Gestión Automática

```typescript
// ✅ PREFERIR async pipe sobre suscripciones manuales

@Component({
  template: `
    <!-- ✅ CORRECTO: async pipe gestiona la suscripción -->
    <div *ngIf="loading$ | async; else content">
      <app-loading-spinner></app-loading-spinner>
    </div>
    
    <ng-template #content>
      <app-product-card 
        *ngFor="let product of products$ | async; trackBy: trackById"
        [product]="product">
      </app-product-card>
    </ng-template>
    
    <!-- Combinar múltiples observables -->
    <ng-container *ngIf="{
      products: products$ | async,
      loading: loading$ | async,
      error: error$ | async
    } as vm">
      <app-loading *ngIf="vm.loading"></app-loading>
      <app-error *ngIf="vm.error" [error]="vm.error"></app-error>
      <app-list *ngIf="vm.products" [items]="vm.products"></app-list>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent {
  products$ = this.productService.products$;
  loading$ = this.productService.loading$;
  error$ = this.productService.error$;
  
  trackById(index: number, product: Product): number {
    return product.id;
  }
}
```

---

## 5. Paginación y Scroll Infinito

### 5.1 Paginación Tradicional

```typescript
// services/pagination.service.ts
export interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

@Injectable({ providedIn: 'root' })
export class PaginatedProductService {
  private paginationSubject = new BehaviorSubject<PaginationState>({
    currentPage: 0,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0
  });
  
  pagination$ = this.paginationSubject.asObservable();
  
  private productsSubject = new BehaviorSubject<Product[]>([]);
  products$ = this.productsSubject.asObservable();
  
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  loadPage(page: number, pageSize: number = 10): void {
    this.loadingSubject.next(true);
    
    this.productService.getProductsPaginated({ page, size: pageSize })
      .pipe(finalize(() => this.loadingSubject.next(false)))
      .subscribe(response => {
        this.productsSubject.next(response.data);
        this.paginationSubject.next({
          currentPage: response.pagination.currentPage,
          pageSize: response.pagination.pageSize,
          totalItems: response.pagination.totalItems,
          totalPages: response.pagination.totalPages
        });
      });
  }
  
  nextPage(): void {
    const current = this.paginationSubject.value;
    if (current.currentPage < current.totalPages - 1) {
      this.loadPage(current.currentPage + 1, current.pageSize);
    }
  }
  
  previousPage(): void {
    const current = this.paginationSubject.value;
    if (current.currentPage > 0) {
      this.loadPage(current.currentPage - 1, current.pageSize);
    }
  }
}
```

```html
<!-- components/pagination/pagination.component.html -->
<div class="pagination" *ngIf="pagination$ | async as pagination">
  <button 
    class="pagination__btn"
    [disabled]="pagination.currentPage === 0"
    (click)="onPrevious()">
    ← Anterior
  </button>
  
  <span class="pagination__info">
    Página {{ pagination.currentPage + 1 }} de {{ pagination.totalPages }}
  </span>
  
  <button 
    class="pagination__btn"
    [disabled]="pagination.currentPage >= pagination.totalPages - 1"
    (click)="onNext()">
    Siguiente →
  </button>
</div>
```

### 5.2 Scroll Infinito

```typescript
// directives/infinite-scroll.directive.ts
@Directive({
  selector: '[appInfiniteScroll]',
  standalone: true
})
export class InfiniteScrollDirective implements OnDestroy {
  @Output() scrolledToBottom = new EventEmitter<void>();
  @Input() threshold = 100; // Píxeles antes del final
  
  private destroy$ = new Subject<void>();

  constructor(private el: ElementRef) {
    fromEvent(this.el.nativeElement, 'scroll')
      .pipe(
        debounceTime(200),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.onScroll());
  }

  private onScroll(): void {
    const element = this.el.nativeElement;
    const scrollPosition = element.scrollTop + element.clientHeight;
    const scrollHeight = element.scrollHeight;
    
    if (scrollHeight - scrollPosition <= this.threshold) {
      this.scrolledToBottom.emit();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

// components/infinite-product-list.component.ts
@Component({
  selector: 'app-infinite-product-list',
  template: `
    <div 
      class="product-list" 
      appInfiniteScroll 
      (scrolledToBottom)="loadMore()"
      [threshold]="150">
      
      <app-product-card 
        *ngFor="let product of products; trackBy: trackById"
        [product]="product">
      </app-product-card>
      
      <!-- Loading indicator -->
      <div *ngIf="loading" class="loading-more">
        <app-spinner></app-spinner>
        <span>Cargando más productos...</span>
      </div>
      
      <!-- End of list -->
      <div *ngIf="!hasMore && products.length > 0" class="end-of-list">
        No hay más productos para mostrar
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InfiniteProductListComponent {
  products: Product[] = [];
  loading = false;
  hasMore = true;
  private currentPage = 0;
  private pageSize = 20;

  constructor(
    private productService: ProductService,
    private cdr: ChangeDetectorRef
  ) {
    this.loadMore();
  }

  loadMore(): void {
    if (this.loading || !this.hasMore) return;
    
    this.loading = true;
    this.cdr.markForCheck();
    
    this.productService.getProductsPaginated({ 
      page: this.currentPage, 
      size: this.pageSize 
    }).subscribe(response => {
      this.products = [...this.products, ...response.data];
      this.hasMore = response.pagination.hasNext;
      this.currentPage++;
      this.loading = false;
      this.cdr.markForCheck();
    });
  }

  trackById(index: number, product: Product): number {
    return product.id;
  }
}
```

---

## 6. Búsqueda y Filtrado en Tiempo Real

### 6.1 Input de Búsqueda con Debounce

```typescript
// components/search-input/search-input.component.ts
@Component({
  selector: 'app-search-input',
  template: `
    <div class="search-input">
      <input 
        type="text"
        [formControl]="searchControl"
        placeholder="Buscar productos..."
        class="search-input__field">
      
      <button 
        *ngIf="searchControl.value" 
        (click)="clear()" 
        class="search-input__clear">
        ✕
      </button>
      
      <div *ngIf="loading" class="search-input__spinner">
        <app-spinner size="small"></app-spinner>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchInputComponent implements OnInit {
  @Output() search = new EventEmitter<string>();
  @Input() debounceMs = 300;
  @Input() minLength = 2;
  
  searchControl = new FormControl('');
  loading = false;

  constructor(private destroyRef: DestroyRef) {}

  ngOnInit(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(this.debounceMs),
      distinctUntilChanged(),
      tap(() => this.loading = true),
      filter(term => !term || term.length >= this.minLength),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(term => {
      this.loading = false;
      this.search.emit(term || '');
    });
  }

  clear(): void {
    this.searchControl.setValue('');
  }
}
```

### 6.2 Servicio de Búsqueda con Cache

```typescript
// services/search.service.ts
@Injectable({ providedIn: 'root' })
export class SearchService {
  private searchCache = new Map<string, { data: Product[], timestamp: number }>();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutos
  
  private resultsSubject = new BehaviorSubject<Product[]>([]);
  results$ = this.resultsSubject.asObservable();
  
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  constructor(private productService: ProductService) {}

  search(term: string): Observable<Product[]> {
    if (!term.trim()) {
      this.resultsSubject.next([]);
      return of([]);
    }

    // Verificar cache
    const cached = this.searchCache.get(term);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      this.resultsSubject.next(cached.data);
      return of(cached.data);
    }

    this.loadingSubject.next(true);
    
    return this.productService.searchProducts(term).pipe(
      tap(results => {
        // Guardar en cache
        this.searchCache.set(term, { data: results, timestamp: Date.now() });
        this.resultsSubject.next(results);
      }),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  clearCache(): void {
    this.searchCache.clear();
  }
}
```

### 6.3 Filtrado Local vs Remoto

```typescript
// services/filter.service.ts
@Injectable({ providedIn: 'root' })
export class FilterService {
  // Umbral para decidir filtrado local vs remoto
  private readonly LOCAL_FILTER_THRESHOLD = 1000;
  
  private allProducts: Product[] = [];
  private filtersSubject = new BehaviorSubject<ProductFilters>({});
  filters$ = this.filtersSubject.asObservable();
  
  private filteredProductsSubject = new BehaviorSubject<Product[]>([]);
  filteredProducts$ = this.filteredProductsSubject.asObservable();

  constructor(private productService: ProductService) {}

  setFilters(filters: ProductFilters): void {
    this.filtersSubject.next(filters);
    
    if (this.allProducts.length <= this.LOCAL_FILTER_THRESHOLD) {
      // Filtrado local (más rápido para datasets pequeños)
      this.applyLocalFilters(filters);
    } else {
      // Filtrado remoto (necesario para datasets grandes)
      this.applyRemoteFilters(filters);
    }
  }

  private applyLocalFilters(filters: ProductFilters): void {
    let results = [...this.allProducts];
    
    if (filters.brand) {
      results = results.filter(p => p.marca === filters.brand);
    }
    
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      results = results.filter(p =>
        p.nombre.toLowerCase().includes(term) ||
        p.modelo.toLowerCase().includes(term)
      );
    }
    
    if (filters.minPrice !== undefined) {
      results = results.filter(p => (p.precio || 0) >= filters.minPrice!);
    }
    
    if (filters.maxPrice !== undefined) {
      results = results.filter(p => (p.precio || 0) <= filters.maxPrice!);
    }
    
    this.filteredProductsSubject.next(results);
  }

  private applyRemoteFilters(filters: ProductFilters): void {
    this.productService.getProducts(filters as ProductSearchParams)
      .subscribe(products => {
        this.filteredProductsSubject.next(products);
      });
  }
}

interface ProductFilters {
  brand?: string;
  searchTerm?: string;
  minPrice?: number;
  maxPrice?: number;
}
```

### 6.4 Actualización sin Flickering

```typescript
// components/search-results/search-results.component.ts
@Component({
  selector: 'app-search-results',
  template: `
    <div class="search-results">
      <!-- Mantener altura mínima para evitar saltos -->
      <div 
        class="search-results__container"
        [style.min-height.px]="minContainerHeight">
        
        <!-- Skeleton loading (mantiene estructura) -->
        <ng-container *ngIf="loading && !results.length">
          <app-product-skeleton *ngFor="let i of [1,2,3,4,5,6]">
          </app-product-skeleton>
        </ng-container>
        
        <!-- Resultados con fade transition -->
        <div 
          class="search-results__list"
          [@fadeInOut]="results.length ? 'visible' : 'hidden'">
          <app-product-card 
            *ngFor="let product of results; trackBy: trackById"
            [product]="product"
            @listAnimation>
          </app-product-card>
        </div>
        
        <!-- Loading overlay (no reemplaza contenido) -->
        <div *ngIf="loading && results.length" class="search-results__overlay">
          <app-spinner></app-spinner>
        </div>
      </div>
    </div>
  `,
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0 }))
      ])
    ]),
    trigger('listAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchResultsComponent {
  results: Product[] = [];
  loading = false;
  minContainerHeight = 400;

  trackById(index: number, product: Product): number {
    return product.id;
  }
}
```

---

## 7. WebSockets y Polling (Opcional)

### 7.1 Servicio de WebSocket

```typescript
// services/websocket.service.ts
@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private socket$: WebSocketSubject<any> | null = null;
  private messagesSubject = new Subject<WebSocketMessage>();
  messages$ = this.messagesSubject.asObservable();
  
  private connectionStatusSubject = new BehaviorSubject<boolean>(false);
  connectionStatus$ = this.connectionStatusSubject.asObservable();
  
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 3000;

  connect(url: string): void {
    if (this.socket$) {
      this.socket$.complete();
    }

    this.socket$ = webSocket({
      url,
      openObserver: {
        next: () => {
          console.log('WebSocket conectado');
          this.connectionStatusSubject.next(true);
          this.reconnectAttempts = 0;
        }
      },
      closeObserver: {
        next: () => {
          console.log('WebSocket desconectado');
          this.connectionStatusSubject.next(false);
          this.reconnect(url);
        }
      }
    });

    this.socket$.pipe(
      catchError(error => {
        console.error('WebSocket error:', error);
        return EMPTY;
      })
    ).subscribe(message => {
      this.messagesSubject.next(message);
    });
  }

  private reconnect(url: string): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Reintentando conexión (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      
      setTimeout(() => this.connect(url), this.reconnectInterval);
    } else {
      console.error('Máximo de intentos de reconexión alcanzado');
    }
  }

  send(message: any): void {
    if (this.socket$) {
      this.socket$.next(message);
    }
  }

  disconnect(): void {
    if (this.socket$) {
      this.socket$.complete();
      this.socket$ = null;
    }
  }
}

interface WebSocketMessage {
  type: 'PRODUCT_CREATED' | 'PRODUCT_UPDATED' | 'PRODUCT_DELETED' | 
        'INCIDENCE_CREATED' | 'INCIDENCE_RESOLVED';
  payload: any;
}
```

### 7.2 Servicio de Notificaciones en Tiempo Real

```typescript
// services/realtime-notifications.service.ts
@Injectable({ providedIn: 'root' })
export class RealtimeNotificationsService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  notifications$ = this.notificationsSubject.asObservable();
  
  unreadCount$ = this.notifications$.pipe(
    map(notifications => notifications.filter(n => !n.read).length)
  );

  constructor(
    private wsService: WebSocketService,
    private productStateService: ProductStateService
  ) {
    this.setupMessageHandlers();
  }

  private setupMessageHandlers(): void {
    this.wsService.messages$.subscribe(message => {
      switch (message.type) {
        case 'PRODUCT_CREATED':
          this.handleProductCreated(message.payload);
          break;
        case 'INCIDENCE_CREATED':
          this.handleIncidenceCreated(message.payload);
          break;
        case 'INCIDENCE_RESOLVED':
          this.handleIncidenceResolved(message.payload);
          break;
      }
    });
  }

  private handleProductCreated(product: Product): void {
    this.productStateService.addToList(product);
    this.addNotification({
      id: Date.now(),
      type: 'product',
      title: 'Nuevo producto',
      message: `Se ha añadido "${product.nombre}"`,
      read: false,
      timestamp: new Date()
    });
  }

  private handleIncidenceCreated(incidence: Incidence): void {
    this.addNotification({
      id: Date.now(),
      type: 'incidence',
      title: 'Nueva incidencia',
      message: `Nueva incidencia: "${incidence.titulo}"`,
      read: false,
      timestamp: new Date()
    });
  }

  private handleIncidenceResolved(incidence: Incidence): void {
    this.addNotification({
      id: Date.now(),
      type: 'success',
      title: 'Incidencia resuelta',
      message: `La incidencia "${incidence.titulo}" ha sido resuelta`,
      read: false,
      timestamp: new Date()
    });
  }

  private addNotification(notification: Notification): void {
    const current = this.notificationsSubject.value;
    this.notificationsSubject.next([notification, ...current].slice(0, 50));
  }

  markAsRead(id: number): void {
    const notifications = this.notificationsSubject.value.map(n =>
      n.id === id ? { ...n, read: true } : n
    );
    this.notificationsSubject.next(notifications);
  }

  markAllAsRead(): void {
    const notifications = this.notificationsSubject.value.map(n => ({ ...n, read: true }));
    this.notificationsSubject.next(notifications);
  }
}
```

### 7.3 Polling como Alternativa

```typescript
// services/polling.service.ts
@Injectable({ providedIn: 'root' })
export class PollingService {
  private pollingInterval = 30000; // 30 segundos
  private isPolling = false;
  private destroy$ = new Subject<void>();

  constructor(
    private productService: ProductService,
    private productStateService: ProductStateService
  ) {}

  startPolling(): void {
    if (this.isPolling) return;
    this.isPolling = true;

    interval(this.pollingInterval).pipe(
      takeUntil(this.destroy$),
      switchMap(() => this.productService.getProducts()),
      distinctUntilChanged((prev, curr) => 
        JSON.stringify(prev) === JSON.stringify(curr)
      )
    ).subscribe(products => {
      this.productStateService.setProducts(products);
    });
  }

  stopPolling(): void {
    this.isPolling = false;
    this.destroy$.next();
  }

  setInterval(ms: number): void {
    this.pollingInterval = ms;
    if (this.isPolling) {
      this.stopPolling();
      this.startPolling();
    }
  }
}
```

---

## 8. Ejemplos de Implementación

### 8.1 Componente Completo con Todas las Optimizaciones

```typescript
// pages/products/products-page.component.ts
import { 
  Component, 
  OnInit, 
  ChangeDetectionStrategy, 
  signal, 
  computed,
  inject 
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-products-page',
  template: `
    <div class="products-page">
      <!-- Barra de búsqueda -->
      <div class="products-page__search">
        <input 
          type="text" 
          [formControl]="searchControl"
          placeholder="Buscar productos...">
      </div>

      <!-- Filtros -->
      <div class="products-page__filters">
        <select [formControl]="brandFilter">
          <option value="">Todas las marcas</option>
          <option *ngFor="let brand of brands()" [value]="brand">
            {{ brand }}
          </option>
        </select>
      </div>

      <!-- Contador de resultados -->
      <div class="products-page__count">
        {{ filteredCount() }} productos encontrados
      </div>

      <!-- Loading state -->
      <div *ngIf="loading()" class="products-page__loading">
        <app-spinner></app-spinner>
      </div>

      <!-- Lista de productos -->
      <div 
        class="products-page__list"
        appInfiniteScroll
        (scrolledToBottom)="loadMore()">
        
        <app-product-card
          *ngFor="let product of displayedProducts(); trackBy: trackByProductId"
          [product]="product"
          (click)="selectProduct(product)">
        </app-product-card>
        
        <!-- Loading más productos -->
        <div *ngIf="loadingMore()" class="products-page__loading-more">
          Cargando más...
        </div>
      </div>

      <!-- Sin resultados -->
      <div *ngIf="!loading() && filteredCount() === 0" class="products-page__empty">
        No se encontraron productos
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsPageComponent implements OnInit {
  private productService = inject(ProductService);
  
  // Estado con Signals
  products = signal<Product[]>([]);
  loading = signal(true);
  loadingMore = signal(false);
  currentPage = signal(0);
  hasMore = signal(true);
  
  // Controles de formulario
  searchControl = new FormControl('');
  brandFilter = new FormControl('');
  
  // Estado computado
  brands = computed(() => {
    const allBrands = this.products().map(p => p.marca);
    return [...new Set(allBrands)].sort();
  });
  
  filteredProducts = computed(() => {
    let results = this.products();
    const brand = this.brandFilter.value;
    const search = this.searchControl.value?.toLowerCase() || '';
    
    if (brand) {
      results = results.filter(p => p.marca === brand);
    }
    
    if (search) {
      results = results.filter(p =>
        p.nombre.toLowerCase().includes(search) ||
        p.modelo.toLowerCase().includes(search)
      );
    }
    
    return results;
  });
  
  filteredCount = computed(() => this.filteredProducts().length);
  
  displayedProducts = computed(() => {
    const pageSize = 20;
    return this.filteredProducts().slice(0, (this.currentPage() + 1) * pageSize);
  });

  constructor() {
    // Configurar búsqueda con debounce
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntilDestroyed()
    ).subscribe(() => {
      this.currentPage.set(0);
    });
    
    // Cargar productos iniciales
    this.loadInitialProducts();
  }

  ngOnInit(): void {}

  private loadInitialProducts(): void {
    this.loading.set(true);
    
    this.productService.getProducts()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (products) => {
          this.products.set(products);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
  }

  loadMore(): void {
    if (this.loadingMore() || !this.hasMore()) return;
    
    const currentDisplayed = this.displayedProducts().length;
    const totalFiltered = this.filteredCount();
    
    if (currentDisplayed >= totalFiltered) {
      this.hasMore.set(false);
      return;
    }
    
    this.loadingMore.set(true);
    
    // Simular carga
    setTimeout(() => {
      this.currentPage.update(p => p + 1);
      this.loadingMore.set(false);
    }, 500);
  }

  selectProduct(product: Product): void {
    // Navegar al detalle
  }

  trackByProductId(index: number, product: Product): number {
    return product.id;
  }
}
```

### 8.2 Servicio de Estado Completo

```typescript
// services/product-state.service.ts
import { Injectable, signal, computed } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, catchError, finalize } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ProductStateService {
  // Estado principal con BehaviorSubject (para compatibilidad con async pipe)
  private productsSubject = new BehaviorSubject<Product[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);
  
  // Observables públicos
  products$ = this.productsSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();
  error$ = this.errorSubject.asObservable();
  
  // Signals para nuevo código (Angular 17+)
  products = signal<Product[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  
  // Estado computado
  productCount = computed(() => this.products().length);
  
  productsByBrand = computed(() => {
    const groups = new Map<string, Product[]>();
    this.products().forEach(p => {
      const existing = groups.get(p.marca) || [];
      groups.set(p.marca, [...existing, p]);
    });
    return groups;
  });

  constructor(private productService: ProductService) {
    // Sincronizar BehaviorSubject con Signals
    this.productsSubject.subscribe(products => this.products.set(products));
    this.loadingSubject.subscribe(loading => this.loading.set(loading));
    this.errorSubject.subscribe(error => this.error.set(error));
  }

  // ==================== ACCIONES ====================

  loadProducts(): void {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);
    
    this.productService.getProducts().pipe(
      tap(products => this.productsSubject.next(products)),
      catchError(error => {
        this.errorSubject.next('Error al cargar productos');
        throw error;
      }),
      finalize(() => this.loadingSubject.next(false))
    ).subscribe();
  }

  addProduct(productData: ProductCreateDto): Observable<Product> {
    return this.productService.createProduct(productData).pipe(
      tap(newProduct => {
        const current = this.productsSubject.value;
        this.productsSubject.next([...current, newProduct]);
      })
    );
  }

  updateProduct(id: number, updates: ProductUpdateDto): Observable<Product> {
    return this.productService.updateProduct(id, updates).pipe(
      tap(updatedProduct => {
        const current = this.productsSubject.value;
        const updated = current.map(p => p.id === id ? updatedProduct : p);
        this.productsSubject.next(updated);
      })
    );
  }

  deleteProduct(id: number): Observable<void> {
    return this.productService.deleteProduct(id).pipe(
      tap(() => {
        const current = this.productsSubject.value;
        this.productsSubject.next(current.filter(p => p.id !== id));
      })
    );
  }

  // Para WebSocket/polling
  setProducts(products: Product[]): void {
    this.productsSubject.next(products);
  }

  addToList(product: Product): void {
    const current = this.productsSubject.value;
    if (!current.find(p => p.id === product.id)) {
      this.productsSubject.next([...current, product]);
    }
  }

  removeFromList(id: number): void {
    const current = this.productsSubject.value;
    this.productsSubject.next(current.filter(p => p.id !== id));
  }
}
```

---

## Resumen de Decisiones

| Aspecto | Decisión | Justificación |
|---------|----------|---------------|
| **Patrón de estado** | BehaviorSubject + Signals | Híbrido: compatibilidad + modernidad |
| **Change Detection** | OnPush | Mejor rendimiento |
| **Gestión de suscripciones** | takeUntilDestroyed + async pipe | Automático y sin memory leaks |
| **Listas grandes** | trackBy + virtual scroll | Rendimiento óptimo |
| **Búsqueda** | debounceTime 300ms | Balance UX/rendimiento |
| **Paginación** | Scroll infinito | Mejor UX móvil |
| **Tiempo real** | Polling (opcional) | Más simple que WebSocket |

---

## Checklist de Implementación

- [x] Servicios con BehaviorSubject para estado compartido
- [x] Signals para estado local de componentes
- [x] OnPush ChangeDetectionStrategy
- [x] TrackBy en todos los ngFor
- [x] Async pipe para suscripciones en templates
- [x] takeUntilDestroyed para suscripciones imperativas
- [x] Debounce en inputs de búsqueda
- [x] Scroll infinito para listas
- [x] Loading states apropiados
- [x] Actualizaciones optimistas
- [ ] WebSocket (opcional, según requisitos)

---

*Documentación generada para ReparaFácil - Proyecto Intermodular 2DAW*
*Última actualización: Enero 2026*

