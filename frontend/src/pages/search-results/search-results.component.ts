import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit {
  searchQuery: string = '';

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

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Obtener el parámetro de búsqueda de la URL
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['q'] || '';
      this.filterResults();
    });
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

  onSearch(query: string): void {
    this.searchQuery = query;
    this.filterResults();
  }

  openAddProductModal(): void {
    this.showAddProductModal = true;
  }

  closeAddProductModal(): void {
    this.showAddProductModal = false;
  }
}

