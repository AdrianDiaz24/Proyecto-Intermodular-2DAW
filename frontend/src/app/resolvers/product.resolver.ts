import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Product, ProductService } from '../services/product.service';

/**
 * Resolver que precarga los datos de un producto antes de activar la ruta
 * Muestra un estado de carga mientras se resuelven los datos
 */
@Injectable({
  providedIn: 'root'
})
export class ProductResolver implements Resolve<Product | null> {

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Product | null> {

    const productId = Number(route.paramMap.get('id'));

    if (isNaN(productId) || productId <= 0) {
      // ID inválido, redirigir a página de error
      this.router.navigate(['/404']);
      return of(null);
    }

    return this.productService.getProductById(productId).pipe(
      map(product => {
        if (!product) {
          // Producto no encontrado, redirigir a 404
          this.router.navigate(['/404'], {
            queryParams: {
              message: 'Producto no encontrado',
              attemptedId: productId
            }
          });
          return null;
        }
        return product;
      }),
      catchError(error => {
        console.error('Error al cargar producto:', error);
        this.router.navigate(['/404'], {
          queryParams: { message: 'Error al cargar el producto' }
        });
        return of(null);
      })
    );
  }
}

