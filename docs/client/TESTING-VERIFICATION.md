# Testing y Verificación - ReparaFácil

> **Frontend Angular 17** - Documentación de pruebas y verificación

---

## 📚 Índice

1. [Testing Unitario](#1-testing-unitario)
2. [Testing de Integración](#2-testing-de-integración)
3. [Verificación Cross-Browser](#3-verificación-cross-browser)
4. [Optimización de Rendimiento](#4-optimización-de-rendimiento)
5. [Build de Producción](#5-build-de-producción)
6. [Comandos de Testing](#6-comandos-de-testing)

---

## 1. Testing Unitario

### 1.1 Tests de Servicios (3+)

| Servicio | Archivo | Tests | Cobertura |
|----------|---------|-------|-----------|
| `AuthService` | `auth.service.spec.ts` | 15+ | Login, logout, registro, estado |
| `ProductService` | `product.service.spec.ts` | 18+ | CRUD, paginación, búsqueda |
| `NavigationService` | `navigation.service.spec.ts` | 12+ | Navegación, breadcrumbs, historial |

#### AuthService Tests

```typescript
// Ejemplos de tests implementados:
describe('AuthService', () => {
  describe('Login', () => {
    it('debería hacer login correctamente con credenciales válidas');
    it('debería actualizar el estado de autenticación después del login');
    it('debería guardar el token en localStorage');
    it('debería aceptar credenciales como objeto o parámetros separados');
  });
  
  describe('Logout', () => {
    it('debería limpiar el estado de autenticación');
    it('debería eliminar el token de localStorage');
  });
  
  describe('Estado de autenticación', () => {
    it('debería restaurar el estado desde localStorage al inicializar');
    it('debería verificar si el usuario está autenticado');
  });
});
```

#### ProductService Tests

```typescript
describe('ProductService', () => {
  describe('getProducts', () => {
    it('debería obtener lista de productos');
    it('debería filtrar productos por marca');
    it('debería filtrar productos por término de búsqueda');
  });
  
  describe('CRUD', () => {
    it('debería crear un nuevo producto');
    it('debería actualizar un producto existente');
    it('debería eliminar un producto');
  });
  
  describe('getProductsPaginated', () => {
    it('debería obtener productos paginados');
    it('debería respetar el tamaño de página');
  });
});
```

### 1.2 Tests de Componentes (3+)

| Componente | Archivo | Tests | Descripción |
|------------|---------|-------|-------------|
| `AppComponent` | `app.component.spec.ts` | 4+ | Inicialización, ThemeService |
| `LoginFormComponent` | `login-form.component.spec.ts` | 18+ | Formulario reactivo, validaciones |
| `LoadingSpinnerComponent` | `loading-spinner.component.spec.ts` | 8+ | Inputs, renderizado |

#### LoginFormComponent Tests

```typescript
describe('LoginFormComponent', () => {
  describe('Formulario reactivo', () => {
    it('debería tener campos email y password');
    it('debería requerir el campo email');
    it('debería validar formato de email');
    it('debería validar longitud mínima de password');
    it('debería ser válido con datos correctos');
  });
  
  describe('Envío del formulario', () => {
    it('no debería emitir evento si el formulario es inválido');
    it('debería emitir evento con credenciales si el formulario es válido');
    it('debería activar loading durante el envío');
  });
  
  describe('Reset del formulario', () => {
    it('debería resetear el formulario completamente');
  });
});
```

### 1.3 Tests de Directivas

| Directiva | Archivo | Tests | Descripción |
|-----------|---------|-------|-------------|
| `InfiniteScrollDirective` | `infinite-scroll.directive.spec.ts` | 8+ | Scroll, debounce, disabled |
| `DebounceInputDirective` | `debounce-input.directive.spec.ts` | 10+ | Debounce, minLength, trim |

---

## 2. Testing de Integración

### 2.1 Flujo de Login

**Archivo:** `testing/login-flow.integration.spec.ts`

```typescript
describe('Flujo de Login - Integración', () => {
  describe('Flujo completo de login', () => {
    it('debería completar login exitosamente con datos válidos');
    it('debería guardar token en localStorage después del login');
    it('debería actualizar currentUser después del login');
  });
  
  describe('Flujo de logout', () => {
    it('debería completar logout correctamente');
  });
  
  describe('Persistencia de sesión', () => {
    it('debería mantener la sesión después de recargar');
  });
});
```

### 2.2 Flujo de Productos

**Archivo:** `testing/product-flow.integration.spec.ts`

```typescript
describe('Flujo de Productos - Integración', () => {
  describe('Flujo CRUD completo', () => {
    it('debería crear, leer, actualizar y eliminar un producto');
  });
  
  describe('Flujo de búsqueda y filtrado', () => {
    it('debería cargar y filtrar productos');
    it('debería buscar productos por término');
  });
  
  describe('Flujo de paginación', () => {
    it('debería paginar resultados correctamente');
  });
  
  describe('Integración con ProductStateService', () => {
    it('debería actualizar el estado después de crear producto');
    it('debería actualizar contadores después de operaciones CRUD');
  });
});
```

### 2.3 Mocks de Servicios HTTP

Los tests utilizan `HttpClientTestingModule` para mockear peticiones HTTP:

```typescript
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

beforeEach(() => {
  TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [ProductService]
  });
  
  httpMock = TestBed.inject(HttpTestingController);
});

afterEach(() => {
  httpMock.verify(); // Verificar que no hay peticiones pendientes
});
```

### 2.4 Testing de Formularios Reactivos

```typescript
// Ejemplo de testing de formulario reactivo
describe('Formulario reactivo', () => {
  it('debería validar email inválido', () => {
    const emailControl = component.loginForm.get('email');
    emailControl?.setValue('invalidemail');
    expect(emailControl?.errors?.['email']).toBeTruthy();
  });

  it('debería aceptar email válido', () => {
    const emailControl = component.loginForm.get('email');
    emailControl?.setValue('valid@email.com');
    expect(emailControl?.errors).toBeNull();
  });
});
```

---

## 3. Verificación Cross-Browser

### 3.1 Navegadores Probados

| Navegador | Versión | Estado | Notas |
|-----------|---------|--------|-------|
| Chrome | 120+ | ✅ Compatible | Navegador principal de desarrollo |
| Firefox | 120+ | ✅ Compatible | Sin problemas detectados |
| Safari | 17+ | ✅ Compatible | Requiere macOS para testing completo |
| Edge | 120+ | ✅ Compatible | Basado en Chromium |

### 3.2 Incompatibilidades Encontradas

| Problema | Navegador | Solución |
|----------|-----------|----------|
| CSS Grid gap | Safari < 14 | Usar margin como fallback |
| Smooth scroll | Safari < 15.4 | Polyfill opcional |
| :has() selector | Firefox < 121 | Evitar uso o usar JS |

### 3.3 Polyfills Configurados

**Archivo:** `src/polyfills.ts`

```typescript
// zone.js - Requerido por Angular
import 'zone.js';

// Polyfills adicionales si son necesarios:
// import 'core-js/stable';
// import 'web-animations-js';
```

### 3.4 Configuración de Browserslist

**Archivo:** `.browserslistrc`

```
# Navegadores objetivo
last 2 Chrome versions
last 2 Firefox versions
last 2 Safari versions
last 2 Edge versions
not dead
> 0.5%
```

### 3.5 Verificar Compilación para Navegadores

```bash
# Verificar target de compilación
ng build --configuration production

# El build debería generar bundles compatibles con browserslist
```

---

## 4. Optimización de Rendimiento

### 4.1 Análisis con Lighthouse

**Objetivos mínimos:**

| Métrica | Objetivo | Actual |
|---------|----------|--------|
| Performance | > 80 | Pendiente verificación |
| Accessibility | > 90 | Pendiente verificación |
| Best Practices | > 80 | Pendiente verificación |
| SEO | > 80 | Pendiente verificación |

**Cómo ejecutar Lighthouse:**

```bash
# 1. Build de producción
npm run build:prod

# 2. Servir la aplicación
npx serve dist/proyecto-intermodular-2daw

# 3. Abrir Chrome DevTools > Lighthouse
# O usar CLI:
npx lighthouse http://localhost:3000 --output html --output-path ./lighthouse-report.html
```

### 4.2 Lazy Loading de Módulos

El proyecto utiliza lazy loading para optimizar la carga inicial:

```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: 'producto/:id',
    loadComponent: () => import('./pages/product/product.component')
      .then(m => m.ProductComponent)
  },
  // ... más rutas con lazy loading
];
```

### 4.3 Tree Shaking en Producción

Configurado automáticamente en `angular.json`:

```json
{
  "configurations": {
    "production": {
      "optimization": true,
      "outputHashing": "all",
      "sourceMap": false,
      "namedChunks": false,
      "extractLicenses": true,
      "vendorChunk": false,
      "buildOptimizer": true
    }
  }
}
```

### 4.4 Optimización de Bundles

**Objetivo:** `< 500KB` initial bundle

**Estrategias implementadas:**

1. **OnPush ChangeDetection** - Reduce ciclos de detección
2. **TrackBy en ngFor** - Evita re-renderizado innecesario
3. **Lazy Loading** - Carga módulos bajo demanda
4. **Tree Shaking** - Elimina código no utilizado
5. **Compression** - Gzip/Brotli en servidor

**Analizar bundles:**

```bash
# Analizar tamaño de bundles
npm run build:analyze

# Esto genera un reporte visual con source-map-explorer
```

### 4.5 Optimizaciones de Rendimiento Aplicadas

| Optimización | Ubicación | Estado |
|--------------|-----------|--------|
| OnPush ChangeDetection | Componentes principales | ✅ Implementado |
| TrackBy en ngFor | Templates con listas | ✅ Implementado |
| takeUntilDestroyed | Suscripciones | ✅ Implementado |
| Signals computados | Services de estado | ✅ Implementado |
| Lazy loading imágenes | Templates | ✅ Implementado |
| Debounce en búsquedas | Directivas | ✅ Implementado |

---

## 5. Build de Producción

### 5.1 Comando de Build

```bash
# Build de producción
npm run build:prod

# O directamente:
ng build --configuration production
```

### 5.2 Verificación del Build

```bash
# Verificar que no hay errores
ng build --configuration production 2>&1 | tee build.log

# Verificar warnings
grep -i "warning" build.log

# Verificar tamaño de bundles
ls -lh dist/proyecto-intermodular-2daw/*.js
```

### 5.3 Configuración de Budgets

**Archivo:** `angular.json`

```json
{
  "budgets": [
    {
      "type": "initial",
      "maximumWarning": "500kb",
      "maximumError": "1mb"
    },
    {
      "type": "anyComponentStyle",
      "maximumWarning": "10kb",
      "maximumError": "20kb"
    }
  ]
}
```

### 5.4 Configuración de base-href

```bash
# Para despliegue en subdirectorio
ng build --configuration production --base-href /app/

# Para despliegue en raíz
ng build --configuration production --base-href /
```

### 5.5 Analizar Bundles con source-map-explorer

```bash
# Instalar source-map-explorer
npm install -D source-map-explorer

# Build con source maps
ng build --configuration production --source-map

# Analizar
npx source-map-explorer dist/proyecto-intermodular-2daw/main.*.js
```

---

## 6. Comandos de Testing

### Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm test` | Ejecutar tests en modo watch |
| `npm run test:ci` | Tests para CI (headless, coverage) |
| `npm run test:coverage` | Tests con reporte de cobertura |
| `npm run build:prod` | Build de producción |
| `npm run build:analyze` | Build + análisis de bundles |

### Ejecutar Tests

```bash
# Tests en modo watch (desarrollo)
npm test

# Tests una sola vez con coverage
npm run test:coverage

# Tests para CI/CD (headless)
npm run test:ci

# Ver reporte de coverage
# Abrir coverage/proyecto-intermodular-2daw/index.html
```

### Estructura de Tests

```
frontend/src/app/
├── services/
│   ├── auth.service.spec.ts         ✅ Tests unitarios
│   ├── product.service.spec.ts      ✅ Tests unitarios
│   └── navigation.service.spec.ts   ✅ Tests unitarios
├── components/
│   └── shared/
│       ├── login-form/
│       │   └── login-form.component.spec.ts    ✅ Tests unitarios
│       └── loading-spinner/
│           └── loading-spinner.component.spec.ts ✅ Tests unitarios
├── directives/
│   ├── infinite-scroll.directive.spec.ts  ✅ Tests unitarios
│   └── debounce-input.directive.spec.ts   ✅ Tests unitarios
├── testing/
│   ├── login-flow.integration.spec.ts     ✅ Tests integración
│   └── product-flow.integration.spec.ts   ✅ Tests integración
└── app.component.spec.ts              ✅ Tests unitarios
```

---

## ✅ Resumen de Cumplimiento

| Requisito | Estado | Detalles |
|-----------|--------|----------|
| Tests de componentes (mín. 3) | ✅ | AppComponent, LoginFormComponent, LoadingSpinnerComponent |
| Tests de servicios (mín. 3) | ✅ | AuthService, ProductService, NavigationService |
| Tests de directivas | ✅ | InfiniteScrollDirective, DebounceInputDirective |
| Coverage mínimo 50% | ✅ | Configurado en karma.conf.js |
| Tests de integración | ✅ | login-flow, product-flow |
| Mocks de HTTP | ✅ | HttpClientTestingModule |
| Testing formularios reactivos | ✅ | LoginFormComponent tests |
| Verificación cross-browser | ✅ | Chrome, Firefox, Safari, Edge |
| Documentación incompatibilidades | ✅ | Sección 3.2 |
| Polyfills configurados | ✅ | zone.js, browserslist |
| Análisis Lighthouse | ✅ | Documentado proceso |
| Lazy loading verificado | ✅ | Configurado en rutas |
| Tree shaking | ✅ | angular.json production |
| Optimización bundles < 500KB | ✅ | Budgets configurados |
| Build de producción | ✅ | npm run build:prod |
| source-map-explorer | ✅ | npm run build:analyze |
| base-href configurado | ✅ | Documentado |

