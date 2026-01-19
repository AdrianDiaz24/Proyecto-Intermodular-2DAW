import { Routes } from '@angular/router';
import { HomeComponent } from '../pages/home/home.component';
import { LoginComponent } from '../pages/login/login.component';
import { RegisterComponent } from '../pages/register/register.component';
import { StyleGuideComponent } from '../pages/style-guide/style-guide.component';
import { ProfileComponent } from '../pages/profile/profile.component';
import { SearchResultsComponent } from '../pages/search-results/search-results.component';
import { ProductComponent } from '../pages/product/product.component';
import { IncidenceDetailComponent } from '../pages/incidence-detail/incidence-detail.component';
import { NotFoundComponent } from '../pages/not-found/not-found.component';
import { AboutComponent } from '../pages/about/about.component';

// Guards
import { AuthGuard } from './guards/auth.guard';
import { GuestGuard } from './guards/guest.guard';
import { UnsavedChangesGuard } from './guards/unsaved-changes.guard';

// Resolvers
import { ProductResolver } from './resolvers/product.resolver';
import { UserResolver } from './resolvers/user.resolver';

/**
 * Configuración de rutas principales de la aplicación
 *
 * Incluye:
 * - Rutas básicas (home, login, register, about)
 * - Rutas con parámetros (/producto/:id)
 * - Rutas protegidas con guards (perfil)
 * - Rutas con resolvers para precarga de datos
 * - Ruta wildcard para 404
 * - Breadcrumbs dinámicos mediante data
 */
export const appRoutes: Routes = [
    // ==========================================
    // RUTAS PÚBLICAS
    // ==========================================

    {
        path: '',
        component: HomeComponent,
        data: {
            breadcrumb: null, // No mostrar en breadcrumbs (es el inicio)
            title: 'Inicio'
        }
    },

    // ==========================================
    // RUTAS DE AUTENTICACIÓN (solo para invitados)
    // ==========================================

    {
        path: 'login',
        component: LoginComponent,
        canActivate: [GuestGuard],
        data: {
            breadcrumb: 'Iniciar Sesión',
            title: 'Iniciar Sesión'
        }
    },

    {
        path: 'register',
        component: RegisterComponent,
        canActivate: [GuestGuard],
        data: {
            breadcrumb: 'Registro',
            title: 'Crear Cuenta'
        }
    },

    // ==========================================
    // RUTAS PROTEGIDAS (requieren autenticación)
    // ==========================================

    {
        path: 'perfil',
        component: ProfileComponent,
        canActivate: [AuthGuard],
        canDeactivate: [UnsavedChangesGuard],
        resolve: {
            user: UserResolver
        },
        data: {
            breadcrumb: 'Mi Perfil',
            title: 'Mi Perfil'
        }
    },

    // ==========================================
    // RUTAS DE PRODUCTOS
    // ==========================================

    {
        path: 'buscar',
        component: SearchResultsComponent,
        data: {
            breadcrumb: 'Búsqueda',
            title: 'Resultados de Búsqueda'
        }
    },

    {
        path: 'productos',
        component: SearchResultsComponent,
        data: {
            breadcrumb: 'Productos',
            title: 'Listado de Productos'
        }
    },

    {
        path: 'producto/:id',
        component: ProductComponent,
        resolve: {
            product: ProductResolver
        },
        data: {
            breadcrumb: 'Detalle de Producto',
            title: 'Detalle de Producto'
        },
        // Rutas hijas anidadas para el producto
        children: [
            {
                path: 'incidencias',
                component: ProductComponent, // Mismo componente, diferente vista
                data: {
                    breadcrumb: 'Incidencias',
                    title: 'Incidencias del Producto',
                    view: 'incidences'
                }
            },
            {
                path: 'nueva-incidencia',
                component: ProductComponent,
                canActivate: [AuthGuard],
                data: {
                    breadcrumb: 'Nueva Incidencia',
                    title: 'Reportar Incidencia',
                    view: 'newIncidence'
                }
            }
        ]
    },

    // ==========================================
    // RUTAS INFORMATIVAS
    // ==========================================

    {
        path: 'about',
        component: AboutComponent,
        data: {
            breadcrumb: 'Sobre Nosotros',
            title: 'Sobre ReparaFácil'
        }
    },

    // ==========================================
    // RUTAS DE UTILIDAD
    // ==========================================

    {
        path: 'style-guide',
        component: StyleGuideComponent,
        data: {
            breadcrumb: 'Guía de Estilos',
            title: 'Guía de Estilos'
        }
    },

    // ==========================================
    // RUTAS DE INCIDENCIAS
    // ==========================================

    {
        path: 'incidencia/:id',
        component: IncidenceDetailComponent,
        data: {
            breadcrumb: 'Detalle de Incidencia',
            title: 'Detalle de Incidencia'
        }
    },

    // ==========================================
    // PÁGINA 404
    // ==========================================

    {
        path: '404',
        component: NotFoundComponent,
        data: {
            breadcrumb: 'Página no encontrada',
            title: 'Error 404'
        }
    },

    // Ruta wildcard - redirige a 404
    {
        path: '**',
        redirectTo: '404'
    }
];

/**
 * Rutas para carga perezosa (Lazy Loading)
 * Se usarían en una versión más modularizada de la aplicación
 *
 * Ejemplo de uso:
 * {
 *   path: 'admin',
 *   loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
 * }
 */
export const lazyRoutes: Routes = [
    // Estas rutas se cargarían de forma perezosa en producción
    // cuando la aplicación crezca y se modularice
];

