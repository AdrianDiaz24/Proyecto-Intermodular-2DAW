import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigationService } from '../../app/services/navigation.service';
import { ProductService } from '../../app/services';
import { Product, Incidence } from '../../app/models';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  // Datos de productos disponibles (fallback si no hay resolver)
  private productsData: { [key: number]: any } = {
    1: {
      id: 1,
      name: 'Lavadora LG',
      brand: 'LG',
      model: 'WM4000CW',
      rating: 4.5,
      reviews: 28,
      image: 'assets/icons/logoNaranja.avif',
      description: 'Lavadora automática de carga frontal LG con capacidad de 8kg. Únete a la comunidad para reportar problemas y ayudar a otros usuarios con sus incidencias.',
      specifications: {
        weight: '85 kg',
        width: '60 cm',
        length: '55 cm',
        height: '85 cm',
        consumption: '237 kWh/año',
        characteristics: 'Motor Inverter Direct Drive, 16 programas, Ruido 72dB'
      },
      status: 'Disponible',
      incidences: 5,
      solved: 3
    },
    7: {
      id: 7,
      name: 'Lavadora LG',
      brand: 'LG',
      model: 'WM5000CW',
      rating: 4.7,
      reviews: 42,
      image: 'assets/icons/logoNaranja.avif',
      description: 'Lavadora LG inverter con tecnología AI DD y programa EcoHybrid. Únete a la comunidad para reportar problemas y ayudar a otros usuarios con sus incidencias.',
      specifications: {
        weight: '92 kg',
        width: '60 cm',
        length: '55 cm',
        height: '85 cm',
        consumption: '214 kWh/año',
        characteristics: 'Tecnología AI DD, 20 programas, WiFi Smart Diagnosis, Ruido 69dB'
      },
      status: 'Disponible',
      incidences: 3,
      solved: 3
    },
    8: {
      id: 8,
      name: 'Aspiradora LG',
      brand: 'LG',
      model: 'CordZero R9',
      rating: 4.8,
      reviews: 156,
      image: 'assets/icons/logoNaranja.avif',
      description: 'Aspiradora inalámbrica LG con motor sin escobillas y batería de larga duración. Únete a la comunidad para reportar problemas y ayudar a otros usuarios con sus incidencias.',
      specifications: {
        weight: '2.8 kg',
        width: '24 cm',
        length: '18 cm',
        height: '110 cm',
        consumption: '50 kWh/año',
        characteristics: 'Motor sin escobillas, Batería 60 min, Filtro HEPA, Autonomía completa'
      },
      status: 'Disponible',
      incidences: 2,
      solved: 2
    }
  };

  product: any;
  incidences: any[] = [];
  filteredIncidences: any[] = [];
  currentSlide = 0;
  itemsPerView = 3;
  searchQuery: string = '';
  filterStatus: 'all' | 'solved' | 'pending' = 'all';
  showReportIncidenceModal = false;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private navigationService: NavigationService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    // Primero intentar obtener datos del resolver
    this.route.data.subscribe(data => {
      if (data['product']) {
        this.product = this.mapResolvedProduct(data['product']);
        this.loadIncidences(this.product.id);
      }
    });

    // Si no hay datos del resolver, cargar por params
    this.route.params.subscribe(params => {
      const productId = +params['id'];
      if (!this.product || this.product.id !== productId) {
        this.product = this.productsData[productId] || this.productsData[1];
        this.loadIncidences(productId);
      }
    });

    // Verificar query params para destacar incidencia específica
    this.route.queryParams.subscribe(params => {
      if (params['incidenceId'] && params['highlight']) {
        this.highlightIncidence(+params['incidenceId']);
      }
    });
  }

  /**
   * Mapea el producto del resolver al formato local
   */
  private mapResolvedProduct(resolved: Product): any {
    return {
      id: resolved.id,
      name: resolved.name,
      brand: resolved.brand,
      model: resolved.model,
      rating: 4.5,
      reviews: 28,
      image: resolved.image || 'assets/icons/logoNaranja.avif',
      description: `${resolved.name} - Únete a la comunidad para reportar problemas y ayudar a otros usuarios con sus incidencias.`,
      specifications: {
        weight: resolved.weight || 'N/A',
        width: resolved.dimensions?.width || 'N/A',
        length: resolved.dimensions?.depth || 'N/A',
        height: resolved.dimensions?.height || 'N/A',
        consumption: resolved.energyConsumption || 'N/A',
        characteristics: resolved.otherSpecs || 'N/A'
      },
      status: 'Disponible',
      incidences: 5,  // Número de incidencias reportadas
      solved: 3       // Número de incidencias resueltas
    };
  }

  /**
   * Destaca una incidencia específica (para navegación con query params)
   */
  private highlightIncidence(incidenceId: number): void {
    setTimeout(() => {
      const element = document.getElementById(`incidence-${incidenceId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.classList.add('highlighted');
        setTimeout(() => element.classList.remove('highlighted'), 3000);
      }
    }, 500);
  }

  loadIncidences(productId: number): void {
    // Datos de ejemplo de incidencias para cada producto
    const incidencesData: { [key: number]: any[] } = {
      1: [
        {id: 1, title: 'No centrifuga', user: 'Juan M.', date: '2024-12-20', solved: false, replies: 3},
        {id: 2, title: 'Fuga de agua', user: 'María L.', date: '2024-12-18', solved: true, replies: 5},
        {id: 3, title: 'Error E2', user: 'Pedro G.', date: '2024-12-15', solved: false, replies: 2},
        {id: 4, title: 'Ruido excesivo', user: 'Ana P.', date: '2024-12-10', solved: true, replies: 4},
        {id: 5, title: 'No abre la puerta', user: 'Carlos R.', date: '2024-12-05', solved: false, replies: 1},
        {id: 6, title: 'Programa se queda a mitad', user: 'Laura D.', date: '2024-11-28', solved: true, replies: 3}
      ],
      7: [
        {id: 1, title: 'Conectividad WiFi', user: 'Roberto T.', date: '2024-12-19', solved: false, replies: 2},
        {id: 2, title: 'Pantalla oscura', user: 'Sofía H.', date: '2024-12-17', solved: true, replies: 4},
        {id: 3, title: 'Error AI DD', user: 'Miguel N.', date: '2024-12-12', solved: false, replies: 1}
      ],
      8: [
        {id: 1, title: 'Batería no carga', user: 'Javier S.', date: '2024-12-21', solved: true, replies: 3},
        {id: 2, title: 'Motor no funciona', user: 'Daniela V.', date: '2024-12-16', solved: false, replies: 2}
      ]
    };

    this.incidences = incidencesData[productId] || incidencesData[1];
    this.currentSlide = 0;
    this.applyFilters();
  }

  nextSlide(): void {
    if (this.currentSlide < this.incidences.length - this.itemsPerView) {
      this.currentSlide++;
    }
  }

  prevSlide(): void {
    if (this.currentSlide > 0) {
      this.currentSlide--;
    }
  }

  get visibleIncidences(): any[] {
    return this.incidences.slice(this.currentSlide, this.currentSlide + this.itemsPerView);
  }

  viewIncidence(incidenceId: number): void {
    // Navegar a la página de detalle de incidencia
    console.log('Navegando a incidencia:', incidenceId);
    this.router.navigate(['/incidencia', incidenceId]);
  }

  /**
   * Volver a la lista de productos usando el historial de navegación
   */
  goBack(): void {
    this.navigationService.goBack();
  }

  applyFilters(): void {
    let filtered = this.incidences;

    // Filtrar por estado
    if (this.filterStatus === 'solved') {
      filtered = filtered.filter(inc => inc.solved);
    } else if (this.filterStatus === 'pending') {
      filtered = filtered.filter(inc => !inc.solved);
    }

    // Filtrar por búsqueda
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(inc =>
          inc.title.toLowerCase().includes(query) ||
          inc.user.toLowerCase().includes(query)
      );
    }

    this.filteredIncidences = filtered;
  }

  onStatusFilterChange(): void {
    this.applyFilters();
  }

  onSearch(): void {
    this.applyFilters();
  }

  onAddIncidence(): void {
    this.showReportIncidenceModal = true;
  }

  onCloseReportModal(): void {
    this.showReportIncidenceModal = false;
  }

  onReportIncidenceSubmit(formData: any): void {
    console.log('Nueva incidencia reportada:', formData);
    // Aquí irá la lógica para enviar la incidencia al servidor
    // Por ahora solo cerramos el modal
    this.showReportIncidenceModal = false;
    // Recargar incidencias desde el servidor
    this.loadIncidences(1); // O el ID del producto actual
  }
}
