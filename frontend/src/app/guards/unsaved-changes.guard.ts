import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';

/**
 * Interfaz que deben implementar los componentes con formularios
 * que necesiten confirmación antes de salir
 */
export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

/**
 * Guard que previene la navegación si hay cambios sin guardar en un formulario
 * Los componentes deben implementar la interfaz CanComponentDeactivate
 */
@Injectable({
  providedIn: 'root'
})
export class UnsavedChangesGuard implements CanDeactivate<CanComponentDeactivate> {

  canDeactivate(
    component: CanComponentDeactivate
  ): Observable<boolean> | Promise<boolean> | boolean {

    // Si el componente implementa canDeactivate, llamarlo
    if (component.canDeactivate) {
      return component.canDeactivate();
    }

    // Por defecto, permitir la navegación
    return true;
  }
}

