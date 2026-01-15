import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { take, catchError, tap, switchMap, filter } from 'rxjs/operators';
import { User } from '../models';
import { AuthService } from '../services';

/**
 * Resolver que precarga los datos del usuario antes de activar la ruta del perfil
 */
@Injectable({
  providedIn: 'root'
})
export class UserResolver implements Resolve<User | null> {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<User | null> {
    console.log('UserResolver: Intentando obtener usuario...');

    // Primero verificar si hay usuario en localStorage (puede estar más actualizado)
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        console.log('UserResolver: Usuario encontrado en localStorage:', user);
        return of(user);
      } catch (e) {
        console.error('UserResolver: Error parsing stored user', e);
      }
    }

    // Si no hay en localStorage, obtener del servicio
    return this.authService.currentUser$.pipe(
      take(1),
      tap(user => console.log('UserResolver: Usuario del servicio:', user)),
      catchError((error) => {
        console.error('UserResolver: Error al obtener usuario', error);
        return of(null);
      })
    );
  }
}

