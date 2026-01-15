import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';
import { Product } from '../models';
import { ProductService } from '../services';

/**
 * Resolver que precarga los datos de un producto antes de activar la ruta
 * Si no encuentra el producto, devuelve null y deja que el componente maneje el fallback
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
    console.log('ProductResolver: Buscando producto con ID:', productId);

    if (isNaN(productId) || productId <= 0) {
      console.warn('ProductResolver: ID inválido');
      return of(null);
    }

    return this.productService.getProductById(productId).pipe(
      take(1),
      map(product => {
        console.log('ProductResolver: Producto encontrado:', product);
        // Devolver el producto o null (el componente manejará el fallback)
        return product || null;
      }),
      catchError(error => {
        console.error('ProductResolver: Error al cargar producto:', error);
        // No redirigir, dejar que el componente maneje el error
        return of(null);
      })
    );
  }
}

