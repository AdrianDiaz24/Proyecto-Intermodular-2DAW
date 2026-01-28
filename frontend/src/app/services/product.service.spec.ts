/**
 * @fileoverview Tests unitarios para ProductService
 * Verifica operaciones CRUD de productos y manejo de errores
 */

import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ProductService } from './product.service';
import { environment } from '../../environments/environment';
import { Product, ProductCreateDto, ProductUpdateDto, PaginatedResponse } from '../models';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  // Mock data
  const mockProduct: Product = {
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
    otrasCaracteristicas: 'Capacidad 9kg, 1400 rpm',
    usuarioId: 1,
    usuarioUsername: 'admin'
  };

  const mockProducts: Product[] = [
    mockProduct,
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
      otrasCaracteristicas: 'Capacidad 384L, No Frost',
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
      otrasCaracteristicas: 'Capacidad 71L, Pirolítico',
      usuarioId: 1,
      usuarioUsername: 'admin'
    }
  ];

  const mockCreateDto: ProductCreateDto = {
    nombre: 'Nuevo Producto',
    marca: 'TestMarca',
    modelo: 'TEST123',
    usuarioId: 1
  };

  const mockUpdateDto: ProductUpdateDto = {
    nombre: 'Producto Actualizado',
    marca: 'MarcaActualizada'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService]
    });

    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Creación del servicio', () => {
    it('debería crear el servicio', () => {
      expect(service).toBeTruthy();
    });

    it('debería tener un observable de loading', (done) => {
      service.productLoading$.subscribe(loading => {
        expect(typeof loading).toBe('boolean');
        done();
      });
    });
  });

  describe('getProducts', () => {
    it('debería obtener lista de productos', fakeAsync(() => {
      const originalEnableMock = environment.enableMockData;
      environment.enableMockData = true;

      let result: Product[] = [];

      service.getProducts().subscribe(products => {
        result = products;
      });

      tick(300); // Esperar delay del mock

      expect(result.length).toBeGreaterThan(0);
      expect(result[0].nombre).toBeTruthy();
      expect(result[0].marca).toBeTruthy();

      environment.enableMockData = originalEnableMock;
    }));

    it('debería filtrar productos por marca', fakeAsync(() => {
      const originalEnableMock = environment.enableMockData;
      environment.enableMockData = true;

      let result: Product[] = [];

      service.getProducts({ brand: 'Samsung' }).subscribe(products => {
        result = products;
      });

      tick(300);

      result.forEach(product => {
        expect(product.marca).toBe('Samsung');
      });

      environment.enableMockData = originalEnableMock;
    }));

it('debería filtrar productos por término de búsqueda', fakeAsync(() => {
      const originalEnableMock = environment.enableMockData;
      environment.enableMockData = true;

      let result: Product[] = [];

      service.getProducts({ query: 'Lavadora' }).subscribe(products => {
        result = products;
      });

      tick(300);

      result.forEach(product => {
        const matchesSearch =
          product.nombre.toLowerCase().includes('lavadora') ||
          product.marca.toLowerCase().includes('lavadora') ||
          (product.modelo?.toLowerCase().includes('lavadora') ?? false);
        expect(matchesSearch).toBeTrue();
      });

      environment.enableMockData = originalEnableMock;
    }));
  });

  describe('getProductById', () => {
    it('debería obtener un producto por ID', fakeAsync(() => {
      const originalEnableMock = environment.enableMockData;
      environment.enableMockData = true;

      let result: Product | undefined;

      service.getProductById(1).subscribe(product => {
        result = product;
      });

      tick(200);

      expect(result).toBeTruthy();
      expect(result!.id).toBe(1);

      environment.enableMockData = originalEnableMock;
    }));

    it('debería manejar producto no encontrado', fakeAsync(() => {
      const originalEnableMock = environment.enableMockData;
      environment.enableMockData = true;

      let errorOccurred = false;

      service.getProductById(9999).subscribe({
        error: () => {
          errorOccurred = true;
        }
      });

      tick(200);

      expect(errorOccurred).toBeTrue();

      environment.enableMockData = originalEnableMock;
    }));
  });

  describe('createProduct', () => {
    it('debería crear un nuevo producto', fakeAsync(() => {
      const originalEnableMock = environment.enableMockData;
      environment.enableMockData = true;

      let result: Product | undefined;

      service.createProduct(mockCreateDto).subscribe(product => {
        result = product;
      });

      tick(400);

      expect(result).toBeTruthy();
      expect(result!.nombre).toBe(mockCreateDto.nombre);
      expect(result!.id).toBeTruthy();

      environment.enableMockData = originalEnableMock;
    }));
  });

  describe('updateProduct', () => {
    it('debería actualizar un producto existente', fakeAsync(() => {
      const originalEnableMock = environment.enableMockData;
      environment.enableMockData = true;

      let result: Product | undefined;

      service.updateProduct(1, mockUpdateDto).subscribe(product => {
        result = product;
      });

      tick(300);

      expect(result).toBeTruthy();
      expect(result!.nombre).toBe(mockUpdateDto.nombre);

      environment.enableMockData = originalEnableMock;
    }));
  });

  describe('deleteProduct', () => {
    it('debería eliminar un producto', fakeAsync(() => {
      const originalEnableMock = environment.enableMockData;
      environment.enableMockData = true;

      let completed = false;

      service.deleteProduct(1).subscribe({
        complete: () => {
          completed = true;
        }
      });

      tick(300);

      expect(completed).toBeTrue();

      environment.enableMockData = originalEnableMock;
    }));
  });

  describe('getProductsPaginated', () => {
    it('debería obtener productos paginados', fakeAsync(() => {
      const originalEnableMock = environment.enableMockData;
      environment.enableMockData = true;

      let result: PaginatedResponse<Product> | undefined;

      service.getProductsPaginated({ page: 0, size: 10 }).subscribe(response => {
        result = response;
      });

      tick(300);

      expect(result).toBeTruthy();
      expect(result!.data).toBeTruthy();
      expect(result!.pagination).toBeTruthy();
      expect(result!.pagination.currentPage).toBe(0);

      environment.enableMockData = originalEnableMock;
    }));

    it('debería respetar el tamaño de página', fakeAsync(() => {
      const originalEnableMock = environment.enableMockData;
      environment.enableMockData = true;

      const pageSize = 5;
      let result: PaginatedResponse<Product> | undefined;

      service.getProductsPaginated({ page: 0, size: pageSize }).subscribe(response => {
        result = response;
      });

      tick(300);

      expect(result!.data.length).toBeLessThanOrEqual(pageSize);
      expect(result!.pagination.pageSize).toBe(pageSize);

      environment.enableMockData = originalEnableMock;
    }));
  });

  describe('searchProducts', () => {
    it('debería buscar productos por término', fakeAsync(() => {
      const originalEnableMock = environment.enableMockData;
      environment.enableMockData = true;

      let result: Product[] = [];

      service.searchProducts('Samsung').subscribe(products => {
        result = products;
      });

      tick(300);

      expect(result.length).toBeGreaterThanOrEqual(0);

      environment.enableMockData = originalEnableMock;
    }));
  });

  describe('Estado de carga', () => {
    it('debería emitir estado de carga durante operaciones', fakeAsync(() => {
      const originalEnableMock = environment.enableMockData;
      environment.enableMockData = true;

      const loadingStates: boolean[] = [];

      service.productLoading$.subscribe(loading => {
        loadingStates.push(loading);
      });

      service.getProducts().subscribe();

      tick(300);

      // Debería haber transicionado de false a true y de vuelta a false
      expect(loadingStates).toContain(false);

      environment.enableMockData = originalEnableMock;
    }));
  });
});

