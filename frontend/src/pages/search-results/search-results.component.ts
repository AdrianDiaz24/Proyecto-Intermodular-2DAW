import { Component, OnInit, ChangeDetectionStrategy, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { NavigationService } from '../../app/services/navigation.service';
import { ProductService } from '../../app/services/product.service';

/**
 * Componente de resultados de búsqueda
 * Implementa OnPush para optimización de rendimiento
 */
@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchResultsComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  searchQuery: string = '';
  loading = false;

  // Datos de ejemplo de resultados de búsqueda (productos)
  searchResults = [
    {
      id: 1,
      title: 'Lavadora Samsung',
      description: 'Lavadora automática Samsung con carga frontal y programa de lavado delicado',
      category: 'Electrodomésticos'
    },
    {
      id: 2,
      title: 'Refrigerador LG',
      description: 'Refrigerador LG con compresor inverter y sistema de enfriamiento dual',
      category: 'Electrodomésticos'
    },
    {
      id: 3,
      title: 'Horno Bosch',
      description: 'Horno eléctrico Bosch con convección y panel digital',
      category: 'Electrodomésticos'
    },
    {
      id: 4,
      title: 'Aire Acondicionado Daikin',
      description: 'Aire acondicionado split Daikin con filtro antibacterial',
      category: 'Climatización'
    },
    {
      id: 5,
      title: 'Microondas Panasonic',
      description: 'Microondas Panasonic con función grill integrada',
      category: 'Electrodomésticos'
    },
    {
      id: 6,
      title: 'Lavavajillas Electrolux',
      description: 'Lavavajillas automático Electrolux con 13 programas de lavado',
      category: 'Electrodomésticos'
    },
    {
      id: 7,
      title: 'Lavadora LG',
      description: 'Lavadora LG inverter con tecnología AI DD y programa EcoHybrid',
      category: 'Electrodomésticos'
    },
    {
      id: 8,
      title: 'Aspiradora LG',
      description: 'Aspiradora inalámbrica LG con motor sin escobillas y batería de larga duración',
      category: 'Electrodomésticos'
    }
  ];

  filteredResults: any[] = [];
  showAddProductModal = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private navigationService: NavigationService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    // Inicializar con todos los productos
    this.filteredResults = this.searchResults;

    // Obtener el parámetro de búsqueda de la URL
    // Usando takeUntilDestroyed para evitar memory leaks
    this.route.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params: Params) => {
        this.searchQuery = params['q'] || '';
        this.filterResults();
      });
  }

  /**
   * TrackBy function para optimización de ngFor
   * @param index Índice del elemento
   * @param item Elemento de la lista
   * @returns ID único del elemento
   */
  trackByResultId(index: number, item: { id: number }): number {
    return item.id;
  }

  /**
   * Navega al producto seleccionado
   */
  goToProduct(productId: number): void {
    this.navigationService.goToProduct(productId, {
      state: { fromSearch: true, searchQuery: this.searchQuery }
    });
  }

  /**
   * Realiza una nueva búsqueda actualizando los query params
   */
  onSearch(): void {
    this.navigationService.goToSearch(this.searchQuery);
  }

  filterResults(): void {
    if (!this.searchQuery.trim()) {
      this.filteredResults = this.searchResults;
    } else {
      const query = this.searchQuery.toLowerCase();
      this.filteredResults = this.searchResults.filter(result =>
        result.title.toLowerCase().includes(query) ||
        result.description.toLowerCase().includes(query) ||
        result.category.toLowerCase().includes(query)
      );
    }
  }


  openAddProductModal(): void {
    this.showAddProductModal = true;
  }

  closeAddProductModal(): void {
    this.showAddProductModal = false;
  }

  viewProduct(productId: number): void {
    this.router.navigate(['/producto', productId]);
  }
}

