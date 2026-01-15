import { Injectable } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute, NavigationExtras } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

export interface Breadcrumb {
  label: string;
  url: string;
  icon?: string;
}

/**
 * Servicio para gestionar la navegación programática y breadcrumbs
 */
@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  private breadcrumbsSubject = new BehaviorSubject<Breadcrumb[]>([]);
  public breadcrumbs$: Observable<Breadcrumb[]> = this.breadcrumbsSubject.asObservable();

  private navigationHistorySubject = new BehaviorSubject<string[]>([]);
  public navigationHistory$: Observable<string[]> = this.navigationHistorySubject.asObservable();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.initBreadcrumbListener();
  }

  /**
   * Inicializa el listener para actualizar breadcrumbs en cada navegación
   */
  private initBreadcrumbListener(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const breadcrumbs = this.buildBreadcrumbs(this.activatedRoute.root);
      this.breadcrumbsSubject.next(breadcrumbs);

      // Actualizar historial de navegación
      const history = this.navigationHistorySubject.value;
      if (history[history.length - 1] !== event.urlAfterRedirects) {
        history.push(event.urlAfterRedirects);
        // Mantener solo las últimas 10 URLs
        if (history.length > 10) {
          history.shift();
        }
        this.navigationHistorySubject.next([...history]);
      }
    });
  }

  /**
   * Construye los breadcrumbs basándose en la estructura de rutas
   */
  private buildBreadcrumbs(
    route: ActivatedRoute,
    url: string = '',
    breadcrumbs: Breadcrumb[] = []
  ): Breadcrumb[] {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');

      if (routeURL !== '') {
        url += `/${routeURL}`;
      }

      // Obtener label del data de la ruta
      const label = child.snapshot.data['breadcrumb'];
      const icon = child.snapshot.data['icon'];

      if (label) {
        // Si el label tiene parámetros dinámicos, reemplazarlos
        let resolvedLabel = label;

        // Reemplazar :param con el valor real
        const params = child.snapshot.params;
        for (const key in params) {
          resolvedLabel = resolvedLabel.replace(`:${key}`, params[key]);
        }

        // Si hay datos resueltos, intentar obtener el nombre del producto
        const resolvedData = child.snapshot.data;
        if (resolvedData['product'] && label.includes(':name')) {
          resolvedLabel = label.replace(':name', resolvedData['product'].name);
        }

        breadcrumbs.push({
          label: resolvedLabel,
          url: url,
          icon: icon
        });
      }

      return this.buildBreadcrumbs(child, url, breadcrumbs);
    }

    return breadcrumbs;
  }

  /**
   * Navegación programática básica
   */
  navigateTo(path: string | string[]): Promise<boolean> {
    const pathArray = Array.isArray(path) ? path : [path];
    return this.router.navigate(pathArray);
  }

  /**
   * Navegación con parámetros de ruta
   */
  navigateWithParams(path: string[], params: { [key: string]: any }): Promise<boolean> {
    return this.router.navigate([...path, params]);
  }

  /**
   * Navegación con query params
   */
  navigateWithQueryParams(path: string | string[], queryParams: { [key: string]: any }): Promise<boolean> {
    const pathArray = Array.isArray(path) ? path : [path];
    return this.router.navigate(pathArray, { queryParams });
  }

  /**
   * Navegación con fragment (ancla)
   */
  navigateWithFragment(path: string | string[], fragment: string): Promise<boolean> {
    const pathArray = Array.isArray(path) ? path : [path];
    return this.router.navigate(pathArray, { fragment });
  }

  /**
   * Navegación con NavigationExtras completas
   */
  navigateWithExtras(path: string | string[], extras: NavigationExtras): Promise<boolean> {
    const pathArray = Array.isArray(path) ? path : [path];
    return this.router.navigate(pathArray, extras);
  }

  /**
   * Navegación con estado (para pasar datos entre componentes)
   */
  navigateWithState(path: string | string[], state: { [key: string]: any }): Promise<boolean> {
    const pathArray = Array.isArray(path) ? path : [path];
    return this.router.navigate(pathArray, { state });
  }

  /**
   * Obtiene el estado de la navegación actual
   */
  getNavigationState(): any {
    return this.router.getCurrentNavigation()?.extras?.state ||
           window.history.state;
  }

  /**
   * Navega hacia atrás en el historial
   */
  goBack(): void {
    const history = this.navigationHistorySubject.value;
    if (history.length > 1) {
      history.pop(); // Quitar URL actual
      const previousUrl = history[history.length - 1];
      this.navigationHistorySubject.next([...history]);
      this.router.navigateByUrl(previousUrl);
    } else {
      this.router.navigate(['/']);
    }
  }

  /**
   * Navega al producto por ID
   */
  goToProduct(productId: number, extras?: NavigationExtras): Promise<boolean> {
    return this.router.navigate(['/producto', productId], extras);
  }

  /**
   * Navega a la búsqueda con un término
   */
  goToSearch(searchTerm: string): Promise<boolean> {
    return this.router.navigate(['/buscar'], {
      queryParams: { q: searchTerm }
    });
  }

  /**
   * Navega al login con URL de retorno
   */
  goToLogin(returnUrl?: string): Promise<boolean> {
    const extras: NavigationExtras = returnUrl
      ? { queryParams: { returnUrl } }
      : {};
    return this.router.navigate(['/login'], extras);
  }

  /**
   * Verifica si la ruta actual coincide con la proporcionada
   */
  isCurrentRoute(path: string): boolean {
    return this.router.url === path || this.router.url.startsWith(path + '?');
  }

  /**
   * Obtiene la URL actual
   */
  getCurrentUrl(): string {
    return this.router.url;
  }

  /**
   * Obtiene los breadcrumbs actuales de forma síncrona
   */
  getBreadcrumbs(): Breadcrumb[] {
    return this.breadcrumbsSubject.value;
  }
}

