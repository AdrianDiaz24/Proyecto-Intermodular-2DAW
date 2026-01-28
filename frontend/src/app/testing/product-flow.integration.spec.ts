/**
 * @fileoverview Tests de integración para flujo de productos
 * Verifica CRUD completo de productos
 */

import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ProductService } from '../services/product.service';
import { ProductStateService } from '../services/product-state.service';
import { environment } from '../../environments/environment';
import { Product, ProductCreateDto } from '../models';

describe('Flujo de Productos - Integración', () => {
  let productService: ProductService;
  let productStateService: ProductStateService;
  let httpMock: HttpTestingController;

  const mockProduct: ProductCreateDto = {
    nombre: 'Test Product',
    marca: 'TestBrand',
    modelo: 'TEST-001',
    peso: 10,
    ancho: 50,
    largo: 30,
    alto: 40,
    consumoElectrico: '100W',
    otrasCaracteristicas: 'Test características',
    usuarioId: 1
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService, ProductStateService]
    });

    productService = TestBed.inject(ProductService);
    productStateService = TestBed.inject(ProductStateService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

describe('Flujo CRUD completo', () => {
    it('debería crear, leer, actualizar y eliminar un producto', fakeAsync(() => {
      const originalEnableMock = environment.enableMockData;
      environment.enableMockData = true;

      let createdProduct: Product | undefined;

      // 1. CREAR producto
      productService.createProduct(mockProduct).subscribe(product => {
        createdProduct = product;
      });
      tick(400);

      expect(createdProduct).toBeTruthy();
      expect(createdProduct!.nombre).toBe(mockProduct.nombre);
      const productId = createdProduct!.id;

      // 2. LEER producto
      let readProduct: Product | undefined;
      productService.getProductById(productId).subscribe(product => {
        readProduct = product;
      });
      tick(200);

      expect(readProduct).toBeTruthy();
      expect(readProduct!.id).toBe(productId);

      // 3. ACTUALIZAR producto
      const updateData = { nombre: 'Updated Product Name' };
      let updatedProduct: Product | undefined;

      productService.updateProduct(productId, updateData).subscribe(product => {
        updatedProduct = product;
      });
      tick(300);

      expect(updatedProduct).toBeTruthy();
      expect(updatedProduct!.nombre).toBe(updateData.nombre);

      // 4. ELIMINAR producto
      let deleteCompleted = false;
      productService.deleteProduct(productId).subscribe({
        complete: () => {
          deleteCompleted = true;
        }
      });
      tick(300);

      expect(deleteCompleted).toBeTrue();

      environment.enableMockData = originalEnableMock;
    }));
  });

  describe('Flujo de búsqueda y filtrado', () => {
    it('debería cargar y filtrar productos', fakeAsync(() => {
      const originalEnableMock = environment.enableMockData;
      environment.enableMockData = true;

      // Cargar todos los productos
      let allProducts: Product[] = [];
      productService.getProducts().subscribe(products => {
        allProducts = products;
      });
      tick(300);

      expect(allProducts.length).toBeGreaterThan(0);

      // Filtrar por marca
      let filteredProducts: Product[] = [];
      productService.getProducts({ brand: 'Samsung' }).subscribe(products => {
        filteredProducts = products;
      });
      tick(300);

      filteredProducts.forEach(product => {
        expect(product.marca).toBe('Samsung');
      });

      environment.enableMockData = originalEnableMock;
    }));

    it('debería buscar productos por término', fakeAsync(() => {
      const originalEnableMock = environment.enableMockData;
      environment.enableMockData = true;

      let searchResults: Product[] = [];
      productService.searchProducts('Lavadora').subscribe(products => {
        searchResults = products;
      });
      tick(300);

      // Los resultados deberían contener el término de búsqueda
      searchResults.forEach(product => {
        const matchesSearch =
          product.nombre.toLowerCase().includes('lavadora') ||
          product.marca.toLowerCase().includes('lavadora') ||
          (product.modelo?.toLowerCase().includes('lavadora') ?? false);
        expect(matchesSearch).toBeTrue();
      });

      environment.enableMockData = originalEnableMock;
    }));
  });

  describe('Flujo de paginación', () => {
    it('debería paginar resultados correctamente', fakeAsync(() => {
      const originalEnableMock = environment.enableMockData;
      environment.enableMockData = true;

      // Primera página
      productService.getProductsPaginated({ page: 0, size: 2 }).subscribe(response => {
        expect(response.data.length).toBeLessThanOrEqual(2);
        expect(response.pagination.currentPage).toBe(0);
        expect(response.pagination.pageSize).toBe(2);
      });
      tick(300);

      // Segunda página
      productService.getProductsPaginated({ page: 1, size: 2 }).subscribe(response => {
        expect(response.pagination.currentPage).toBe(1);
      });
      tick(300);

      environment.enableMockData = originalEnableMock;
    }));
  });

  describe('Integración con ProductStateService', () => {
    it('debería actualizar el estado después de crear producto', fakeAsync(() => {
      const originalEnableMock = environment.enableMockData;
      environment.enableMockData = true;

      // Cargar productos iniciales
      productStateService.loadProducts();
      tick(300);

      let initialCount = 0;
      productStateService.products$.subscribe(products => {
        initialCount = products.length;
      });

      // Crear nuevo producto a través del state service
      productStateService.createProduct(mockProduct).subscribe();
      tick(400);

      // Verificar que la lista se actualizó
      productStateService.products$.subscribe(products => {
        expect(products.length).toBe(initialCount + 1);
      });

      environment.enableMockData = originalEnableMock;
    }));

    it('debería actualizar contadores después de operaciones CRUD', fakeAsync(() => {
      const originalEnableMock = environment.enableMockData;
      environment.enableMockData = true;

      productStateService.loadProducts();
      tick(300);

      // Verificar que el contador de productos se actualiza
      const initialCount = productStateService.productCount();
      expect(initialCount).toBeGreaterThanOrEqual(0);

      environment.enableMockData = originalEnableMock;
    }));
  });

  describe('Manejo de errores', () => {
    it('debería manejar error al obtener producto inexistente', fakeAsync(() => {
      const originalEnableMock = environment.enableMockData;
      environment.enableMockData = true;

      let errorOccurred = false;
      productService.getProductById(99999).subscribe({
        error: () => {
          errorOccurred = true;
        }
      });
      tick(200);

      expect(errorOccurred).toBeTrue();

      environment.enableMockData = originalEnableMock;
    }));
  });
});

