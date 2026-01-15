import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { User, AuthService } from '../services/auth.service';

/**
 * Resolver que precarga los datos del usuario antes de activar la ruta del perfil
 */
@Injectable({
  providedIn: 'root'
})
export class UserResolver implements Resolve<User | null> {

  constructor(private authService: AuthService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<User | null> {
    return this.authService.currentUser$;
  }
}

