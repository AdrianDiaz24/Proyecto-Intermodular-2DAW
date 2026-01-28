/**
 * @fileoverview Servicio de gestión de estado de incidencias
 * Implementa patrón reactivo con Signals de Angular 17+
 */

import { Injectable, signal, computed, inject } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, tap, catchError, distinctUntilChanged, shareReplay } from 'rxjs/operators';
import { ProductService } from './product.service';
import {
  Incidence,
  IncidenceCreateDto,
  IncidenceUpdateDto,
  IncidenceStatus,
  IncidenceSeverity
} from '../models';

/**
 * Filtros de incidencias
 */
export interface IncidenceFilters {
  status: 'all' | IncidenceStatus;
  severity: 'all' | IncidenceSeverity;
  searchTerm: string;
  productId?: number;
}

/**
 * Estadísticas de incidencias
 */
export interface IncidenceStats {
  total: number;
  open: number;
  inProgress: number;
  closed: number;
  highSeverity: number;
  resolvedPercentage: number;
}

/**
 * Estado interno
 */
interface IncidenceState {
  incidences: Incidence[];
  loading: boolean;
  error: string | null;
  filters: IncidenceFilters;
  selectedId: number | null;
}

const initialFilters: IncidenceFilters = {
  status: 'all',
  severity: 'all',
  searchTerm: '',
  productId: undefined
};

const initialState: IncidenceState = {
  incidences: [],
  loading: false,
  error: null,
  filters: initialFilters,
  selectedId: null
};

@Injectable({
  providedIn: 'root'
})
export class IncidenceStateService {
  private readonly productService = inject(ProductService);

  // ============================================================================
  // ESTADO CON SIGNALS (Angular 17+ - Recomendado)
  // ============================================================================

  // Signals base (estado privado con acceso público de solo lectura)
  private _incidences = signal<Incidence[]>([]);
  private _loading = signal(false);
  private _error = signal<string | null>(null);
  private _filters = signal<IncidenceFilters>(initialFilters);
  private _selectedId = signal<number | null>(null);

  // Signals públicos de solo lectura
  readonly incidences = this._incidences.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly filters = this._filters.asReadonly();
  readonly selectedId = this._selectedId.asReadonly();

  // Signals computados (derivados automáticamente)
  readonly filteredIncidences = computed(() => {
    const all = this._incidences();
    const filters = this._filters();
    
    return all.filter(inc => {
      // Filtro por producto
      if (filters.productId && inc.productoId !== filters.productId) {
        return false;
      }
      
      // Filtro por estado
      if (filters.status !== 'all' && inc.estado !== filters.status) {
        return false;
      }
      
      // Filtro por severidad
      if (filters.severity !== 'all' && inc.severidad !== filters.severity) {
        return false;
      }
      
      // Filtro por búsqueda
      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        const matchTitle = inc.titulo.toLowerCase().includes(term);
        const matchDesc = inc.descripcion.toLowerCase().includes(term);
        const matchUser = inc.usuarioUsername?.toLowerCase().includes(term) || false;
        if (!matchTitle && !matchDesc && !matchUser) {
          return false;
        }
      }
      
      return true;
    });
  });

  readonly selectedIncidence = computed(() => {
    const id = this._selectedId();
    return this._incidences().find(inc => inc.id === id) || null;
  });

  // Estadísticas computadas en tiempo real
  readonly stats = computed<IncidenceStats>(() => {
    const all = this._incidences();
    const total = all.length;
    const open = all.filter(i => i.estado === 'ABIERTA').length;
    const inProgress = all.filter(i => i.estado === 'EN_PROGRESO').length;
    const closed = all.filter(i => i.estado === 'CERRADA').length;
    const highSeverity = all.filter(i => i.severidad === 'ALTO').length;
    const resolvedPercentage = total > 0 ? Math.round((closed / total) * 100) : 0;
    
    return { total, open, inProgress, closed, highSeverity, resolvedPercentage };
  });

  // Contadores individuales para acceso rápido
  readonly totalCount = computed(() => this._incidences().length);
  readonly openCount = computed(() => this._incidences().filter(i => i.estado === 'ABIERTA').length);
  readonly closedCount = computed(() => this._incidences().filter(i => i.estado === 'CERRADA').length);
  readonly filteredCount = computed(() => this.filteredIncidences().length);

  // ============================================================================
  // ESTADO CON BEHAVIORSUBJECT (para compatibilidad con async pipe)
  // ============================================================================

  private state$ = new BehaviorSubject<IncidenceState>(initialState);

  // Observables para uso con async pipe
  readonly incidences$ = this.select(s => s.incidences);
  readonly loading$ = this.select(s => s.loading);
  readonly error$ = this.select(s => s.error);
  readonly filters$ = this.select(s => s.filters);

  readonly filteredIncidences$ = this.state$.pipe(
    map(state => {
      const { incidences, filters } = state;
      
      return incidences.filter(inc => {
        if (filters.productId && inc.productoId !== filters.productId) return false;
        if (filters.status !== 'all' && inc.estado !== filters.status) return false;
        if (filters.severity !== 'all' && inc.severidad !== filters.severity) return false;
        
        if (filters.searchTerm) {
          const term = filters.searchTerm.toLowerCase();
          const matchTitle = inc.titulo.toLowerCase().includes(term);
          const matchDesc = inc.descripcion.toLowerCase().includes(term);
          if (!matchTitle && !matchDesc) return false;
        }
        
        return true;
      });
    }),
    shareReplay(1)
  );

  readonly stats$ = this.incidences$.pipe(
    map(incidences => {
      const total = incidences.length;
      const open = incidences.filter(i => i.estado === 'ABIERTA').length;
      const inProgress = incidences.filter(i => i.estado === 'EN_PROGRESO').length;
      const closed = incidences.filter(i => i.estado === 'CERRADA').length;
      const highSeverity = incidences.filter(i => i.severidad === 'ALTO').length;
      const resolvedPercentage = total > 0 ? Math.round((closed / total) * 100) : 0;
      
      return { total, open, inProgress, closed, highSeverity, resolvedPercentage };
    }),
    shareReplay(1)
  );

  constructor() {
    // Sincronizar BehaviorSubject con Signals
    this.state$.subscribe(state => {
      this._incidences.set(state.incidences);
      this._loading.set(state.loading);
      this._error.set(state.error);
      this._filters.set(state.filters);
      this._selectedId.set(state.selectedId);
    });
  }

  // ============================================================================
  // HELPERS PRIVADOS
  // ============================================================================

  private select<T>(selector: (state: IncidenceState) => T): Observable<T> {
    return this.state$.pipe(
      map(selector),
      distinctUntilChanged(),
      shareReplay(1)
    );
  }

  private updateState(partial: Partial<IncidenceState>): void {
    this.state$.next({ ...this.state$.value, ...partial });
  }

  // ============================================================================
  // ACCIONES - CARGA DE DATOS
  // ============================================================================

  /**
   * Cargar incidencias de un producto
   */
  loadIncidencesByProduct(productId: number): void {
    this._loading.set(true);
    this._error.set(null);
    this.updateState({ 
      loading: true, 
      error: null,
      filters: { ...this.state$.value.filters, productId }
    });
    
    this.productService.getIncidencesByProductId(productId).pipe(
      tap(incidences => {
        this.updateState({
          incidences,
          loading: false
        });
      }),
      catchError(error => {
        this.updateState({
          loading: false,
          error: 'Error al cargar incidencias'
        });
        return throwError(() => error);
      })
    ).subscribe();
  }

  /**
   * Recargar incidencias del producto actual
   */
  refresh(): void {
    const productId = this._filters().productId;
    if (productId) {
      this.loadIncidencesByProduct(productId);
    }
  }

  // ============================================================================
  // ACCIONES - CRUD
  // ============================================================================

  /**
   * Crear incidencia con actualización optimista
   */
  createIncidence(incidenceData: IncidenceCreateDto): Observable<Incidence> {
    const tempId = -Date.now();
    const optimisticIncidence: Incidence = {
      ...incidenceData,
      id: tempId,
      estado: 'ABIERTA',
      fechaCreacion: new Date().toISOString(),
      usuarioUsername: 'current_user',
      totalSoluciones: 0
    };
    
    // Actualización optimista
    const currentIncidences = this.state$.value.incidences;
    this.updateState({
      incidences: [...currentIncidences, optimisticIncidence]
    });
    
    return this.productService.createIncidence(incidenceData).pipe(
      tap(savedIncidence => {
        // Reemplazar temporal con real
        const incidences = this.state$.value.incidences.map(i =>
          i.id === tempId ? savedIncidence : i
        );
        this.updateState({ incidences });
      }),
      catchError(error => {
        // Revertir
        const incidences = this.state$.value.incidences.filter(i => i.id !== tempId);
        this.updateState({
          incidences,
          error: 'Error al crear incidencia'
        });
        return throwError(() => error);
      })
    );
  }

  /**
   * Actualizar incidencia
   */
  updateIncidence(id: number, updates: IncidenceUpdateDto): Observable<Incidence> {
    const currentIncidences = this.state$.value.incidences;
    const originalIncidence = currentIncidences.find(i => i.id === id);
    
    if (!originalIncidence) {
      return throwError(() => new Error('Incidencia no encontrada'));
    }
    
    // Actualización optimista
    this.updateState({
      incidences: currentIncidences.map(i =>
        i.id === id ? { ...i, ...updates } : i
      )
    });
    
    return this.productService.updateIncidence(id, updates).pipe(
      tap(updatedIncidence => {
        const incidences = this.state$.value.incidences.map(i =>
          i.id === id ? updatedIncidence : i
        );
        this.updateState({ incidences });
      }),
      catchError(error => {
        // Revertir
        const incidences = this.state$.value.incidences.map(i =>
          i.id === id ? originalIncidence : i
        );
        this.updateState({
          incidences,
          error: 'Error al actualizar incidencia'
        });
        return throwError(() => error);
      })
    );
  }

  /**
   * Eliminar incidencia
   */
  deleteIncidence(id: number): Observable<void> {
    const currentIncidences = this.state$.value.incidences;
    const deletedIncidence = currentIncidences.find(i => i.id === id);
    
    if (!deletedIncidence) {
      return throwError(() => new Error('Incidencia no encontrada'));
    }
    
    // Actualización optimista
    this.updateState({
      incidences: currentIncidences.filter(i => i.id !== id)
    });
    
    if (this.state$.value.selectedId === id) {
      this.updateState({ selectedId: null });
    }
    
    return this.productService.deleteIncidence(id).pipe(
      catchError(error => {
        // Restaurar
        this.updateState({
          incidences: [...this.state$.value.incidences, deletedIncidence],
          error: 'Error al eliminar incidencia'
        });
        return throwError(() => error);
      })
    );
  }

  /**
   * Marcar incidencia como resuelta
   */
  markAsResolved(id: number): Observable<Incidence> {
    return this.updateIncidence(id, { estado: 'CERRADA' });
  }

  /**
   * Reabrir incidencia
   */
  reopenIncidence(id: number): Observable<Incidence> {
    return this.updateIncidence(id, { estado: 'ABIERTA' });
  }

  // ============================================================================
  // ACCIONES - FILTROS
  // ============================================================================

  /**
   * Filtrar por estado
   */
  setStatusFilter(status: 'all' | IncidenceStatus): void {
    this.updateState({
      filters: { ...this.state$.value.filters, status }
    });
  }

  /**
   * Filtrar por severidad
   */
  setSeverityFilter(severity: 'all' | IncidenceSeverity): void {
    this.updateState({
      filters: { ...this.state$.value.filters, severity }
    });
  }

  /**
   * Filtrar por búsqueda
   */
  setSearchTerm(term: string): void {
    this.updateState({
      filters: { ...this.state$.value.filters, searchTerm: term }
    });
  }

  /**
   * Actualizar todos los filtros
   */
  setFilters(filters: Partial<IncidenceFilters>): void {
    this.updateState({
      filters: { ...this.state$.value.filters, ...filters }
    });
  }

  /**
   * Limpiar filtros (excepto productId)
   */
  clearFilters(): void {
    const productId = this.state$.value.filters.productId;
    this.updateState({
      filters: { ...initialFilters, productId }
    });
  }

  /**
   * Seleccionar incidencia
   */
  selectIncidence(id: number | null): void {
    this.updateState({ selectedId: id });
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
  // ACCIONES EXTERNAS (WebSocket/Polling)
  // ============================================================================

  addIncidenceToList(incidence: Incidence): void {
    const exists = this.state$.value.incidences.some(i => i.id === incidence.id);
    if (!exists) {
      this.updateState({
        incidences: [...this.state$.value.incidences, incidence]
      });
    }
  }

  updateIncidenceInList(incidence: Incidence): void {
    const incidences = this.state$.value.incidences.map(i =>
      i.id === incidence.id ? incidence : i
    );
    this.updateState({ incidences });
  }

  removeIncidenceFromList(id: number): void {
    this.updateState({
      incidences: this.state$.value.incidences.filter(i => i.id !== id)
    });
  }
}

