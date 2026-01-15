# DOCUMENTACIÓN - ARQUITECTURA CSS Y COMUNICACIÓN VISUAL

## 1. Arquitectura CSS y Comunicación Visual

---

## 1.1 Principios de Comunicación Visual

### 1.1.1 Jerarquía Visual

**Principio:**
La jerarquía visual guía al usuario a través de la interfaz, estableciendo qué es importante y en qué orden debe procesarse la información.

**Aplicación en el proyecto:**

```
PRIMARIO (Máxima importancia)
↓
Títulos (H1-H3): 
  - Tamaño: 2.5rem - 4.5rem ($font-size-5xl a $font-size-3xl)
  - Peso: 700 (bold)
  - Espaciado: margin-bottom $spacing-6
  
SECUNDARIO (Importancia media)
↓
Subtítulos (H4-H6):
  - Tamaño: 1rem - 1.75rem ($font-size-lg a $font-size-2xl)
  - Peso: 600 (semibold)
  - Espaciado: margin-bottom $spacing-4
  
TERCIARIO (Baja importancia)
↓
Texto base (p, span):
  - Tamaño: 1rem ($font-size-base)
  - Peso: 400 (regular)
  - Espaciado: margin-bottom $spacing-3
```

**Ejemplo en la interfaz:**
```
[HERO SECTION - H1]
"Repara. Colabora. Aprende."
Tamaño: 4.5rem | Peso: 800 | Color: Negro
Impacto visual máximo

[Subtítulo - H5]
"Arreglémoslo juntos."
Tamaño: 1.75rem | Peso: 400 | Color: Negro

[Párrafo - p]
Descripción del servicio
Tamaño: 1rem | Peso: 400 | Color: Gris-700
```

---

### 1.1.2 Contraste

**Principio:**
El contraste diferencia elementos y crea puntos focales. Se logra mediante color, tamaño, peso y espaciado.

**Aplicación en el proyecto:**

```
CONTRASTE DE COLOR
├── Primario vs Fondo: #659CCA (azul) sobre blanco (#fdfdfd) - Ratio 4.5:1
├── Secundario vs Blanco: #134672 (azul oscuro) sobre blanco - Ratio 7:1
├── Texto: Negro (#030303) sobre blanco - Ratio 21:1 (AAA)
└── Neutral: Grises (50-900) para contexto

CONTRASTE DE TAMAÑO
├── H1: 4.5rem vs Body: 1rem = Ratio 4.5x
├── H2: 4rem vs Body: 1rem = Ratio 4x
└── Caption: 0.75rem vs Body: 1rem = Ratio 0.75x

CONTRASTE DE PESO
├── Bold (700) vs Regular (400)
├── Semibold (600) vs Light (300)
└── Medium (500) para énfasis intermedio

CONTRASTE DE ESPACIADO
├── Cards: padding $spacing-6 (24px) = Espacios amplios
├── Componentes: gap $spacing-4 (16px) = Separación clara
└── Texto: margin-bottom $spacing-3 (12px) = Agrupación
```

---

### 1.1.3 Alineación

**Principio:**
La alineación crea orden y profesionalismo. Usamos múltiples estrategias según el contexto.

**Aplicación en el proyecto:**

```
ESTRATEGIA DE ALINEACIÓN
├── IZQUIERDA (Lectura natural)
│   └── Párrafos de texto
│   └── Listas con bullets
│   └── Navegación principal
│
├── CENTRO (Foco visual)
│   └── Títulos principales (H1)
│   └── Botones call-to-action
│   └── Formularios
│   └── Buscador principal
│
├── GRID (Organización)
│   └── Cards en grid 2, 3, 4 columnas
│   └── Galería de productos
│   └── Sistema 12-columnas
│
├── ESPACIADO EQUITATIVO (Balance)
│   └── space-between en navbars
│   └── space-around en grupos
│   └── space-evenly en elementos
│
└── RESPONSIVE
    └── Mobile: 1 columna (centered)
    └── Tablet: 2 columnas (left-aligned)
    └── Desktop: 3-4 columnas (grid-aligned)
```

**CSS Grid Utilities (ITCSS - 03-objects):**

```scss
.container {
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;  // Centra el contenedor
}

.grid--3 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: $spacing-4;  // Alineación consistente
}

.flex--between {
  display: flex;
  justify-content: space-between;  // Alineación de extremos
}
```

---

### 1.1.4 Proximidad

**Principio:**
Elementos relacionados se agrupan cerca; elementos no relacionados se separan. Esto crea orden visual.

**Aplicación en el proyecto:**

```
ESPACIADO SEMÁNTICO
├── Dentro de componentes: $spacing-2 a $spacing-3 (Tight = 8-12px)
├── Entre componentes: $spacing-4 a $spacing-6 (Medium = 16-24px)
└── Entre secciones: $spacing-8+ (Loose = 32px+)

VARIABLES DE ESPACIADO
$spacing-1: 0.25rem (4px)   - Espacios muy ajustados
$spacing-2: 0.5rem (8px)    - Espacios ajustados
$spacing-3: 0.75rem (12px)  - Espacios pequeños
$spacing-4: 1rem (16px)     - Espacios normales (default)
$spacing-6: 1.5rem (24px)   - Espacios amplios
$spacing-8: 2rem (32px)     - Espacios muy amplios
$spacing-12: 3rem (48px)    - Espacios seccionales
```

**Ejemplo HTML:**

```html
<!-- Proximidad ajustada dentro de card -->
<div class="card p-6">  <!-- Padding amplio del contenedor -->
  <h3 class="mb-2">Título</h3>  <!-- Pequeño margin-bottom -->
  <p class="mb-4">Descripción</p>  <!-- Medium margin-bottom -->
  <button class="mt-4">Botón</button>  <!-- Medium margin-top -->
</div>

<!-- Proximidad suelta entre cards -->
<div class="grid gap-6">  <!-- Gap amplio entre items -->
  <div class="card">...</div>
  <div class="card">...</div>
</div>
```

---

### 1.1.5 Repetición

**Principio:**
Repetir elementos visuales (colores, fuentes, formas) crea coherencia y refuerza la identidad.

**Aplicación en el proyecto:**

```
SISTEMA DE REPETICIÓN

1. PALETA DE COLORES CONSISTENTE
   ├── Primario: #659CCA (usado en botones, links, highlights)
   ├── Secundario: #134672 (usado en header, footer)
   ├── Acento: #CA681F (usado en énfasis, badges)
   └── Neutrales: Grises 50-900 (consistentes en toda la app)

2. TIPOGRAFÍA CONSISTENTE
   ├── Font-primary: Open Sans (utilizada en todo el proyecto)
   ├── H1: 4.5rem, bold → repetida en todas las páginas
   ├── H2: 4rem, bold → subtítulos consistentes
   ├── Body: 1rem, regular → párrafos uniformes
   └── Peso semibold (600): Énfasis en interfaz

3. PATRONES DE COMPONENTES
   ├── Botones: Siempre con padding $spacing-3 $spacing-4
   ├── Cards: Siempre con padding $spacing-6
   ├── Inputs: Siempre con border-radius $radius-md
   ├── Espaciado: Siempre en múltiplos de $spacing-4
   └── Sombras: Siempre $shadow-md, $shadow-lg, etc.

4. ESTADOS VISUALES
   ├── :hover → Cambio de color predecible
   ├── :focus → Outline azul consistente
   ├── :disabled → Opacidad 0.6 + cursor not-allowed
   └── :active → Color más intenso

5. ICONOGRAFÍA
   ├── Tamaño consistente: 16px, 24px, 32px
   ├── Color consistente: Heredan del texto o tema
   ├── Estilo consistente: Líneas delgadas (stroke 2px)
   └── Espacio consistente: gap $spacing-2 entre icono y texto
```

**Ejemplo de componentes repetidos:**

```html
<!-- Button repetido en toda la app -->
<button class="btn btn--primary">Enviar</button>
<button class="btn btn--secondary">Cancelar</button>

<!-- Card repetida en galería -->
<div class="grid grid--3">
  <div class="card">...</div>
  <div class="card">...</div>
  <div class="card">...</div>
</div>

<!-- Badge repetida en lista de etiquetas -->
<span class="badge badge--primary">Angular</span>
<span class="badge badge--primary">SCSS</span>
<span class="badge badge--primary">Responsive</span>
```

---

## 1.2 Metodología CSS: BEM (Block, Element, Modifier)

### ¿Por qué BEM?

**Razones de adopción:**

1. **Claridad**: El nombre de la clase describe exactamente qué es
2. **Escalabilidad**: Fácil agregar nuevas clases sin conflictos
3. **Reutilización**: Componentes modulares e independientes
4. **Mantenibilidad**: Cambios sin efectos secundarios inesperados
5. **Documentación**: Código autodocumentado

### Estructura BEM

```
BLOQUE: Componente independiente
└── ELEMENTO: Parte del bloque que depende del contexto
    └── MODIFICADOR: Variación del bloque o elemento
```

### Ejemplos en el proyecto:

```scss
// ========================================
// CARD - Bloque independiente
// ========================================

.card {
  // Bloque base
  background-color: white;
  border-radius: $radius-lg;
  box-shadow: $shadow-md;
  padding: $spacing-6;

  // Elemento: Título dentro de card
  &__title {
    font-size: $font-size-2xl;
    font-weight: $font-weight-bold;
    margin-bottom: $spacing-3;
  }

  // Elemento: Descripción dentro de card
  &__description {
    font-size: $font-size-base;
    color: $color-gray-600;
    margin-bottom: $spacing-4;
  }

  // Elemento: Botón dentro de card
  &__button {
    padding: $spacing-2 $spacing-4;
    background-color: $color-primary;
    color: white;
  }

  // Modificador: Card destacada
  &--featured {
    border: 2px solid $color-primary;
    box-shadow: $shadow-lg;
    background: linear-gradient(135deg, #f5f7fa, white);
  }

  // Modificador: Card compacta
  &--compact {
    padding: $spacing-4;
    
    .card__title {
      font-size: $font-size-lg;
    }
  }

  // Modificador: Card con hover
  &--interactive {
    cursor: pointer;
    @include transition(all);

    &:hover {
      box-shadow: $shadow-lg;
      transform: translateY(-2px);
    }
  }
}

// Uso en HTML:
/*
<div class="card card--featured">
  <h3 class="card__title">Título especial</h3>
  <p class="card__description">Descripción</p>
  <button class="card__button">Acción</button>
</div>

<div class="card card--compact card--interactive">
  <h4 class="card__title">Título compacto</h4>
  <p class="card__description">Descripción pequeña</p>
</div>
*/
```

### Más ejemplos BEM:

```scss

.c-footer {
  background-color: $color-secondary;
  color: $color-text-white;
  padding: $spacing-4 $spacing-6;

  // Elemento: Contenido
  &__content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
  }

  // Elemento: Navegación
  &__nav {
    display: flex;
    gap: $spacing-4;
  }

  // Elemento: Link
  &__link {
    color: $color-text-white;
    text-decoration: none;
    @include transition(color);

    &:hover {
      color: $color-accent;
    }
  }
}

.btn {
  // Bloque base
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-3 $spacing-4;
  background-color: $color-primary;
  color: $color-text-white;
  border: none;
  border-radius: $radius-md;
  cursor: pointer;
  @include transition(all);

  // Elemento: Icono dentro del botón
  &__icon {
    margin-right: $spacing-2;
    width: 20px;
    height: 20px;
  }

  // Modificador: Tamaño pequeño
  &--sm {
    padding: $spacing-2 $spacing-3;
    font-size: $font-size-sm;
  }

  // Modificador: Tamaño grande
  &--lg {
    padding: $spacing-4 $spacing-6;
    font-size: $font-size-lg;
  }

  // Modificador: Color secundario
  &--secondary {
    background-color: $color-secondary;

    &:hover {
      background-color: $color-secondary-hover;
    }
  }

  // Modificador: Deshabilitado
  &--disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  // Modificador: Ancho completo
  &--block {
    width: 100%;
  }
}
```

### Convención de nomenclatura BEM en el proyecto:

```
PREFIX__ELEMENT--MODIFIER

.c-header → Component Header
.c-footer → Component Footer
.c-button → Component Button
.p-home-hero → Page Home Hero

.c-header__logo → Elemento logo del header
.c-header__nav → Elemento nav del header
.c-button__icon → Elemento icon del button

.c-header--dark → Modificador dark
.c-button--primary → Modificador primary
.c-button--disabled → Modificador disabled
```

---

## 1.3 Organización de archivos: Arquitectura ITCSS

### ¿Qué es ITCSS?

**ITCSS** = Inverted Triangle CSS

Es una metodología que organiza archivos SCSS en orden creciente de especificidad:

```
        ▲
        │ (Especificidad alta)
        │
        ├── 6. Utilities (!)
        ├── 5. Components
        ├── 4. Elements
        ├── 3. Objects
        ├── 2. Generic
        ├── 1. Tools
        │
        ├── 0. Settings
        │
        ▼ (Especificidad baja)
```

### Por qué este orden es importante:

✅ **Evita conflictos CSS** - Las clases más específicas sobrescriben las genéricas
✅ **Fácil mantenimiento** - Cambios predecibles sin efectos secundarios
✅ **Escalabilidad** - Agregar nuevos estilos sin romper los existentes
✅ **Performance** - Especificidad baja = mejor rendering

### Árbol de carpetas completo:

```
src/styles/
│
├── 00-settings/
│   └── _variables.scss
│       ├── Colores (primary, secondary, accent, neutrales, semánticos)
│       ├── Tipografía (familias, pesos, tamaños, line-heights)
│       ├── Espaciado (escala de 4px)
│       ├── Breakpoints (sm, md, lg, xl, 2xl)
│       ├── Sombras (sm, md, lg, xl)
│       ├── Radios (sm, md, lg, full)
│       ├── Transiciones (fast, base, slow)
│       └── Easing functions (ease-in-out)
│
├── 01-tools/
│   └── _mixins.scss
│       ├── flex-center()         → Centra elementos con flexbox
│       ├── transition()          → Transiciones reutilizables
│       ├── media-query()         → Media queries simplificadas
│       ├── text-truncate()       → Truncado de texto
│       ├── button-base()         → Estilos base de botones
│       └── card()                → Contenedores con sombra
│
├── 02-generic/
│   ├── _reset.scss
│   │   ├── Reset universal (*, *::before, *::after)
│   │   ├── Normalización html, body
│   │   ├── Párrafos, headings, texto
│   │   ├── Links, listas, tablas
│   │   ├── Formularios (input, textarea, select)
│   │   ├── Multimedia (img, svg, video)
│   │   ├── Código (pre, code, kbd)
│   │   ├── Accesibilidad (.sr-only, :focus-visible)
│   │   └── Motion preferences (prefers-reduced-motion)
│   │
│   └── _typography.scss
│       ├── Importación Google Fonts (Open Sans)
│       ├── .heading-1 a .heading-6
│       ├── .body-text, .body-small, .body-xs
│       ├── .caption, .overline
│       └── Configuración de fuentes globales
│
├── 03-objects/
│   └── _layouts.scss
│       ├── .container (con variantes --fluid, --sm, --md, --lg, --xl, --2xl)
│       ├── .grid (responsivo --2, --3, --4, --6, --12)
│       ├── .grid-12 (sistema 12-columnas con .col-1 a .col-12)
│       ├── .flex (con variantes de alineación, dirección, wrap)
│       ├── .flex-item (grow, shrink, basis)
│       ├── .sidebar-layout, .two-column, .three-column
│       ├── .gap, .m, .mt, .mb, .ml, .mr, .mx, .my
│       ├── .p, .pt, .pb, .pl, .pr, .px, .py
│       └── Todas las clases de spacing con valores 0-8
│
├── 04-elements/
│   └── _base.scss
│       ├── Párrafos, headings (h1-h6)
│       ├── Listas (ul, ol, dl)
│       ├── Links con estados (:hover, :focus, :active)
│       ├── Blockquote, cite, código
│       ├── Tablas (thead, tbody, tfoot, th, td)
│       ├── Botones (button, .btn con variantes)
│       ├── Formularios (input, textarea, select, checkbox, radio, range)
│       ├── Imágenes, figura, figcaption
│       ├── Badges y líneas horizontales (hr)
│       └── Iconos base
│
├── 05-components/
│   ├── _header.scss
│   │   ├── header (background, padding, shadow)
│   │   ├── nav (flexbox, alineación)
│   │   ├── logo (tamaño, color)
│   │   └── responsivo
│   │
│   ├── _footer.scss
│   │   ├── footer (background, padding)
│   │   ├── .c-footer__content (grid responsive)
│   │   ├── .c-footer__nav (links con hover)
│   │   └── responsivo
│   │
│   └── _components.scss
│       ├── .card (con variantes --compact, --bordered, --featured)
│       ├── .modal (posicionamiento, animación)
│       ├── .alert (success, error, info)
│       ├── .pagination (navegación)
│       ├── .tooltip (flotante, posicionamiento)
│       ├── .spinner (animación de carga)
│       └── Otros componentes específicos
│
├── 06-utilities/
│   └── _utilities.scss
│       ├── .hidden, .invisible, .visible
│       ├── .text--* (align, bold, semibold, color, size, truncate)
│       ├── .d-* (display utilities)
│       ├── .flex--* (wrap, nowrap, gap)
│       ├── .border, .shadow, .opacity
│       ├── .transition, .transition--fast, .transition--slow
│       └── .hidden-sm, .hidden-md, .hidden-lg (responsive)
│
└── main.scss
    ├── Importa settings → tools → generic → objects → elements → components → utilities
    └── Orden CRÍTICO para cascada CSS
```

### Especificidad por capa:

```
LAYER              SELECTOR STRENGTH    EXAMPLES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Settings           N/A                  Variables, valores
Tools              N/A                  Mixins, funciones
Generic            1-2                  *, html, body
Objects            1                    .container, .grid
Elements           1                    h1, p, button
Components         1-2                  .card, .modal
Utilities          1-2 + !important     .hidden, .text--bold
```

### Importación en main.scss:

```scss
// Orden CRÍTICO - No cambiar
@use 'settings/variables' as *;           // Variables (especificidad 0)
@use '01-tools/mixins' as *;              // Mixins/funciones
@use '02-generic/reset' as *;             // Reset (especificidad baja)
@use '02-generic/typography' as *;        // Tipografía
@use '03-objects/layouts' as *;           // Layouts (sin clases específicas)
@use '04-elements/base' as *;             // Elementos HTML
@use '05-components/components' as *;     // Componentes
@use '05-components/header' as *;
@use '05-components/footer' as *;
@use '06-utilities/utilities' as *;       // Utilities (!important)
```

---

## 1.4 Sistema de Design Tokens

### ¿Qué son Design Tokens?

Design tokens son **valores de diseño reutilizables** que garantizan consistencia. En nuestro caso, son variables SCSS organizadas por categoría.

### 1.4.1 TOKENS DE COLOR

**Paleta de Colores:**

```scss
// Primarios
$color-primary: #659CCA;              // Azul claro - CTA, links, highlights
$color-primary-hover: #2A7DC3;        // Más intenso para hover
$color-primary-disabled: #83A6C3;     // Deshabilitado

// Secundarios
$color-secondary: #134672;            // Azul oscuro - Header, footer
$color-secondary-hover: #00315B;
$color-secondary-disabled: #1B64A3;

// Acentos
$color-accent: #CA681F;               // Naranja - Énfasis, warnings
$color-accent-hover: #D45D05;
$color-accent-disabled: #D78446;

// Semánticos
$color-success: #15CA31;              // Verde - Validación, éxito
$color-error: #EA1D1D;                // Rojo - Errores
$color-background: #EDE7CF;           // Beige - Fondo alternativo

// Neutrales
$color-text-white: #fdfdfd;           // Blanco puro
$color-text-black: #030303;           // Negro puro

// Escala de Grises
$color-gray-50:  #f9fafb;
$color-gray-100: #f3f4f6;
$color-gray-200: #e5e7eb;
$color-gray-300: #d1d5db;
$color-gray-400: #9ca3af;
$color-gray-500: #6b7280;
$color-gray-600: #4b5563;
$color-gray-700: #374151;
$color-gray-800: #1f2937;
$color-gray-900: #111827;
```

**¿Por qué estos colores?**

```
Primario (#659CCA):
  ✓ WCAG AA en contraste sobre blanco (ratio 4.5:1)
  ✓ Transmite confianza y profesionalismo (azul corporativo)
  ✓ Visible en móviles con poca luz
  ✓ No causa fatiga ocular (no es ni muy claro ni muy oscuro)

Secundario (#134672):
  ✓ Contraste AAA sobre blanco (ratio 7:1)
  ✓ Suficientemente oscuro para header/footer
  ✓ Diferenciable del primario
  ✓ Proyecta autoridad

Acentos (#CA681F - Naranja):
  ✓ Diferenciable de primario y secundario
  ✓ Atrae atención sin ser agresivo
  ✓ Comunica calidez y energía
  ✓ Ideal para CTAs secundarias

Grises (50-900):
  ✓ 10 tonos para máxima flexibilidad
  ✓ Coherentes entre sí (diferencia uniforme)
  ✓ Funcional para UI (borders, backgrounds, text secundario)
  ✓ Permiten jerarquía sin necesidad de colores adicionales
```

---

### 1.4.2 TOKENS DE TIPOGRAFÍA

**Familias de fuentes:**

```scss
$font-primary: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
$font-secondary: 'Open Sans', ...;  // Misma para consistencia
```

**¿Por qué Open Sans?**

```
✓ Google Font gratuita
✓ Altamente legible en pantalla (sans-serif)
✓ 10 pesos disponibles (300-900)
✓ Excelente soporte Unicode
✓ Performance: ~15KB comprimido
✓ Profesional y moderno
✓ Compatible con todos los navegadores
```

**Pesos tipográficos:**

```scss
$font-weight-light: 300;        // Para textos largo legibles
$font-weight-regular: 400;      // Body text, párrafos
$font-weight-medium: 500;       // Énfasis leve
$font-weight-semibold: 600;     // Subencabezados, énfasis
$font-weight-bold: 700;         // Headings, énfasis fuerte
```

**Tamaños tipográficos (escala 1.25):**

```scss
// Base: 1rem = 16px
// Ratio: 1.25 (cada nivel es 25% más grande)

$font-size-xs: 0.75rem;         // 12px - Captions, pequeño
$font-size-sm: 0.875rem;        // 14px - Body small
$font-size-base: 1rem;          // 16px - Body text (default)
$font-size-lg: 1.25rem;         // 20px - H6, large text
$font-size-xl: 1.563rem;        // 25px - H5, extra large
$font-size-2xl: 1.953rem;       // 31px - H4
$font-size-3xl: 2.441rem;       // 39px - H3
$font-size-4xl: 3.052rem;       // 49px - H2
$font-size-5xl: 4.5rem;         // 72px - H1
```

**¿Por qué escala 1.25?**

```
✓ Proporción visual armónica (conocida como "augmented fourth")
✓ Suficientemente pequeña para precisión
✓ Suficientemente grande para diferenciación
✓ Fácil de calcular mentalmente
✓ Usada por muchos sistemas de diseño profesionales
```

**Line heights:**

```scss
$line-height-tight: 1.1;        // Headings (compactos)
$line-height-normal: 1.5;       // Body text (legible)
$line-height-relaxed: 1.75;     // Párrafos largos (más aire)
```

---

### 1.4.3 TOKENS DE ESPACIADO

**Escala basada en 4px:**

```scss
// Base: 4px (1 unidad)
// Cada valor es múltiplo de 4

$spacing-1: 0.25rem;    // 4px
$spacing-2: 0.5rem;     // 8px
$spacing-3: 0.75rem;    // 12px
$spacing-4: 1rem;       // 16px (default)
$spacing-5: 1.25rem;    // 20px
$spacing-6: 1.5rem;     // 24px
$spacing-8: 2rem;       // 32px
$spacing-10: 2.5rem;    // 40px
$spacing-12: 3rem;      // 48px
$spacing-16: 4rem;      // 64px
$spacing-20: 5rem;      // 80px
$spacing-24: 6rem;      // 96px
```

**¿Por qué 4px?**

```
✓ Compatible con todos los dispositivos
✓ Suficientemente pequeño para precisión
✓ Suficientemente grande para claridad
✓ Estándar en Material Design, Bootstrap
✓ Múltiplos consistentes = cálculos fáciles
```

**Uso semántico del espaciado:**

```
DENTRO DE COMPONENTES (Tight):
  margin entre párrafos: $spacing-2 (8px)
  padding en botones: $spacing-2 $spacing-3 (8px 12px)
  gap en listas: $spacing-2 (8px)

ENTRE COMPONENTES (Medium):
  margin entre cards: $spacing-4 (16px)
  gap en grids: $spacing-4 (16px)
  padding en containers: $spacing-4 (16px)

ENTRE SECCIONES (Loose):
  margin entre secciones: $spacing-8 (32px)
  padding de secciones: $spacing-6 a $spacing-8
  gap en layouts: $spacing-6 (24px)
```

---

### 1.4.4 TOKENS DE BREAKPOINTS (RESPONSIVE)

**Puntos de quiebre:**

```scss
$breakpoint-sm: 640px;    // Móviles grandes
$breakpoint-md: 768px;    // Tablets
$breakpoint-lg: 1024px;   // Desktops
$breakpoint-xl: 1280px;   // Desktops grandes
$breakpoint-2xl: 1536px;  // Pantallas ultraamplias
```

**¿Por qué estos breakpoints?**

```
640px (sm):
  ✓ iPhone 12 Pro Max: 428px
  ✓ Galaxy S21: 400px
  ✓ Deja margen para diferenciación móvil

768px (md):
  ✓ iPad Mini: 768px (portrait)
  ✓ Tabletas pequeñas
  ✓ Cambia a 2 columnas

1024px (lg):
  ✓ iPad: 1024px (landscape)
  ✓ Laptops pequeñas
  ✓ 3+ columnas, layouts complejos

1280px (xl):
  ✓ Desktops estándar (1366 native)
  ✓ Máximo ancho del contenedor
  ✓ Layouts completos

1536px (2xl):
  ✓ Pantallas 4K
  ✓ Monitores ultraamplios
```

**Estrategia Mobile-First:**

```scss
// Empezamos con móvil (sin media query)
.grid {
  grid-template-columns: 1fr;  // 1 columna en móvil
}

// Luego agregamos para pantallas mayores
@include media-query('md') {
  grid-template-columns: 2fr 1fr;  // 2 columnas en tablet
}

@include media-query('lg') {
  grid-template-columns: 3fr 1fr;  // 3 columnas en desktop
}
```

---

### 1.4.5 TOKENS DE SOMBRAS (ELEVATION)

**Sistema de sombras:**

```scss
$shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
$shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
$shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
$shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15);
$shadow-2xl: 0 25px 50px rgba(0, 0, 0, 0.25);
```

**¿Por qué este sistema?**

```
Sombra suave (sm):
  ✓ Sutil, no invasiva
  ✓ Para elementos que necesitan poco énfasis
  ✓ Ejemplo: bordes de inputs

Sombra media (md) - DEFAULT:
  ✓ Cards normales
  ✓ Dropdowns
  ✓ Moderada elevación

Sombra grande (lg):
  ✓ Modales
  ✓ Cards destacadas
  ✓ Componentes importantes

Sombra muy grande (xl, 2xl):
  ✓ Modales principales
  ✓ Popups
  ✓ Máxima elevación visual

Uso de RGBA:
  ✓ Funciona en cualquier color de fondo
  ✓ Transparencia natural
  ✓ Mejor que hex o sólidos
```

---

### 1.4.6 TOKENS DE BORDES Y RADIOS

**Grosores de borde:**

```scss
$border-thin: 1px;      // Bordes sutiles
$border-medium: 2px;    // Bordes normales
$border-thick: 4px;     // Bordes destacados
```

**Radios de esquina:**

```scss
$radius-sm: 2px;        // Casi cuadrado
$radius-md: 4px;        // Default (inputs)
$radius-lg: 8px;        // Cards, buttons
$radius-xl: 12px;       // Componentes grandes
$radius-full: 9999px;   // Círculos, pills
```

---

### 1.4.7 TOKENS DE TRANSICIONES

**Duraciones:**

```scss
$transition-fast: 150ms;    // Cambios rápidos (button hover)
$transition-base: 300ms;    // Default (la mayoría)
$transition-slow: 500ms;    // Transiciones complejas

// Función de easing
$easing-ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

---

## 1.5 Mixins y funciones SCSS

### Mixin 1: flex-center()

**Propósito:** Centrar elementos usando flexbox

```scss
@mixin flex-center($direction: row, $justify: center, $align: center) {
  display: flex;
  flex-direction: $direction;
  justify-content: $justify;
  align-items: $align;
}
```

**Ejemplos de uso:**

```scss
// Centrar horizontalmente
.centered-horizontal {
  @include flex-center(row, center, flex-start);
  // Resultado: flex con contenido centrado horizontalmente
}

// Centrar verticalmente
.centered-vertical {
  @include flex-center(column, flex-start, center);
  // Resultado: flex column con contenido centrado verticalmente
}

// Centrar completamente
.centered {
  @include flex-center();
  // Resultado: flex, contenido perfectamente centrado
}

// Distribuido espaciado
.distributed {
  @include flex-center(row, space-between);
  // Resultado: flex con items en extremos
}
```

---

### Mixin 2: transition()

**Propósito:** Crear transiciones suaves reutilizables

```scss
@mixin transition($properties: all, $duration: $transition-base, $easing: $easing-ease-in-out) {
  transition: $properties $duration $easing;
}
```

**Ejemplos de uso:**

```scss
// Transición de todos los atributos
.button {
  @include transition();
  // Resultado: transition: all 300ms cubic-bezier(...)
}

// Transición solo de color
.link {
  @include transition(color);
  // Resultado: transition: color 300ms cubic-bezier(...)
}

// Transición rápida
.hover-effect {
  @include transition(transform, $transition-fast);
  // Resultado: transition: transform 150ms cubic-bezier(...)
}

// Transición lenta para animación compleja
.modal {
  @include transition(all, $transition-slow);
  // Resultado: transition: all 500ms cubic-bezier(...)
}
```

---

### Mixin 3: media-query()

**Propósito:** Simplificar media queries responsivas

```scss
@mixin media-query($breakpoint) {
  @if $breakpoint == 'sm' {
    @media (min-width: $breakpoint-sm) { @content; }
  } @else if $breakpoint == 'md' {
    @media (min-width: $breakpoint-md) { @content; }
  } @else if $breakpoint == 'lg' {
    @media (min-width: $breakpoint-lg) { @content; }
  } @else if $breakpoint == 'xl' {
    @media (min-width: $breakpoint-xl) { @content; }
  }
}
```

**Ejemplos de uso:**

```scss
// Responsive design
.grid {
  grid-template-columns: 1fr;  // Mobile

  @include media-query('md') {
    grid-template-columns: repeat(2, 1fr);
  }

  @include media-query('lg') {
    grid-template-columns: repeat(3, 1fr);
  }
}

// Cambiar padding responsivamente
.container {
  padding: $spacing-3;

  @include media-query('md') {
    padding: $spacing-4;
  }

  @include media-query('lg') {
    padding: $spacing-6;
  }
}
```

---

### Mixin 4: text-truncate()

**Propósito:** Truncar texto con elipsis (una o múltiples líneas)

```scss
@mixin text-truncate($lines: 1) {
  @if $lines == 1 {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  } @else {
    display: -webkit-box;
    -webkit-line-clamp: $lines;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}
```

**Ejemplos de uso:**

```scss
// Una línea
.title {
  @include text-truncate();
  // Resultado: "Este es un texto muy largo..." (truncado con elipsis)
}

// Tres líneas
.description {
  @include text-truncate(3);
  // Resultado: 3 líneas máximo, luego elipsis
}

// Dos líneas
.preview {
  @include text-truncate(2);
  // Resultado: 2 líneas máximo
}
```

---

### Mixin 5: button-base()

**Propósito:** Estilos base reutilizables para botones

```scss
@mixin button-base($bg-color: $color-primary, $text-color: $color-text-white, $padding: $spacing-3 $spacing-4, $radius: $radius-md) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: $padding;
  background-color: $bg-color;
  color: $text-color;
  border: none;
  border-radius: $radius;
  font-family: $font-primary;
  font-weight: $font-weight-medium;
  cursor: pointer;
  @include transition(all);

  &:hover {
    transform: translateY(-2px);
    box-shadow: $shadow-md;
  }

  &:active {
    transform: translateY(0);
    box-shadow: $shadow-sm;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
}
```

**Ejemplos de uso:**

```scss
// Botón primario
.btn--primary {
  @include button-base();
  // Colores y estilos por defecto
}

// Botón secundario
.btn--secondary {
  @include button-base($color-secondary, $color-text-white);
  // Mismo tamaño, color diferente
}

// Botón pequeño
.btn--small {
  @include button-base($color-primary, $color-text-white, $spacing-2 $spacing-3);
  // Padding más pequeño
}

// Botón grande
.btn--large {
  @include button-base($color-primary, $color-text-white, $spacing-4 $spacing-6);
  // Padding más grande
}
```

---

### Mixin 6: card()

**Propósito:** Estilizar contenedores con sombra y bordes

```scss
@mixin card($shadow: $shadow-md, $radius: $radius-lg, $bg-color: $color-text-white) {
  background-color: $bg-color;
  border-radius: $radius;
  box-shadow: $shadow;
  @include transition(box-shadow);
}
```

**Ejemplos de uso:**

```scss
// Card normal
.card {
  @include card();
  padding: $spacing-6;
  // Fondo blanco, shadow-md, radius-lg
}

// Card con sombra más grande
.card--featured {
  @include card($shadow-lg);
  padding: $spacing-6;
  // Más elevación visual
}

// Card con fondo diferente
.card--dark {
  @include card($shadow-md, $radius-lg, $color-gray-900);
  padding: $spacing-6;
  color: $color-text-white;
  // Fondo oscuro
}
```

---

## 1.6 ViewEncapsulation en Angular

### ¿Qué es ViewEncapsulation?

**ViewEncapsulation** es una estrategia de Angular que controla cómo se aplican los estilos de un componente:

```
┌──────────────────────────────────────────┐
│ Angular ViewEncapsulation Strategies     │
├──────────────────────────────────────────┤
│                                          │
│ 1. Emulated (DEFAULT)                   │
│    └─ Estilos encapsulados por componente
│    └─ No afectan otros componentes     │
│    └─ Otros estilos no afectan aquí    │
│                                          │
│ 2. None                                  │
│    └─ Estilos globales                  │
│    └─ Afectan toda la aplicación       │
│    └─ Angular no aisla nada             │
│                                          │
│ 3. ShadowDom                             │
│    └─ Encapsulación real con Shadow DOM │
│    └─ No soportado en todos los navegadores
│                                          │
└──────────────────────────────────────────┘
```

---

### Decisión: EMULATED (con style.scss global)

**Estrategia elegida:** Emulated (por defecto) + archivo SCSS global

**Justificación:**

```
✓ Mejor rendimiento
  └─ Cada componente gestiona sus estilos
  └─ Sin re-cálculos globales frecuentes

✓ Modularidad
  └─ Componentes independientes y reutilizables
  └─ Cambios en un componente no afectan otros

✓ Mantenibilidad
  └─ Estilos cerca del componente
  └─ Fácil entender qué afecta qué

✓ Escalabilidad
  └─ Agregar nuevos componentes sin conflictos
  └─ Equipos pueden trabajar en paralelo

✓ Debugging
  └─ DevTools muestra claramente qué estilos aplican
  └─ Menos sorpresas con cascada CSS
```

---

### Configuración del Proyecto:

```typescript
// app.component.ts
import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.Emulated  // Default
})
export class AppComponent {
  title = 'Proyecto Intermodular';
}

// card.component.ts
@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  encapsulation: ViewEncapsulation.Emulated  // Estilos encapsulados
})
export class CardComponent {
  @Input() title: string;
  @Input() description: string;
}
```

---

### Estructura de estilos:

```
src/
├── styles/
│   ├── main.scss               ← GLOBAL (importa ITCSS)
│   ├── 00-settings/
│   ├── 01-tools/
│   ├── 02-generic/
│   ├── 03-objects/
│   ├── 04-elements/
│   ├── 05-components/
│   └── 06-utilities/
│
└── app/
    ├── app.component.scss      ← Para app-root
    └── layout/
        ├── header/
        │   └── header.component.scss    ← Estilos encapsulados
        ├── footer/
        │   └── footer.component.scss    ← Estilos encapsulados
        └── ...
```

---

### Cómo Angular implementa Emulated:

```html
<!-- En el navegador, Angular agrega atributos únicos: -->

<!-- Original -->
<app-card [title]="'Mi Tarjeta'"></app-card>

<!-- Renderizado por Angular -->
<app-card _ngcontent-ng-c123456="">
  <div _ngcontent-ng-c123456="" class="card">
    <h3 _ngcontent-ng-c123456="">Mi Tarjeta</h3>
  </div>
</app-card>

<!-- CSS compilado con atributos -->
.card[_ngcontent-ng-c123456] {
  padding: 24px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}
```

**Beneficio:** Los estilos `.card` solo aplican dentro de `app-card`, no globalmente.

---

### Uso de estilos globales cuando sea necesario:

```typescript
// Para estilos globales que SÍ necesitamos (reset, tipografía global):

// angular.json
{
  "projects": {
    "frontend": {
      "architect": {
        "build": {
          "options": {
            "styles": [
              "src/styles.scss"    ← Compilado globalmente ANTES que los componentes
            ]
          }
        }
      }
    }
  }
}
```

**Orden de aplicación:**

```
1. src/styles.scss           ← Global (reset, tipografía, variables)
2. Component 1 styles        ← Encapsulado (card.component.scss)
3. Component 2 styles        ← Encapsulado (header.component.scss)
4. Utilities (final)          ← Más especificidad
```

---

## Resumen de la Arquitectura

```
┌──────────────────────────────────────────────────┐
│ ARQUITECTURA CSS - PROYECTO INTERMODULAR        │
├──────────────────────────────────────────────────┤
│                                                  │
│ Principios Visuales: 5 principios aplicados    │
│   └─ Jerarquía, Contraste, Alineación, etc.   │
│                                                  │
│ Metodología: BEM (Block, Element, Modifier)    │
│   └─ Nomenclatura clara y escalable            │
│                                                  │
│ Organización: ITCSS (6 capas)                  │
│   └─ Especificidad creciente                   │
│                                                  │
│ Design Tokens: Variables SCSS                  │
│   └─ Colores, tipografía, espaciado, etc.    │
│                                                  │
│ Mixins: 6 funciones reutilizables             │
│   └─ flex-center, transition, media-query...  │
│                                                  │
│ Encapsulación: Emulated + Global              │
│   └─ Modular y mantenible                     │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

# 2. HTML Semántico y Estructura

## 2.1 Elementos Semánticos Utilizados

**Principio:**
El HTML semántico proporciona significado al contenido, mejorando accesibilidad, SEO y mantenibilidad del código.

### Elementos Semánticos en el Proyecto

```
ESTRUCTURA PRINCIPAL
├── <header> - Encabezado del sitio/sección
├── <nav>    - Navegación principal
├── <main>   - Contenido principal
├── <section> - Secciones temáticas
├── <article> - Contenido independiente
├── <aside>   - Contenido relacionado
└── <footer> - Pie de página

DENTRO DE CONTENIDO
├── <h1>...<h6> - Títulos jerárquicos
├── <p>         - Párrafos
├── <ul>, <ol>  - Listas
├── <form>      - Formularios
├── <fieldset>  - Agrupación de campos
├── <legend>    - Descripción de fieldset
└── <label>     - Etiquetas de inputs
```

### Ejemplo 1: Estructura de Página (Header)

**Ubicación:** `src/app/layout/header/header.component.html`

```html
<!-- Elemento semántico: <header> -->
<!-- Define el encabezado principal de la aplicación -->
<header class="c-header">
    <!-- Logo con enlace semántico a inicio -->
    <a routerLink="/" class="c-header__logo" title="Volver a inicio">
        <i class="fas fa-tools" aria-hidden="true"></i>
        <span>ReparaFácil</span>
    </a>

    <!-- Botón de acceso a perfil/login -->
    <a routerLink="/login" class="c-header__user-btn" title="Ir a iniciar sesión">
        <img class="c-header__user-btn_img" 
             src="assets/icons/UsuarioBlanco.png" 
             alt="Perfil de usuario">
    </a>
</header>
```

**Ventajas:**
-  `<header>` define claramente que es el encabezado principal
-  `<a>` con `routerLink` para navegación semántica
-  `alt` descriptivo en imagen
-  `aria-hidden="true"` en icono puramente decorativo
-  `title` para contexto adicional

### Ejemplo 2: Estructura de Pie de Página (Footer)

**Ubicación:** `src/app/layout/footer/footer.component.html`

```html
<!-- Elemento semántico: <footer> -->
<!-- Define el pie de página del sitio -->
<footer class="c-footer">
  <div class="c-footer__content">
    <!-- Párrafo con información de copyright -->
    <p>&copy; 2025 ReparaFácil. Todos los derechos reservados.</p>
    
    <!-- Elemento semántico: <nav> -->
    <!-- Define navegación secundaria en pie de página -->
    <nav class="c-footer__nav">
      <a href="#" title="Ver términos de servicio">Términos de servicio</a>
      <a href="#" title="Ver política de privacidad">Política de privacidad</a>
      <a href="#" title="Contactar con nosotros">Contacto</a>
    </nav>
  </div>
</footer>
```

**Ventajas:**
-  `<footer>` marca claramente el pie de página
-  `<nav>` dentro de footer define navegación secundaria
-  Enlaces con `title` descriptivo
-  Estructura lógica y accesible

### Ejemplo 3: Página de Inicio (Main + Section)

**Ubicación:** `src/pages/home/home.component.html`

```html
<!-- Elemento semántico: <main> -->
<!-- Contenido principal único de la página -->
<main class="p-home-hero">
  <!-- Elemento semántico: <section> -->
  <!-- Sección temática: Hero con búsqueda -->
  <section class="p-home-hero__section">
    <!-- Contenedor de texto -->
    <div class="p-home-hero__text-container">
      <h1 class="p-home-hero__title-line-1">Repara.</h1>
      <h1 class="p-home-hero__title-line-1">Colabora.</h1>
      <h5 class="p-home-hero__subtitle">Arreglémoslo juntos.</h5>
    </div>

    <!-- Caja de búsqueda -->
    <div class="p-home-hero__search-box">
      <input type="search" placeholder="Busca una reparación..." />
      <button type="submit" title="Buscar">
        <img src="assets/icons/buscar.png" alt="Buscar">
      </button>
    </div>
  </section>
</main>
```

**Ventajas:**
-  `<main>` contiene el contenido principal
-  `<section>` agrupa contenido temático relacionado
-  `<h1>` para título principal de la página
-  `<h5>` para subtítulo (siguiendo jerarquía)

---

## 2.2 Jerarquía de Headings

**Regla Principal:** 
-  **UN SOLO `<h1>` por página**
-  `<h2>` para secciones principales
-  `<h3>` para subsecciones

### Diagrama de Jerarquía

```
PÁGINA DE HOME
├── <h1> "Repara. Colabora. Aprende." (Único en la página)
│   ├── <h5> "Arreglémoslo juntos." (Subtítulo)
│   └── <input type="search"> (Búsqueda)
│
├── <section> "Servicios"
│   ├── <h2> "Nuestros Servicios" (Sección principal)
│   ├── <article> "Servicio 1"
│   │   └── <h3> "Reparaciones técnicas" (Subsección)
│   ├── <article> "Servicio 2"
│   │   └── <h3> "Asesoramiento" (Subsección)
│   └── <article> "Servicio 3"
│       └── <h3> "Capacitación" (Subsección)
│
└── <section> "Testimonios"
    ├── <h2> "Lo que dicen nuestros usuarios" (Sección principal)
    ├── <article> "Testimonio 1"
    │   └── <h3> "Juan García" (Nombre - subsección)
    └── <article> "Testimonio 2"
        └── <h3> "María López" (Nombre - subsección)
```

### Diagrama de Jerarquía (Página de Login)

```
PÁGINA DE LOGIN
├── <h1> "Inicia sesión" (Único en la página)
│   └── <p> "Accede a tu cuenta de ReparaFácil" (Descripción)
│
└── <form> "Formulario de login"
    ├── <fieldset>
    │   ├── <legend> "Credenciales de acceso" (Agrupa campos)
    │   ├── <label> "Correo electrónico"
    │   │   └── <input type="email">
    │   ├── <label> "Contraseña"
    │   └── <input type="password">
    ├── <button type="submit"> "Inicia sesión"
    └── <p> "¿No tienes cuenta? <a>Regístrate aquí</a>"
```

**Análisis de Niveles:**
```
Nivel 1: h1 (Título único)
Nivel 2: h2 (Secciones principales)
Nivel 3: h3 (Subsecciones)
Nivel 4: h4 (Si es necesario subir detalles)
```

**Regla de No-Skip:**
```
INCORRECTO: h1 → h3 (salta h2)
├── <h1> Título principal
├── <h3> Subtítulo (¡SALTO!)
└── <h4> Detalle

CORRECTO: h1 → h2 → h3
├── <h1> Título principal
├── <h2> Sección principal
├── <h3> Subsección
└── <h2> Otra sección principal
```

---

## 2.3 Estructura de Formularios

**Principio:**
Los formularios deben ser accesibles, semánticos y fáciles de usar. Usamos `<fieldset>`, `<legend>`, y asociaciones correctas de `<label>` con `<input>`.

### Estrategia de Formularios

```
COMPONENTES UTILIZADOS
├── <form>         - Contenedor del formulario
├── <fieldset>     - Agrupa campos relacionados
├── <legend>       - Describe el fieldset
├── <label>        - Etiqueta de input
├── <input>        - Campo de entrada
├── <app-form-input> - Componente reutilizable
└── <button type="submit"> - Botón de envío
```

### Ejemplo 1: Componente app-form-input

**Ubicación:** `src/app/components/shared/form-input/form-input.component.html`

```html
<!-- Contenedor del campo de input -->
<div class="form-input">
  <!-- LABEL: Asociado al input mediante el atributo 'for' -->
  <!-- Esto mejora la accesibilidad (aumenta área clickeable) -->
  <label *ngIf="label" [for]="id" class="form-input__label">
    {{ label }}
    <!-- Asterisco para indicar campo requerido -->
    <span *ngIf="required" class="form-input__required">*</span>
  </label>

  <!-- WRAPPER: Contenedor flexible para inputs con toggle -->
  <div class="form-input__wrapper" [class.form-input__wrapper--password]="showPasswordToggle">
    <!-- INPUT: Campo de entrada -->
    <!-- Atributos accesibles:
         - [id]: Asociado al label mediante 'for'
         - [type]: Dinámico (text, email, password, etc.)
         - [required]: Indica campo obligatorio
         - [value]: Valor actual del campo
         - (input): Evento de captura de cambios
         - (blur): Evento cuando pierde el foco
    -->
    <input
      [id]="id"
      [type]="currentType"
      [name]="name"
      [placeholder]="placeholder"
      [required]="required"
      [value]="value"
      class="form-input__input"
      [class.form-input__input--error]="errorMessage"
      [class.form-input__input--has-toggle]="showPasswordToggle"
      (input)="onInput($event)"
      (blur)="onBlur()"
    />

    <!-- TOGGLE DE CONTRASEÑA: Botón para mostrar/ocultar -->
    <!-- Solo se muestra si showPasswordToggle es true -->
    <button
      *ngIf="showPasswordToggle"
      type="button"
      class="form-input__toggle"
      (click)="togglePasswordVisibility()"
      [title]="passwordVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'"
      aria-label="Toggle password visibility"
    >
      <i [class]="passwordVisible ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
    </button>
  </div>

  <!-- MENSAJE DE ERROR: Se muestra cuando hay validación -->
  <span *ngIf="errorMessage" class="form-input__error">
    {{ errorMessage }}
  </span>

  <!-- TEXTO DE AYUDA: Información adicional (no se muestra si hay error) -->
  <span *ngIf="helpText && !errorMessage" class="form-input__help">
    {{ helpText }}
  </span>
</div>
```

**Características Accesibles:**
- `<label>` con `[for]` e `id` asociado al input
- `[id]` único generado automáticamente si no se proporciona
- `aria-label` en botón de toggle
- `[required]` para indicar campos obligatorios
- Mensajes de error descriptivos
- Control de validación integrado

### Ejemplo 2: Formulario de Login Completo

**Ubicación:** `src/app/components/shared/login-form/login-form.component.html`

```html
<div class="login-form">
  <!-- Encabezado del formulario -->
  <div class="login-form__header">
    <h1 class="login-form__title">{{ title }}</h1>
    <p class="login-form__subtitle">{{ subtitle }}</p>
  </div>

  <!-- FORMULARIO: Elemento semántico <form> -->
  <!-- [formGroup]: Vinculación a FormGroup de Angular
       (ngSubmit): Evento de envío
  -->
  <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form__form">

    <!-- FIELDSET: Agrupa campos relacionados -->
    <!-- Mejora la semántica y accesibilidad -->
    <fieldset class="login-form__fieldset">
      <!-- LEGEND: Describe el propósito del fieldset -->
      <!-- Leído por lectores de pantalla para contexto -->
      <legend class="login-form__legend">Credenciales de acceso</legend>

      <!-- EMAIL INPUT: Usando componente reutilizable app-form-input -->
      <!-- Propiedades:
           - id: Identificador único
           - type="email": Validación de email nativa
           - label: Etiqueta visible
           - placeholder: Texto de ayuda
           - [required]: Indica campo obligatorio
           - formControlName: Vinculación a FormGroup
           - [errorMessage]: Validación desde TypeScript
      -->
      <app-form-input
        id="email"
        type="email"
        name="email"
        label="Correo electrónico"
        placeholder="tu@email.com"
        [required]="true"
        formControlName="email"
        [errorMessage]="submitted && email?.invalid ? 
          (email?.errors?.['required'] ? 'Por favor ingresa un email' : 'Email inválido') : ''"
      ></app-form-input>

      <!-- PASSWORD INPUT: Con toggle de visibilidad -->
      <!-- Propiedades adicionales:
           - [showPasswordToggle]=true: Activa botón de mostrar/ocultar
           - currentType: Cambia dinámicamente entre 'password' y 'text'
      -->
      <app-form-input
        id="password"
        type="password"
        name="password"
        label="Contraseña"
        placeholder="Mínimo 6 caracteres"
        [required]="true"
        [showPasswordToggle]="true"
        formControlName="password"
        [errorMessage]="submitted && password?.invalid ? 
          (password?.errors?.['required'] ? 'Por favor ingresa una contraseña' : 'Mínimo 6 caracteres') : ''"
      ></app-form-input>
    </fieldset>

    <!-- BOTÓN SUBMIT: Envío del formulario -->
    <!-- Atributos accesibles:
         - type="submit": Envía el formulario
         - [disabled]: Se deshabilita si hay errores o está cargando
         - [attr.aria-busy]: Indica estado de carga para lectores de pantalla
    -->
    <button
      type="submit"
      class="login-form__submit"
      [disabled]="loading || (submitted && loginForm.invalid)"
      [attr.aria-busy]="loading"
    >
      <span *ngIf="!loading">{{ submitButtonText }}</span>
      <span *ngIf="loading">
        <i class="fas fa-spinner fa-spin"></i> Cargando...
      </span>
    </button>

    <!-- LINK DE REGISTRO: Navegación a página de registro -->
    <p class="login-form__footer">
      <a routerLink="/register" class="login-form__link">{{ registerLinkText }}</a>
    </p>
  </form>
</div>
```

**Estructura Semántica:**
```
<form> ─ Contenedor del formulario
  ├─ <h1> ─ Título principal
  ├─ <p> ─ Subtítulo/descripción
  │
  └─ <fieldset> ─ Agrupa campos relacionados
      ├─ <legend> ─ "Credenciales de acceso"
      ├─ <app-form-input> (Email)
      │   └─ <label>, <input>, <span error>
      ├─ <app-form-input> (Password)
      │   └─ <label>, <input>, <button toggle>, <span error>
      │
      ├─ <button type="submit">
      └─ <p><a> ─ Link a registro
```

### Validación y Accesibilidad en Formularios

```
VALIDACIÓN
├── Validación HTML5 (required, type="email")
├── Validación Angular (Validators.required, Validators.email)
├── Validación Custom (minLength, pattern)
└── Mensajes de error descriptivos

ACCESIBILIDAD
├── <label> asociados con [for] e [id]
├── [required] para campos obligatorios
├── aria-label en botones sin texto
├── aria-busy en estados de carga
├── Mensajes de error descriptivos
└── Contraste de colores en errores
```

**Ejemplo de Validación en Componente:**

```typescript
// login-form.component.ts
export class LoginFormComponent {
  loginForm: FormGroup;
  submitted = false;

  constructor(private formBuilder: FormBuilder) {
    // Crear FormGroup con validadores
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // Getters para acceso fácil en template
  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  // Envío del formulario
  onSubmit() {
    this.submitted = true;

    if (this.loginForm.valid) {
      // Procesar datos válidos
      this.formSubmit.emit(this.loginForm.value);
    }
  }
}
```

---

# 3. Sistema de Componentes UI

## 3.1 Componentes Implementados

### 3.1.1 Button Component (`app-button`)

**Propósito:** Elemento interactivo reutilizable para todas las acciones del usuario.

**Ubicación:** `src/app/components/shared/button/`

**Variantes Disponibles:**
```
- primary    → Color azul (#659CCA), fondo sólido
- secondary  → Color azul oscuro (#134672)
- ghost      → Solo borde, sin fondo
- danger     → Color rojo (#EA1D1D) para acciones destructivas
```

**Tamaños Disponibles:**
```
- sm (small)   → padding: 8px 12px, font-size: 14px
- md (medium)  → padding: 12px 16px, font-size: 16px (DEFAULT)
- lg (large)   → padding: 16px 24px, font-size: 20px
```

**Estados que Maneja:**
```
- Normal         → Estilo base
- Hover          → Elevación (+4px), sombra aumentada
- Focus          → Outline azul (accesibilidad)
- Active         → Presión visual (translateY 0)
- Disabled       → Opacidad 0.6, cursor not-allowed
- Loading        → Spinner animado + contenido oculto
- Full Width     → 100% del ancho del contenedor
```

**Nomenclatura BEM:**
```scss
.button                      // Bloque
├── .button--primary         // Modificador: variante
├── .button--secondary
├── .button--ghost
├── .button--danger
├── .button--sm              // Modificador: tamaño
├── .button--md
├── .button--lg
├── .button--disabled        // Modificador: estado
├── .button--loading
├── .button--block           // Modificador: full width
└── .button__content         // Elemento: contenido
    └── .button__content--hidden
└── .button__spinner         // Elemento: spinner de carga
```

**Ejemplo de Uso:**

```html
<!-- Button primario básico -->
<app-button variant="primary">Enviar</app-button>

<!-- Button secundario grande con full width -->
<app-button
  variant="secondary"
  size="lg"
  [fullWidth]="true">
  Cancelar
</app-button>

<!-- Button peligroso, deshabilitado -->
<app-button
  variant="danger"
  size="sm"
  [disabled]="true">
  Eliminar
</app-button>

<!-- Button con estado de carga -->
<app-button
  variant="primary"
  [loading]="isLoading">
  Guardando...
</app-button>

<!-- Button ghost en tamaño pequeño -->
<app-button
  variant="ghost"
  size="sm">
  Ver más
</app-button>
```

**Componente TypeScript:**

```typescript
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() disabled: boolean = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() fullWidth: boolean = false;
  @Input() loading: boolean = false;
  @Input() ariaLabel: string = '';

  get buttonClasses(): string {
    const classes = ['button'];
    classes.push(`button--${this.variant}`);
    classes.push(`button--${this.size}`);
    if (this.disabled) classes.push('button--disabled');
    if (this.fullWidth) classes.push('button--block');
    if (this.loading) classes.push('button--loading');
    return classes.join(' ');
  }
}
```

---

### 3.1.2 Card Component (`app-card`)

**Propósito:** Contenedor visual para agrupar contenido relacionado. Base de galerías, listas y layouts.

**Ubicación:** `src/app/components/shared/card/`

**Variantes Disponibles:**
```
- basic      → Imagen en la parte superior (por defecto)
- horizontal → Imagen a la izquierda, contenido a la derecha
```

**Tamaños Disponibles:**
```
- No tiene tamaños predefinidos (se adapta al contenedor)
- Imagen: altura fija 200px (basic), ancho fijo 30% (horizontal)
- Padding: 24px (editable con CSS)
```

**Estados que Maneja:**
```
- Normal         → Sombra suave ($shadow-md)
- Interactive    → Hover: elevación (+4px), sombra aumentada, zoom imagen
- Con imagen     → Validación automática con hasImage
- Sin imagen     → Solo contenido (título, descripción)
```

**Nomenclatura BEM:**
```scss
.card                          // Bloque
├── .card--basic              // Modificador: variante
├── .card--horizontal
├── .card--interactive        // Modificador: estado
├── .card__image              // Elemento: contenedor imagen (básica)
├── .card__image-element      // Elemento: etiqueta img
├── .card__image-side         // Elemento: contenedor imagen (horizontal)
├── .card__content            // Elemento: contenedor contenido (básica)
├── .card__content-side       // Elemento: contenedor contenido (horizontal)
├── .card__title              // Elemento: título
├── .card__description        // Elemento: descripción
└── .card__action             // Elemento: botón de acción
```

**Ejemplo de Uso:**

```html
<!-- Card básica con imagen -->
<app-card
  variant="basic"
  title="Reparación de Laptop"
  description="Servicio profesional de reparación para laptops de cualquier marca."
  imageSrc="assets/images/laptop-repair.jpg"
  imageAlt="Técnico reparando laptop"
  [interactive]="true"
></app-card>

<!-- Card horizontal con imagen -->
<app-card
  variant="horizontal"
  title="Taller de Electrónica"
  description="Aprende a reparar dispositivos electrónicos básicos en 4 horas."
  imageSrc="assets/images/electronics-workshop.jpg"
  imageAlt="Materiales de taller"
  [interactive]="true"
></app-card>

<!-- Card sin imagen -->
<app-card
  variant="basic"
  title="Información"
  description="Esta es una tarjeta sin imagen, perfecta para contenido de solo texto."
  [interactive]="false"
></app-card>
```

**Componente TypeScript:**

```typescript
export type CardVariant = 'basic' | 'horizontal';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @Input() variant: CardVariant = 'basic';
  @Input() imageSrc: string = '';
  @Input() imageAlt: string = '';
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() actionText: string = '';
  @Input() interactive: boolean = true;

  get cardClasses(): string {
    const classes = ['card'];
    if (this.variant !== 'basic') classes.push(`card--${this.variant}`);
    if (this.interactive) classes.push('card--interactive');
    return classes.join(' ');
  }

  get hasImage(): boolean {
    return !!this.imageSrc;
  }

  get hasAction(): boolean {
    return !!this.actionText;
  }
}
```

---

### 3.1.3 Alert Component (`app-alert`)

**Propósito:** Componente de notificación para mostrar mensajes contextuales al usuario.

**Ubicación:** `src/app/components/shared/alert/`

**Variantes Disponibles:**
```
- success   → Verde (#15CA31), ✓ icono de éxito
- error     → Rojo (#EA1D1D), ✗ icono de error
- warning   → Naranja (#CA681F), ⚠ icono de advertencia
- info      → Azul (#659CCA), ℹ icono de información
```

**Estados que Maneja:**
```
- Visible       → Mostrada (default)
- Closeable     → Con botón X para cerrar (opcional)
- Non-closeable → Sin botón (permanente)
```

**Nomenclatura BEM:**
```scss
.alert                       // Bloque
├── .alert--success          // Modificador: tipo
├── .alert--error
├── .alert--warning
├── .alert--info
├── .alert__icon             // Elemento: icono
├── .alert__message          // Elemento: texto del mensaje
└── .alert__close            // Elemento: botón cerrar
```

**Ejemplo de Uso:**

```html
<!-- Alert de éxito closeable -->
<app-alert
  type="success"
  message="¡Operación completada exitosamente!"
  [closeable]="true"
  (close)="onAlertClose('success')"
></app-alert>

<!-- Alert de error no closeable -->
<app-alert
  type="error"
  message="Ha ocurrido un error. Por favor intenta de nuevo."
  [closeable]="false"
></app-alert>

<!-- Alert de advertencia -->
<app-alert
  type="warning"
  message="Este cambio no se puede deshacer."
  [closeable]="true"
  (close)="handleWarningClose()"
></app-alert>

<!-- Alert de información -->
<app-alert
  type="info"
  message="Tu sesión expirará en 5 minutos."
  [closeable]="true"
></app-alert>
```

**Componente TypeScript:**

```typescript
export type AlertType = 'success' | 'error' | 'warning' | 'info';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent {
  @Input() type: AlertType = 'info';
  @Input() message: string = '';
  @Input() closeable: boolean = true;
  @Output() close = new EventEmitter<void>();

  isVisible: boolean = true;

  closeAlert(): void {
    this.isVisible = false;
    this.close.emit();
  }

  get alertClasses(): string {
    const classes = ['alert'];
    classes.push(`alert--${this.type}`);
    return classes.join(' ');
  }

  get iconClass(): string {
    const icons = {
      success: 'fas fa-check-circle',
      error: 'fas fa-exclamation-circle',
      warning: 'fas fa-exclamation-triangle',
      info: 'fas fa-info-circle'
    };
    return icons[this.type];
  }
}
```

---

### 3.1.4 Form Input Component (`app-form-input`)

**Propósito:** Campo de entrada de texto reutilizable con validación y toggles de contraseña.

**Ubicación:** `src/app/components/shared/form-input/`

**Variantes Disponibles:**
```
- text          → Campo de texto normal
- email         → Validación de email nativa
- password      → Campo de contraseña (con toggle opcional)
- number        → Campo numérico
- tel           → Teléfono
- url           → URL
```

**Estados que Maneja:**
```
- Normal        → Estado base
- Focus         → Outline azul, border color primario
- Filled        → Con contenido
- Error         → Border rojo, mensaje de error debajo
- Disabled      → Opacidad 0.6, cursor not-allowed
- Required      → Indicador visual (*)
- Password Show → Toggle para mostrar/ocultar contraseña
```

**Nomenclatura BEM:**
```scss
.form-input                  // Bloque
├── .form-input__label       // Elemento: etiqueta
├── .form-input__wrapper     // Elemento: contenedor input
├── .form-input__field       // Elemento: input HTML
├── .form-input__toggle      // Elemento: botón toggle password
├── .form-input__error       // Elemento: mensaje de error
├── .form-input__help-text   // Elemento: texto de ayuda
└── .form-input--error       // Modificador: estado error
```

**Ejemplo de Uso:**

```html
<!-- Input de email simple -->
<app-form-input
  label="Email"
  type="email"
  placeholder="tu@email.com"
  [required]="true"
></app-form-input>

<!-- Input de contraseña con toggle -->
<app-form-input
  label="Contraseña"
  type="password"
  placeholder="••••••••"
  [showPasswordToggle]="true"
></app-form-input>

<!-- Input con error -->
<app-form-input
  label="Nombre de usuario"
  type="text"
  errorMessage="Este nombre ya existe"
  [required]="true"
></app-form-input>

<!-- Input en formulario reactivo -->
<app-form-input
  id="email"
  label="Correo electrónico"
  type="email"
  [required]="true"
  formControlName="email"
></app-form-input>
```

**Componente TypeScript (resumen):**

```typescript
@Component({
  selector: 'app-form-input',
  templateUrl: './form-input.component.html',
  styleUrls: ['./form-input.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => FormInputComponent),
    multi: true
  }]
})
export class FormInputComponent implements ControlValueAccessor, OnInit {
  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() required: boolean = false;
  @Input() errorMessage: string = '';
  @Input() helpText: string = '';
  @Input() showPasswordToggle: boolean = false;

  value: string = '';
  passwordVisible: boolean = false;

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  // Implementa ControlValueAccessor para integración con FormGroup
}
```

---

### 3.1.5 Form Textarea Component (`app-form-textarea`)

**Propósito:** Campo de entrada multilínea reutilizable con contador opcional.

**Ubicación:** `src/app/components/shared/form-textarea/`

**Estados que Maneja:**
```
- Normal        → Estado base
- Focus         → Outline azul
- Filled        → Con contenido
- Error         → Border rojo
- Disabled      → Opacidad 0.6
- With Counter  → Muestra caracteres usados/máximo
- Auto Resize   → Se expande automáticamente (opcional)
```

**Ejemplo de Uso:**

```html
<!-- Textarea simple -->
<app-form-textarea
  label="Descripción"
  placeholder="Escribe una descripción..."
  [rows]="4"
></app-form-textarea>

<!-- Textarea con contador -->
<app-form-textarea
  label="Comentario"
  placeholder="Máximo 100 caracteres"
  [maxLength]="100"
  [rows]="3"
></app-form-textarea>

<!-- Textarea con error -->
<app-form-textarea
  label="Mensaje"
  errorMessage="Campo requerido"
  [required]="true"
  [rows]="5"
></app-form-textarea>
```

---

### 3.1.6 Form Select Component (`app-form-select`)

**Propósito:** Elemento selector (dropdown) reutilizable con validación.

**Ubicación:** `src/app/components/shared/form-select/`

**Tipos de Opciones:**
```typescript
interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;  // Opción deshabilitada
}
```

**Ejemplo de Uso:**

```html
<!-- Select simple -->
<app-form-select
  label="Selecciona una opción"
  [options]="selectOptions"
></app-form-select>

<!-- Select con error -->
<app-form-select
  label="Categoría"
  [options]="categories"
  errorMessage="Selecciona una categoría válida"
  [required]="true"
></app-form-select>

<!-- Select en FormGroup -->
<app-form-select
  id="status"
  label="Estado"
  [options]="statusOptions"
  formControlName="status"
  placeholder="Elige un estado..."
></app-form-select>
```

---

### 3.1.7 Form Checkbox Component (`app-form-checkbox`)

**Propósito:** Elemento checkbox reutilizable para selecciones binarias.

**Ubicación:** `src/app/components/shared/form-checkbox/`

**Estados que Maneja:**
```
- Unchecked     → No seleccionado (default)
- Checked       → Seleccionado
- Indeterminate → Parcialmente seleccionado
- Disabled      → No interactivo
- Focus         → Con outline azul
- Error         → Con mensaje de error
```

**Ejemplo de Uso:**

```html
<!-- Checkbox simple -->
<app-form-checkbox
  label="Acepto los términos y condiciones"
></app-form-checkbox>

<!-- Checkbox deshabilitado -->
<app-form-checkbox
  label="Opción no disponible"
  [disabled]="true"
></app-form-checkbox>

<!-- Checkbox en FormGroup -->
<app-form-checkbox
  id="newsletter"
  label="Recibir newsletter"
  formControlName="subscribe"
></app-form-checkbox>

<!-- Checkbox con error -->
<app-form-checkbox
  label="Debes aceptar los términos"
  errorMessage="Este campo es obligatorio"
></app-form-checkbox>
```

---

### 3.1.8 Login Form Component (`app-login-form`)

**Propósito:** Formulario de autenticación completo, integra múltiples componentes de formulario.

**Ubicación:** `src/app/components/shared/login-form/`

**Características:**
```
- Validación de email nativa
- Validación de contraseña (mínimo 6 caracteres)
- Toggle de visibilidad de contraseña
- Estado de carga (spinner durante envío)
- Mensajes de error descriptivos
- Link a página de registro
- Integración con Reactive Forms
```

**Ejemplo de Uso:**

```html
<!-- Login form básico -->
<app-login-form
  title="Inicia sesión"
  subtitle="Accede a tu cuenta de ReparaFácil"
  submitButtonText="Inicia sesión"
  registerLinkText="¿No tienes cuenta? Regístrate aquí"
  (formSubmit)="handleLogin($event)"
></app-login-form>
```

**Componente TypeScript (resumen):**

```typescript
@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent {
  @Input() title: string = 'Inicia sesión';
  @Input() subtitle: string = '';
  @Input() submitButtonText: string = 'Inicia sesión';
  @Output() formSubmit = new EventEmitter<any>();

  loginForm: FormGroup;
  submitted = false;
  loading = false;

  constructor(private formBuilder: FormBuilder) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.valid) {
      this.loading = true;
      this.formSubmit.emit(this.loginForm.value);
    }
  }
}
```

---

## 3.2 Nomenclatura y Metodología BEM Aplicada

### BEM en la Práctica: Ejemplos Reales

#### Ejemplo 1: Button Component

**Estructura HTML:**
```html
<button class="button button--primary button--lg button--loading">
  <span class="button__content button__content--hidden">
    Enviar
  </span>
  <span class="button__spinner">
    <i class="fas fa-spinner fa-spin"></i>
  </span>
</button>
```

**SCSS Compilado:**
```scss

.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-2;              // gap: 8px
  border: none;
  font-family: $font-primary;
  font-weight: $font-weight-medium;
  cursor: pointer;
  border-radius: $radius-md;    // border-radius: 4px
  @include transition(all);     // Transición suave de 300ms


  &__content {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: inherit;               // Hereda gap del bloque

    // Modificador de estado: contenido oculto
    &--hidden {
      display: none;
    }
  }


  &__spinner {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: $font-size-lg;
    animation: spin 2s linear infinite;
  }


  &--primary {
    background-color: $color-primary;    // #659CCA
    color: $color-text-white;            // blanco
    border: 2px solid $color-primary;

    &:hover {
      background-color: darken($color-primary, 5%);
      box-shadow: $shadow-md;
    }

    &:focus-visible {
      outline: 2px solid $color-primary;
      outline-offset: 2px;
    }
  }


  &--sm {
    padding: $spacing-2 $spacing-3;     // 8px 12px
    font-size: $font-size-sm;            // 14px
    border-radius: $radius-sm;           // 2px
  }


  &--lg {
    padding: $spacing-4 $spacing-6;     // 16px 24px
    font-size: $font-size-lg;            // 20px
    border-radius: $radius-lg;           // 8px
  }


  &--disabled {
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
  }


  &--loading {
    pointer-events: none;
    opacity: 0.8;
  }


  &--block {
    width: 100%;
  }
}

// Animación de spinner
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
```

**Estrategia Explicada:**

| Concepto | Aplicación | Ejemplo |
|----------|-----------|---------|
| **Block** | Componente independiente y reutilizable | `.button` |
| **Element** | Parte que depende del bloque | `.button__content`, `.button__spinner` |
| **Modifier** | Variación del bloque o elemento | `.button--primary`, `.button--lg`, `.button--loading` |
| **State** | Modificador de estado dinámico | `.button__content--hidden`, `.button--disabled` |

**Ventajas de este enfoque:**
- ✅ Claridad: `.button--lg` es obvio que es tamaño grande
- ✅ Escalabilidad: Agregar `.button--xl` no causa conflictos
- ✅ Mantenibilidad: Cambios en `.button__spinner` no afectan otros elementos
- ✅ Reutilización: El componente funciona independientemente

---

#### Ejemplo 2: Card Component

**Estructura HTML (básica):**
```html
<div class="card card--interactive">
  <div class="card__image">
    <img src="..." class="card__image-element" alt="..." />
  </div>

  <div class="card__content">
    <h3 class="card__title">Título de la Card</h3>
    <p class="card__description">Descripción de contenido</p>
    <div class="card__action">
      <ng-content select="[card-action]"></ng-content>
    </div>
  </div>
</div>
```

**Estructura HTML (horizontal):**
```html
<div class="card card--horizontal card--interactive">
  <div class="card__image-side">
    <img src="..." class="card__image-element" alt="..." />
  </div>

  <div class="card__content-side">
    <h3 class="card__title">Título de la Card</h3>
    <p class="card__description">Descripción</p>
  </div>
</div>
```

**SCSS Compilado:**
```scss
.card {

  background-color: $color-text-white;
  border-radius: $radius-lg;           // 8px
  overflow: hidden;
  @include transition(all);            // 300ms


  &__image {
    width: 100%;
    height: 200px;
    overflow: hidden;
    background-color: $color-gray-100;
  }


  &__image-element {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    @include transition(transform);    // Transform suave

    // Aplicable en card interactiva
    .card--interactive:hover & {
      transform: scale(1.05);          // Zoom 5%
    }
  }


  &__content {
    padding: $spacing-6;              // 24px
  }


  &__content-side {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: $spacing-6;
    flex: 1;                          // Toma espacio restante
  }


  &__title {
    font-size: $font-size-2xl;        // 31px
    font-weight: $font-weight-bold;   // 700
    color: $color-text-dark;          // #030303
    margin-bottom: $spacing-2;        // 8px
    line-height: $line-height-tight;  // 1.1
  }


  &__description {
    font-size: $font-size-base;       // 16px
    color: $color-gray-600;
    margin-bottom: $spacing-4;        // 16px
    line-height: $line-height-normal; // 1.5
  }


  &__action {
    display: flex;
    gap: $spacing-2;
  }


  &--basic {
    display: flex;
    flex-direction: column;
  }


  &--horizontal {
    display: flex;
    flex-direction: row;
    align-items: stretch;

    .card__image-side {
      width: 35%;                    // Imagen ocupa 35%
      height: auto;
      min-height: 200px;
      overflow: hidden;
    }

    @include media-query('sm') {
      flex-direction: column;        // Mobile: apilado

      .card__image-side {
        width: 100%;
        height: 200px;
      }
    }
  }


  &--interactive {
    cursor: pointer;
    box-shadow: $shadow-md;
    @include transition(box-shadow, transform);

    &:hover {
      box-shadow: $shadow-lg;
      transform: translateY(-4px);   // Elevación
    }

    &:active {
      transform: translateY(-2px);
    }
  }


  &:not(.card--interactive) {
    box-shadow: $shadow-sm;           // Sombra más suave
  }
}
```

**Decisiones de Nomenclatura:**

| Decisión | Razón |
|----------|-------|
| `.card__image` vs `.card__img` | Descriptivo: claramente es un contenedor, no una etiqueta |
| `.card__image-element` | Diferencia entre contenedor y etiqueta real |
| `.card__image-side` | Específico para variante horizontal (diferente a `__image`) |
| `.card--interactive` | Modificador de estado visual, no de contenido |
| `.card__content` vs `.card__body` | Más semántico: contenido es más claro que body |

---

### Cuándo Usar Modificadores vs Estados

**MODIFICADOR (`--`):**
- Cambia la estructura o apariencia
- Predefinido (conocido en diseño)
- Ejemplo: `.button--primary`, `.button--lg`, `.card--horizontal`

**ESTADO (incluido en modificador o elemento):**
- Temporal, cambia por interacción
- Dinámico (agregado/removido por JavaScript)
- Ejemplo: `.button--loading`, `.button--disabled`, `.button__content--hidden`

**Decisión en el Proyecto:**
```scss
// Correcto: Estado como modificador del bloque
.button--loading          ✅
.button--disabled         ✅

// Correcto: Estado como modificador del elemento
.button__content--hidden  ✅

// Incorrecto: Estado en atributo (evitar)
[disabled]                ❌  // Usar .button--disabled
[aria-hidden="true"]      ❌  // Usar .button__content--hidden
```

---

## 3.2 Style Guide: Página de Referencia Visual

### Propósito del Style Guide

**¿Qué es?**

El Style Guide es una página interactiva que documenta visualmente todos los componentes disponibles en la aplicación. Sirve como:

1. **Documentación Visual:** Ver cómo se ven todos los componentes
2. **Testing Manual:** Probar variantes, tamaños y estados
3. **Referencia para Desarrolladores:** "¿Cómo hago un botón grande?" → Ver en Style Guide
4. **QA y Diseño:** Verificar consistencia visual
5. **Onboarding:** Nuevos desarrolladores entienden rápidamente los componentes

---

### Ubicación y Acceso

**Ubicación en el código:**
```
src/pages/style-guide/
├── style-guide.component.html
├── style-guide.component.scss
└── style-guide.component.ts
```

**Acceso en navegación:**
```
/style-guide    ← Ruta de la página
```

---

### Estructura del Style Guide

#### Sección 1: Encabezado Descriptivo

![alt text](assets/img-doc/card.png)

**Muestra:**
- Título principal: "Style Guide - Componentes"
- Descripción: "Guía completa de todos los componentes disponibles"

---

#### Sección 2: Botones

![alt text](assets/img-doc/botones.png)

**Subsecciones:**

**2.1 Variantes:**
```html
<app-button variant="primary">Primary</app-button>
<app-button variant="secondary">Secondary</app-button>
<app-button variant="ghost">Ghost</app-button>
<app-button variant="danger">Danger</app-button>
```

**2.2 Tamaños:**
```html
<app-button size="sm">Pequeño</app-button>
<app-button size="md">Mediano</app-button>
<app-button size="lg">Grande</app-button>
```

**2.3 Estados:**
```html
<app-button>Normal</app-button>
<app-button [disabled]="true">Disabled</app-button>
<app-button [fullWidth]="true">Full Width</app-button>
```

**Propósito:** Mostrar todas las combinaciones de variantes, tamaños y estados de botones.

---

#### Sección 3: Cards

![alt text](assets/img-doc/card.png)

**3.1 Variante Básica (con imagen):**
```html
<app-card
  variant="basic"
  title="Reparación de Laptop"
  description="Servicio profesional de reparación para laptops de cualquier marca."
  imageSrc="assets/images/laptop-repair.jpg"
  imageAlt="Técnico reparando laptop"
  [interactive]="true"
></app-card>
```

**3.2 Variante Básica (sin imagen):**
```html
<app-card
  variant="basic"
  title="Reparación de Laptop"
  description="Servicio profesional de reparación para laptops de cualquier marca."
  [interactive]="true"
></app-card>
```

**3.3 Variante Horizontal:**
```html
<app-card
  variant="horizontal"
  title="Taller de Electrónica"
  description="Aprende a reparar dispositivos electrónicos básicos en 4 horas."
  imageSrc="assets/images/electronics-workshop.jpg"
  imageAlt="Materiales de taller"
  [interactive]="true"
></app-card>
```

**Propósito:** Demostrar variantes de cards, con y sin imagen.

---

#### Sección 4: Formularios

![alt text](assets/img-doc/formularios.png)

**4.1 Form Input:**
```html
<app-form-input
  label="Email"
  type="email"
  placeholder="tu@email.com"
  [required]="true"
></app-form-input>

<app-form-input
  label="Contraseña"
  type="password"
  placeholder="••••••••"
  [showPasswordToggle]="true"
></app-form-input>

<app-form-input
  label="Con error"
  type="text"
  errorMessage="Este campo es inválido"
></app-form-input>
```

**4.2 Form Textarea:**
```html
<app-form-textarea
  label="Descripción"
  placeholder="Escribe una descripción..."
  [rows]="4"
></app-form-textarea>

<app-form-textarea
  label="Con contador"
  placeholder="Máximo 100 caracteres"
  [maxLength]="100"
  [rows]="3"
></app-form-textarea>
```

**4.3 Form Select:**
```html
<app-form-select
  label="Selecciona una opción"
  [options]="selectOptions"
></app-form-select>

<app-form-select
  label="Con error"
  [options]="selectOptions"
  errorMessage="Selecciona una opción válida"
  [required]="true"
></app-form-select>
```

**4.4 Form Checkbox:**
```html
<app-form-checkbox
  label="Acepto los términos y condiciones"
></app-form-checkbox>

<app-form-checkbox
  label="Opción no disponible"
  [disabled]="true"
></app-form-checkbox>
```

---

#### Sección 5: Alertas

![alt text](assets/img-doc/alertas.png)

**5.1 Tipos de Alerta:**
```html
<app-alert
  type="success"
  message="¡Operación completada exitosamente!"
  [closeable]="true"
></app-alert>

<app-alert
  type="error"
  message="Ha ocurrido un error."
  [closeable]="true"
></app-alert>

<app-alert
  type="warning"
  message="Advertencia importante."
  [closeable]="true"
></app-alert>

<app-alert
  type="info"
  message="Información para el usuario."
  [closeable]="true"
></app-alert>
```

**5.2 Sin Botón de Cerrar:**
```html
<app-alert
  type="success"
  message="Alerta permanente"
  [closeable]="false"
></app-alert>
```

**Propósito:** Demostrar todos los tipos de alertas (success, error, warning, info) y estados.

---

#### Sección 6: Paleta de Colores

![alt text](assets/img-doc/colores.png)

**Muestra todos los colores del sistema:**
```html
<div class="style-guide__colors">
  <div class="style-guide__color" style="background-color: #659CCA;">
    <span>Primary #659CCA</span>
  </div>
  <div class="style-guide__color" style="background-color: #134672;">
    <span>Secondary #134672</span>
  </div>
  <div class="style-guide__color" style="background-color: #CA681F;">
    <span>Accent #CA681F</span>
  </div>
  <div class="style-guide__color" style="background-color: #15CA31;">
    <span>Success #15CA31</span>
  </div>
  <div class="style-guide__color" style="background-color: #EA1D1D;">
    <span>Error #EA1D1D</span>
  </div>
</div>
```

**Propósito:** Referencia rápida de la paleta de colores del proyecto.

---

### Cómo Usar el Style Guide

**Para Desarrolladores:**

1. **Encontrar componente:**
   - Ir a `/style-guide`
   - Navegar a la sección del componente (Botones, Cards, etc.)
   - Encontrar la variante/tamaño/estado que necesitas

2. **Copiar código:**
   - Ver el HTML en el Style Guide
   - Copiar a tu componente
   - Ajustar propiedades según tus necesidades

3. **Probar cambios:**
   - Modificar SCSS del componente
   - El Style Guide refleja automáticamente los cambios
   - Verificar consistencia visual

**Para QA/Diseño:**

1. **Verificar consistencia:**
   - Comparar componentes en Style Guide con el diseño
   - Verificar colores, tamaños, espaciados
   - Reportar discrepancias

2. **Testing visual:**
   - Probar todos los estados (hover, active, disabled)
   - Probar en diferentes tamaños de pantalla (responsive)
   - Verificar accesibilidad (colores, contraste)

3. **Documentation:**
   - Tomar screenshots para documentación
   - Usar como referencia en especificaciones

---

### Estructura SCSS del Style Guide

```scss
// style-guide.component.scss

.style-guide {
  // Contenedor principal
  padding: $spacing-6;
  background-color: $color-gray-50;
}

.style-guide__container {
  // Ancho máximo
  max-width: 1200px;
  margin: 0 auto;
}

.style-guide__section {
  // Secciones separadas
  margin-bottom: $spacing-12;
  padding: $spacing-6;
  background-color: $color-text-white;
  border-radius: $radius-lg;
  box-shadow: $shadow-sm;

  h1, h2, h3 {
    margin-bottom: $spacing-4;
  }
}

.style-guide__row {
  // Fila de componentes
  display: flex;
  gap: $spacing-4;
  flex-wrap: wrap;
  margin-bottom: $spacing-6;
}

.style-guide__cards {
  // Grid de cards
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: $spacing-6;
  margin-bottom: $spacing-6;
}

.style-guide__form {
  // Contenedor de formularios
  display: flex;
  flex-direction: column;
  gap: $spacing-4;
  margin-bottom: $spacing-6;
}

.style-guide__colors {
  // Grid de colores
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: $spacing-4;
}

.style-guide__color {
  // Cuadrado de color
  aspect-ratio: 1;
  border-radius: $radius-lg;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: $shadow-md;

  span {
    color: white;
    font-weight: $font-weight-bold;
    text-shadow: 0 1px 2px rgba(0,0,0,0.3);
  }
}
```

---

### Ventajas del Style Guide

| Aspecto | Beneficio |
|---------|-----------|
| **Consistencia** | Todos usan los mismos componentes |
| **Velocidad** | No reimplementar componentes |
| **Calidad** | QA verifica todos los estados |
| **Comunicación** | Diseño y Dev hablan el mismo idioma |
| **Documentación** | Referencias visuales automáticas |
| **Testing** | Pruebas visuales rápidas |
| **Onboarding** | Nuevos devs entienden rápidamente |

---

### Próximas Mejoras al Style Guide

```
FUTURO
├── Documentación interactiva (Storybook)
├── Control de propiedades en tiempo real
├── Export de componentes a figma
├── Pruebas visuales automatizadas
├── Historial de cambios
└── Integración con CI/CD
```
