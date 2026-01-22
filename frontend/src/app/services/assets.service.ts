import { Injectable, Inject, Optional } from '@angular/core';
import { APP_BASE_HREF, DOCUMENT } from '@angular/common';

/**
 * Servicio para manejar rutas de assets de forma consistente
 * Resuelve rutas relativas considerando el base-href de la aplicación
 */
@Injectable({
  providedIn: 'root'
})
export class AssetsService {
  private baseHref: string;

  constructor(
    @Optional() @Inject(APP_BASE_HREF) appBaseHref: string | null,
    @Inject(DOCUMENT) private document: Document
  ) {
    // Prioridad: APP_BASE_HREF inyectado > base tag del documento > '/'
    this.baseHref = appBaseHref || this.getDocumentBaseHref() || '/';
    console.log('AssetsService baseHref:', this.baseHref);
  }

  /**
   * Obtiene el base href del documento HTML
   */
  private getDocumentBaseHref(): string {
    const base = this.document.querySelector('base');
    if (base && base.getAttribute('href')) {
      return base.getAttribute('href') || '/';
    }
    return '/';
  }

  /**
   * Resuelve una ruta de asset agregando el base-href si es necesario
   * @param assetPath Ruta del asset (ej: 'assets/icons/logo.avif')
   * @returns Ruta completa del asset
   */
  getAssetUrl(assetPath: string): string {
    // Si ya es una URL absoluta, devolverla tal cual
    if (assetPath.startsWith('http://') || assetPath.startsWith('https://') || assetPath.startsWith('data:')) {
      return assetPath;
    }

    // Limpiar el path de asset (quitar / o ./ al inicio)
    const cleanPath = assetPath.replace(/^\.?\//, '');

    // Limpiar el baseHref (asegurar que termine con /)
    const cleanBase = this.baseHref.endsWith('/') ? this.baseHref : this.baseHref + '/';

    return cleanBase + cleanPath;
  }

  /**
   * Obtiene la URL de una imagen de icono
   */
  getIconUrl(iconName: string): string {
    return this.getAssetUrl(`assets/icons/${iconName}`);
  }

  /**
   * Obtiene la URL de una imagen
   */
  getImageUrl(imageName: string): string {
    return this.getAssetUrl(`assets/images/${imageName}`);
  }
}

