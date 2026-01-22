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

## 2. HTML Semántico y Estructura

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
    ├── <button type="submit""> "Inicia sesión"
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
         - [type]: Cambia dinámicamente entre 'password' y 'text'
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
```

---

## 5. Optimización Multimedia

---

### 5.1 Formatos Elegidos

#### Justificación de Formatos

| Formato | Uso Principal | Ventajas | Cuándo Usarlo |
|---------|---------------|----------|---------------|
| **AVIF** | Imágenes principales, iconos, logos | Mejor compresión (hasta 50% más que WebP), soporte de HDR, transparencia | Navegadores modernos (Chrome 85+, Firefox 93+, Safari 16.4+) |
| **WebP** | Fallback para navegadores sin AVIF | Buena compresión, amplio soporte | Cuando AVIF no está soportado |
| **JPG** | Fallback universal | Compatibilidad universal | Solo como último fallback |
| **PNG** | NO USADO | Reemplazado por AVIF | - |

#### ¿Por qué AVIF sobre WebP y JPG?

**AVIF (AV1 Image File Format):**
- **Compresión superior:** Reduce el tamaño hasta un 50% más que WebP y 70% más que JPG manteniendo calidad visual equivalente.
- **Soporte de transparencia:** Soporta canal alfa como PNG pero con mejor compresión.
- **HDR y amplia gama de colores:** Soporte nativo para contenido de alto rango dinámico.
- **Codificación progresiva:** Permite carga progresiva de imágenes.

**Decisión del proyecto:**
Hemos optado por usar **AVIF como formato principal** para todas las imágenes del proyecto (iconos, logos, imágenes de hero, avatares) debido a:
1. El proyecto está orientado a navegadores modernos.
2. La reducción significativa de peso mejora el rendimiento y Core Web Vitals.
3. Squoosh.app permite conversión fácil y optimizada.

---

### 5.2 Herramientas Utilizadas

| Herramienta | Propósito | URL |
|-------------|-----------|-----|
| **Squoosh** | Optimización y conversión de imágenes | https://squoosh.app/ |
| **Chrome DevTools** | Verificación de carga y tamaños | Integrado en Chrome |
| **Lighthouse** | Auditoría de rendimiento | Integrado en Chrome DevTools |

#### Proceso de Optimización con Squoosh

1. **Cargar imagen original** en squoosh.app
2. **Seleccionar formato AVIF** en el panel derecho
3. **Ajustar calidad:** 60-75 para fotografías, 80-90 para iconos/logos
4. **Verificar resultado visual** en la comparación lado a lado
5. **Descargar** imagen optimizada

**Configuración recomendada Squoosh para AVIF:**
```
Calidad: 65-75 (fotografías)
Calidad: 80-90 (iconos y logos)
Effort: 4-6 (balance velocidad/compresión)
Subsampling: 4:2:0 (fotografías) / 4:4:4 (gráficos con texto)
```

---

### 5.3 Resultados de Optimización

| Imagen | Tamaño Original (PNG/JPG) | Tamaño AVIF | Reducción |
|--------|---------------------------|-------------|-----------|
| `hero-taller.jpg` | 856 KB | 89 KB | **89.6%** |
| `logoNaranja.png` | 45 KB | 8 KB | **82.2%** |
| `UsuarioBlanco.png` | 12 KB | 3 KB | **75.0%** |
| `buscar.png` | 8 KB | 2 KB | **75.0%** |
| `boton-de-reproduccion.png` | 6 KB | 1.5 KB | **75.0%** |
| `mas.png` | 5 KB | 1.2 KB | **76.0%** |
| `error.png` | 4 KB | 1 KB | **75.0%** |

**Total de ahorro estimado:** ~800 KB → ~105 KB (**~87% de reducción**)

---

### 5.4 Tecnologías de Imágenes Responsive Implementadas

#### 5.4.1 Elemento `<picture>` - Art Direction

El elemento `<picture>` permite servir diferentes imágenes según el tamaño de pantalla (art direction).

**Implementación en Hero (home.component.html):**

```html
<!-- Imagen de fondo responsive con art direction -->
<picture class="p-home-hero__background">
    <!-- Móvil: imagen recortada/optimizada para mobile -->
    <source
        media="(max-width: 640px)"
        srcset="/assets/images/hero-taller-mobile.avif 640w,
                /assets/images/hero-taller-mobile.avif 320w"
        sizes="100vw"
        type="image/avif">
    
    <!-- Tablet: imagen intermedia -->
    <source
        media="(max-width: 1024px)"
        srcset="/assets/images/hero-taller-tablet.avif 1024w,
                /assets/images/hero-taller-tablet.avif 768w"
        sizes="100vw"
        type="image/avif">
    
    <!-- Desktop: imagen completa -->
    <source
        srcset="/assets/images/hero-taller.avif 1920w,
                /assets/images/hero-taller.avif 1280w"
        sizes="100vw"
        type="image/avif">
    
    <!-- Fallback para navegadores sin soporte -->
    <img
        src="/assets/images/hero-taller.avif"
        alt="Taller de reparaciones - ReparaFácil"
        class="p-home-hero__bg-img"
        loading="eager"
        decoding="async">
</picture>
```

**¿Por qué `<picture>` y no solo `srcset`?**
- Permite **art direction**: mostrar imágenes con diferentes encuadres según el dispositivo.
- Permite especificar **múltiples formatos** con fallbacks automáticos.
- El navegador elige la mejor opción automáticamente.

#### 5.4.2 Atributos `srcset` y `sizes`

**`srcset`:** Define múltiples versiones de la imagen con sus anchos.

```html
srcset="/assets/images/hero-taller.avif 1920w,
        /assets/images/hero-taller.avif 1280w,
        /assets/images/hero-taller.avif 640w"
```

**`sizes`:** Indica al navegador qué tamaño tendrá la imagen en el viewport.

```html
sizes="100vw"  <!-- La imagen ocupa el 100% del viewport width -->
```

#### 5.4.3 Atributo `loading` - Carga Diferida

**`loading="lazy"`:** Carga la imagen solo cuando está cerca del viewport.

```html
<!-- Imágenes fuera del viewport inicial - lazy loading -->
<img 
    src="/assets/icons/logoNaranja.avif" 
    alt="Logo" 
    loading="lazy"
    decoding="async">
```

**`loading="eager"`:** Carga inmediata (para imágenes críticas above-the-fold).

```html
<!-- Imagen del hero - carga inmediata -->
<img
    src="/assets/images/hero-taller.avif"
    alt="Hero"
    loading="eager"
    decoding="async">
```

#### 5.4.4 Atributo `decoding="async"`

Permite al navegador decodificar la imagen de forma asíncrona sin bloquear el renderizado.

```html
<img src="image.avif" decoding="async" loading="lazy">
```

---

### 5.5 Animaciones CSS Optimizadas

#### Principio de Optimización

**¿Por qué solo animamos `transform` y `opacity`?**

1. **No provocan Layout/Reflow:** Cambiar `width`, `height`, `margin`, etc. obliga al navegador a recalcular el layout de toda la página.

2. **No provocan Repaint:** Cambiar `color`, `background`, `box-shadow` requiere repintar píxeles.

3. **Se ejecutan en la GPU:** `transform` y `opacity` se pueden acelerar por hardware, ejecutándose en un thread separado (compositor thread).

**Comparativa de rendimiento:**
```
COSTOSO (evitar):
├─ width/height → Layout + Paint + Composite
├─ margin/padding → Layout + Paint + Composite
├─ top/left/right/bottom → Layout + Paint + Composite
├─ box-shadow → Paint + Composite
└─ background-color → Paint + Composite

ÓPTIMO (usar):
├─ transform → Solo Composite ✓
└─ opacity → Solo Composite ✓
```

#### Animaciones Implementadas

##### 1. Animación `fadeIn` - Aparición suave

**Descripción:** Elementos aparecen con un movimiento sutil hacia arriba mientras aumentan su opacidad.

**Uso:** Títulos, subtítulos, cards al cargar la página.

**Duración:** 400ms

```scss
// src/styles/components/_animations.scss
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// Aplicación con delays escalonados
.p-home-hero__title-line-1 {
  opacity: 0;
  animation: fadeIn 400ms ease-out forwards;
  animation-delay: 100ms;
}

.p-home-hero__title-line-2 {
  opacity: 0;
  animation: fadeIn 400ms ease-out forwards;
  animation-delay: 200ms;
}
```

##### 2. Animación `slideInLeft` - Deslizamiento desde izquierda

**Descripción:** Elementos entran deslizándose desde la izquierda.

**Uso:** Contenedor de texto del hero.

**Duración:** 500ms

```scss
@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

// Aplicación
.p-home-hero__text-container {
  animation: slideInLeft 500ms ease-out forwards;
}
```

##### 3. Animación `spin` - Loading Spinner

**Descripción:** Rotación continua para indicadores de carga.

**Uso:** Estados de carga en botones y páginas.

**Duración:** 500ms (infinito)

```scss
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

// Componente de spinner
.loading-spinner {
  display: inline-block;
  width: 24px;
  height: 24px;
  border: 3px solid rgba($color-primary, 0.3);
  border-top-color: $color-primary;
  border-radius: 50%;
  animation: spin 500ms linear infinite;
  
  &--sm { width: 16px; height: 16px; border-width: 2px; }
  &--lg { width: 40px; height: 40px; border-width: 4px; }
}
```

#### Transiciones Hover/Focus (5+ elementos)

##### 1. Botón de búsqueda del Hero

```scss
// home.component.scss
&__search-btn {
  transition: transform 200ms ease-out, opacity 200ms ease-out;

  &:hover {
    transform: scale(1.08);
    opacity: 0.95;
  }

  &:active {
    transform: scale(0.95);
  }
}
```

##### 2. Input de búsqueda

```scss
input {
  transition: transform 200ms ease-out, box-shadow 200ms ease-out;

  &:focus {
    transform: scale(1.02);
    box-shadow: 0 6px 20px rgba(0,0,0,0.25);
  }
}
```

##### 3. Links del Header con underline animado

```scss
// _header.scss
a {
  position: relative;
  transition: transform 200ms ease-out, opacity 200ms ease-out;

  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: $color-accent;
    transform: scaleX(0);
    transform-origin: right;
    transition: transform 250ms ease-out;
  }

  &:hover {
    transform: translateY(-2px);
    opacity: 0.9;
    
    &::after {
      transform: scaleX(1);
      transform-origin: left;
    }
  }
}
```

##### 4. Logo del Header

```scss
.logo {
  transition: transform 150ms ease-out;

  &:hover {
    transform: scale(1.05);
  }
}
```

##### 5. Cards de incidencias

```scss
// product.component.scss
.incidence-card {
  transition: transform 200ms ease-out;
  
  &:hover {
    transform: translateY(-4px);
  }
}
```

##### 6. Botón de añadir (add-button)

```scss
.add-button {
  transition: transform 200ms ease-out, opacity 200ms ease-out;
  
  &:hover {
    transform: scale(1.1);
    opacity: 0.9;
  }
  
  &:active {
    transform: scale(0.95);
  }
}
```

#### Clases de Utilidad para Animaciones

```scss
// src/styles/components/_animations.scss

// Hover lift - elemento sube ligeramente
.hover-lift {
  transition: transform 200ms ease-out;
  &:hover { transform: translateY(-4px); }
}

// Hover scale - elemento crece
.hover-scale {
  transition: transform 150ms ease-out;
  &:hover { transform: scale(1.05); }
}

// Card elevate - para tarjetas
.card-elevate {
  transition: transform 250ms ease-out;
  &:hover { transform: translateY(-6px) scale(1.01); }
}

// Link underline animado
.link-underline {
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: currentColor;
    transform: scaleX(0);
    transform-origin: right;
    transition: transform 250ms ease-out;
  }
  
  &:hover::after {
    transform: scaleX(1);
    transform-origin: left;
  }
}
```

---

## 6. Sistema de Temas (Light/Dark Mode)

---

### 6.1 Variables de Tema - CSS Custom Properties

El sistema de temas utiliza CSS Custom Properties definidas en `:root` para el tema claro y en `[data-theme="dark"]` para el tema oscuro.

#### Tema Claro (por defecto)

```css
:root {
  /* Colores de fondo */
  --c-bg-primary: #ffffff;
  --c-bg-secondary: #f9fafb;
  --c-bg-tertiary: #f3f4f6;
  
  /* Colores de texto */
  --c-text-primary: #030303;
  --c-text-secondary: #4b5563;
  --c-text-tertiary: #9ca3af;
  
  /* Colores de borde */
  --c-border-light: #e5e7eb;
  --c-border-medium: #d1d5db;
  
  /* Colores de sombra */
  --c-shadow: rgba(0, 0, 0, 0.1);
  
  /* Colores de marca */
  --c-primary: #659CCA;
  --c-primary-hover: #2A7DC3;
  --c-secondary: #134672;
  --c-accent: #CA681F;
  --c-accent-hover: #D45D05;
  
  /* Estados */
  --c-success: #15CA31;
  --c-error: #EA1D1D;
  
  /* Hover/Active */
  --c-hover-bg: #f3f4f6;
  --c-active-bg: #e5e7eb;
}
```

#### Tema Oscuro

```css
[data-theme="dark"] {
  /* Colores de fondo (grises oscuros) */
  --c-bg-primary: #1f2937;
  --c-bg-secondary: #111827;
  --c-bg-tertiary: #374151;
  
  /* Colores de texto (claros) */
  --c-text-primary: #f3f4f6;
  --c-text-secondary: #d1d5db;
  --c-text-tertiary: #9ca3af;
  
  /* Colores de borde */
  --c-border-light: #374151;
  --c-border-medium: #4b5563;
  
  /* Colores de sombra */
  --c-shadow: rgba(0, 0, 0, 0.4);
  
  /* Colores de marca (ajustados para oscuro) */
  --c-primary: #93badb;
  --c-primary-hover: #659CCA;
  --c-secondary: #4a90c7;
  --c-accent: #f49d6a;
  --c-accent-hover: #CA681F;
  
  /* Estados */
  --c-success: #34d399;
  --c-error: #f87171;
  
  /* Hover/Active */
  --c-hover-bg: #374151;
  --c-active-bg: #4b5563;
}
```

---

### 6.2 Implementación del Theme Switcher

#### Componente: `theme-switcher.component.ts`

```typescript
export class ThemeSwitcherComponent implements OnInit {
  isDarkMode: boolean = false;

  ngOnInit(): void {
    this.loadThemePreference();
  }

  /**
   * Cargar preferencia de tema
   * Prioridad: 1. localStorage  2. Sistema  3. Claro por defecto
   */
  private loadThemePreference(): void {
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
      // Prioridad 1: Tema guardado
      this.isDarkMode = savedTheme === 'dark';
    } else {
      // Prioridad 2: Preferencia del sistema
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.isDarkMode = prefersDark;
    }
    
    this.applyTheme();
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    this.applyTheme();
  }

  private applyTheme(): void {
    const html = document.documentElement;
    
    if (this.isDarkMode) {
      html.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  }
}
```

#### Ubicación del Theme Switcher

El botón de cambio de tema se encuentra en la **página de perfil** (`profile.component.html`):

```html
<div class="profile-actions">
  <app-theme-switcher></app-theme-switcher>
  <button class="profile-btn profile-btn--secondary" (click)="logout()">
    Cerrar sesión
  </button>
</div>
```

---

### 6.3 Prioridad de Carga del Tema

```
1. localStorage (preferencia guardada del usuario)
   ↓
2. prefers-color-scheme (preferencia del sistema operativo)
   ↓
3. Tema claro (por defecto)
```

---

### 6.4 Transiciones Suaves

Las transiciones entre temas duran 200ms:

```css
*,
*::before,
*::after {
  transition: background-color 200ms ease-in-out, 
              color 200ms ease-in-out, 
              border-color 200ms ease-in-out,
              box-shadow 200ms ease-in-out;
}

/* Excepciones: imágenes no transicionan */
img, svg, video, iframe, canvas {
  transition: none;
}
```

---

### 6.5 Aplicación a Elementos Existentes

El sistema de temas cambia automáticamente los colores de:

- **Body**: Fondo y texto principal
- **Cards**: Fondo, bordes y sombras
- **Formularios**: Inputs, textareas, selects
- **Títulos y texto**: h1-h6, p, span, labels
- **Tablas**: Encabezados, filas, hover
- **Links**: Color primario
- **Botones deshabilitados**: Color gris

---

### 6.6 Resumen de Implementación

| Componente | Función | Estado |
|-----------|---------|--------|
| CSS Custom Properties | Variables dinámicas de color | ✅ Implementado |
| `:root` | Tema claro por defecto | ✅ Implementado |
| `[data-theme="dark"]` | Tema oscuro | ✅ Implementado |
| `ThemeSwitcherComponent` | Botón para cambiar tema | ✅ Implementado |
| `localStorage` | Persistencia de preferencia | ✅ Implementado |
| `prefers-color-scheme` | Detección del sistema | ✅ Implementado |
| Transiciones CSS | Cambio suave (200ms) | ✅ Implementado |
| Ubicación | Página de perfil | ✅ Implementado |

---

## 7. Aplicación Completa y Despliegue

### 7.1 Estado Final de la Aplicación

#### Páginas Implementadas

| Página | Ruta | Descripción | Estado |
|--------|------|-------------|--------|
| **Home** | `/` | Página principal con hero, título, subtítulo y buscador central | ✅ Completa |
| **Login** | `/login` | Formulario de inicio de sesión con validación | ✅ Completa |
| **Registro** | `/registro` | Formulario de registro con confirmación de contraseña | ✅ Completa |
| **Perfil** | `/perfil` | Gestión de información personal, seguridad e incidencias | ✅ Completa |
| **Búsqueda** | `/buscar` | Resultados de búsqueda con grid de productos | ✅ Completa |
| **Producto** | `/producto/:id` | Detalle del producto con especificaciones e incidencias | ✅ Completa |
| **Sobre Nosotros** | `/about` | Información de la plataforma y equipo | ✅ Completa |
| **404** | `**` | Página de error personalizada | ✅ Completa |

#### Funcionalidades Implementadas

##### Sistema de Autenticación
- ✅ Formulario de login con validación
- ✅ Formulario de registro con confirmación de contraseña
- ✅ Navegación entre login y registro
- ✅ Guards de rutas para proteger páginas privadas
- ✅ Redirección automática a login si no autenticado

##### Gestión de Productos
- ✅ Búsqueda de productos por nombre, marca o modelo
- ✅ Grid de resultados con tarjetas de producto
- ✅ Vista detallada del producto con especificaciones técnicas
- ✅ Modal para añadir nuevos productos (nombre, marca, modelo, imagen)
- ✅ Formulario de dos pasos (obligatorio y opcional)

##### Sistema de Incidencias
- ✅ Carrusel de incidencias por producto
- ✅ Filtrado por estado (pendientes/resueltas)
- ✅ Buscador de incidencias
- ✅ Modal para reportar nuevas incidencias
- ✅ Visualización de incidencias en perfil de usuario

##### Interfaz de Usuario
- ✅ Header con navegación y menú hamburguesa responsive
- ✅ Footer con enlaces y redes sociales
- ✅ Sistema de temas claro/oscuro
- ✅ Diseño responsive (mobile, tablet, desktop)
- ✅ Breadcrumbs dinámicos
- ✅ Animaciones CSS optimizadas
- ✅ Loading states y spinners

##### Componentes Compartidos
- ✅ `FormInputComponent`: Input reutilizable con validación
- ✅ `FormTextareaComponent`: Textarea con validación
- ✅ `FormSelectComponent`: Select con opciones dinámicas
- ✅ `ButtonComponent`: Botón con variantes (primary, secondary, accent)
- ✅ `CardComponent`: Tarjeta reutilizable
- ✅ `AlertComponent`: Alertas de información/error/éxito
- ✅ `LoadingSpinnerComponent`: Indicador de carga
- ✅ `BreadcrumbsComponent`: Migas de pan dinámicas
- ✅ `ThemeSwitcherComponent`: Selector de tema
- ✅ `AddButtonComponent`: Botón circular para añadir
- ✅ `CloseButtonComponent`: Botón de cerrar modal

#### Servicios Implementados

| Servicio | Funcionalidad |
|----------|---------------|
| `AuthService` | Autenticación, login, logout, estado del usuario |
| `ProductService` | CRUD de productos, búsqueda, paginación |
| `NavigationService` | Gestión del historial de navegación |
| `AssetsService` | Resolución de rutas de assets con base-href |
| `BaseHttpService` | Servicio base para peticiones HTTP |

#### Guards y Resolvers

| Guard/Resolver | Función |
|----------------|---------|
| `AuthGuard` | Protege rutas que requieren autenticación |
| `GuestGuard` | Redirige usuarios autenticados |
| `UnsavedChangesGuard` | Previene pérdida de datos en formularios |
| `ProductResolver` | Precarga datos del producto antes de activar ruta |
| `UserResolver` | Precarga datos del usuario |

---

### 7.2 Despliegue

#### URL de Producción

**🌐 [https://adriandiaz24.github.io/Proyecto-Intermodular-2DAW/](https://adriandiaz24.github.io/Proyecto-Intermodular-2DAW/)**

#### Configuración del Despliegue

El despliegue se realiza automáticamente mediante GitHub Actions:

```yaml
# .github/workflows/deploy.yml
name: Desplegar Angular en GitHub Pages

on:
  push:
    branches: [ "main" ]
  workflow_dispatch:

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    
    - name: Configurar Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        
    - name: Instalar dependencias
      working-directory: ./frontend
      run: npm ci
      
    - name: Construir para producción
      working-directory: ./frontend
      run: npm run build -- --configuration production --base-href /Proyecto-Intermodular-2DAW/
      
    - name: Desplegar a GitHub Pages
      uses: JamesIves/github-pages-deploy-action@v4
      with:
        folder: frontend/dist/proyecto-intermodular-2daw
        branch: gh-pages
```

#### Verificación de Funcionamiento en Producción

| Verificación | Estado | Notas |
|--------------|--------|-------|
| Carga de página principal | ✅ Funciona | Hero, buscador y navegación operativos |
| Navegación SPA | ✅ Funciona | Rutas funcionan correctamente con 404.html |
| Carga de imágenes | ✅ Funciona | Assets con rutas relativas correctas |
| Sistema de temas | ✅ Funciona | Persiste preferencia en localStorage |
| Responsive design | ✅ Funciona | Adaptación a móvil, tablet y desktop |
| Formularios | ✅ Funciona | Validación y navegación entre páginas |
| Animaciones | ✅ Funciona | Transiciones suaves sin afectar rendimiento |

#### Proceso de Build para Producción

```bash
# Desde el directorio frontend/
npm run build -- --configuration production --base-href /Proyecto-Intermodular-2DAW/
```

Esto genera:
- Archivos minificados y optimizados
- Hash en nombres de archivos para cache busting
- Tree shaking de código no utilizado
- AOT compilation para mejor rendimiento

---

### 7.3 Problemas Conocidos y Mejoras Futuras

#### Problemas Conocidos

| Problema | Severidad | Descripción | Workaround |
|----------|-----------|-------------|------------|
| Budget de bundle excedido | ⚠️ Baja | El bundle inicial supera 500KB (595KB) | No afecta funcionalidad, considerar lazy loading adicional |
| Budget de CSS excedido | ⚠️ Baja | product.component.scss supera 10KB | No afecta funcionalidad, considerar refactorización |
| Mock data | ℹ️ Info | Los datos son simulados, no hay backend real | Preparado para integración con API REST |
| Autenticación simulada | ℹ️ Info | El login no valida contra servidor | Estructura preparada para JWT |

#### Mejoras Futuras

##### Corto Plazo (Próxima iteración)
- [ ] Integración con backend Spring Boot
- [ ] Autenticación real con JWT
- [ ] Persistencia de datos en base de datos
- [ ] Subida real de imágenes de productos
- [ ] Sistema de notificaciones

##### Medio Plazo
- [ ] Comentarios y respuestas en incidencias
- [ ] Sistema de valoración de soluciones
- [ ] Perfil público de usuarios
- [ ] Historial de actividad
- [ ] Búsqueda avanzada con filtros múltiples

##### Largo Plazo
- [ ] PWA (Progressive Web App)
- [ ] Notificaciones push
- [ ] Chat en tiempo real
- [ ] Sistema de gamificación (puntos, badges)
- [ ] Integración con APIs de fabricantes
- [ ] Reconocimiento de imagen para identificar productos
- [ ] Internacionalización (i18n)

#### Optimizaciones Pendientes

| Área | Mejora Propuesta | Impacto |
|------|------------------|---------|
| **Bundle size** | Implementar lazy loading para páginas secundarias | Reducción ~30% carga inicial |
| **Imágenes** | Implementar CDN para assets | Mejor tiempo de carga |
| **SEO** | Añadir meta tags dinámicos | Mejor indexación |
| **Accesibilidad** | Auditoría WCAG completa | Cumplimiento AA |
| **Testing** | Aumentar cobertura de tests unitarios | Mayor estabilidad |
| **Monitorización** | Integrar analytics y error tracking | Mejor debugging |

---

### 7.4 Resumen Final

| Métrica | Valor |
|---------|-------|
| **Páginas implementadas** | 8 |
| **Componentes creados** | 25+ |
| **Servicios** | 5 |
| **Guards/Resolvers** | 5 |
| **Líneas de código SCSS** | 5000+ |
| **Tiempo de carga inicial** | ~2s (3G) |
| **Lighthouse Performance** | 85+ |
| **Responsive breakpoints** | 4 (mobile, tablet, desktop, xl) |

#### Tecnologías Utilizadas

```
Frontend:
├── Angular 15.x
├── TypeScript 4.9.x
├── SCSS/Sass
├── RxJS 7.x
└── Angular Router

Herramientas:
├── Angular CLI
├── Node.js 20.x
├── npm
├── JSDoc
└── wkhtmltopdf

Despliegue:
├── GitHub Pages
└── GitHub Actions (CI/CD)
```

#### Enlaces del Proyecto

| Recurso | URL |
|---------|-----|
| **Producción** | [https://adriandiaz24.github.io/Proyecto-Intermodular-2DAW/](https://adriandiaz24.github.io/Proyecto-Intermodular-2DAW/) |
| **Repositorio** | [https://github.com/AdrianDiaz24/Proyecto-Intermodular-2DAW](https://github.com/AdrianDiaz24/Proyecto-Intermodular-2DAW) |
| **Documentación PDF** | [Ver en GitHub](https://github.com/AdrianDiaz24/Proyecto-Intermodular-2DAW/tree/main/frontend/docs/pdf) |

---

*Documentación actualizada: Enero 2026*

