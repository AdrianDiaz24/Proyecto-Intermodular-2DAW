# ReparaFácil - Proyecto Intermodular 2DAW

[![Deploy to GitHub Pages](https://github.com/AdrianDiaz24/Proyecto-Intermodular-2DAW/actions/workflows/deploy.yml/badge.svg)](https://github.com/AdrianDiaz24/Proyecto-Intermodular-2DAW/actions/workflows/deploy.yml)
[![Generar Documentación](https://github.com/AdrianDiaz24/Proyecto-Intermodular-2DAW/actions/workflows/docs.yml/badge.svg)](https://github.com/AdrianDiaz24/Proyecto-Intermodular-2DAW/actions/workflows/docs.yml)

## 🌐 URL de Producción

**[https://adriandiaz24.github.io/Proyecto-Intermodular-2DAW/](https://adriandiaz24.github.io/Proyecto-Intermodular-2DAW/)**

---

## 📋 Descripción

**ReparaFácil** es una aplicación web colaborativa diseñada para ayudar a los usuarios a resolver problemas con sus electrodomésticos y aparatos electrónicos. La plataforma permite:

- **Buscar productos**: Encuentra electrodomésticos y aparatos por nombre, marca o modelo.
- **Reportar incidencias**: Los usuarios pueden reportar problemas que han encontrado con sus dispositivos.
- **Colaboración comunitaria**: La comunidad puede ayudar a resolver las incidencias reportadas por otros usuarios.
- **Gestión de perfil**: Los usuarios pueden gestionar su información personal, cambiar contraseña y ver sus incidencias creadas.

La filosofía de ReparaFácil es: **"Repara. Colabora. Aprende. Arreglémoslo juntos."**

---

## 🛠️ Tecnologías Usadas

### Frontend
| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| **Angular** | 15.x | Framework principal de desarrollo |
| **TypeScript** | 4.9.x | Lenguaje de programación |
| **SCSS/Sass** | 1.x | Preprocesador CSS |
| **RxJS** | 7.x | Programación reactiva |

### Herramientas de Desarrollo
| Herramienta | Uso |
|-------------|-----|
| **Angular CLI** | Scaffolding y desarrollo |
| **Node.js** | Entorno de ejecución |
| **npm** | Gestión de paquetes |
| **JSDoc** | Generación de documentación |
| **wkhtmltopdf** | Conversión HTML a PDF |

### Despliegue
| Servicio | Uso |
|----------|-----|
| **GitHub Pages** | Hosting de la aplicación |
| **GitHub Actions** | CI/CD automatizado |

---

## ✨ Características Principales

### Páginas Implementadas
- 🏠 **Home**: Página principal con hero, buscador y navegación
- 🔐 **Login**: Autenticación de usuarios
- 📝 **Registro**: Creación de nuevas cuentas
- 👤 **Perfil**: Gestión de información personal, seguridad e incidencias
- 🔍 **Búsqueda**: Resultados de búsqueda de productos con filtros
- 📦 **Producto**: Detalle del producto con especificaciones e incidencias
- ℹ️ **Sobre Nosotros**: Información de la plataforma
- 🚫 **404**: Página de error personalizada

### Funcionalidades
- ✅ Sistema de autenticación (login/registro)
- ✅ Búsqueda de productos
- ✅ Visualización de productos con especificaciones técnicas
- ✅ Carrusel de incidencias por producto
- ✅ Filtrado de incidencias (pendientes/resueltas)
- ✅ Modal para añadir nuevos productos
- ✅ Modal para reportar incidencias
- ✅ Sistema de temas (claro/oscuro)
- ✅ Diseño responsive (mobile, tablet, desktop)
- ✅ Lazy loading de imágenes
- ✅ Animaciones CSS optimizadas
- ✅ Breadcrumbs dinámicos
- ✅ Guards de rutas (autenticación)

---

## 🚀 Instrucciones de Instalación Local

### Prerrequisitos
- **Node.js** (v18 o superior)
- **npm** (v9 o superior)
- **Git**

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/AdrianDiaz24/Proyecto-Intermodular-2DAW.git
   cd Proyecto-Intermodular-2DAW
   ```

2. **Instalar dependencias del frontend**
   ```bash
   cd frontend
   npm install
   ```

3. **Ejecutar en modo desarrollo**
   ```bash
   npm start
   ```
   La aplicación estará disponible en `http://localhost:4200`

4. **Compilar para producción**
   ```bash
   npm run build -- --configuration production
   ```
   Los archivos compilados se generarán en `frontend/dist/proyecto-intermodular-2daw/`

### Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm start` | Inicia el servidor de desarrollo |
| `npm run build` | Compila la aplicación |
| `npm run watch` | Compila en modo watch |
| `npm test` | Ejecuta los tests unitarios |

---

## 📚 Documentación

### Formatos Generados
- **HTML (GitHub Pages)**: [https://adriandiaz24.github.io/Proyecto-Intermodular-2DAW](https://adriandiaz24.github.io/Proyecto-Intermodular-2DAW)
- **PDFs**: [Ver en GitHub](https://github.com/AdrianDiaz24/Proyecto-Intermodular-2DAW/tree/main/frontend/docs/pdf)
- **Documentación técnica**: [docs/design/DOCUMENTACION.md](docs/design/DOCUMENTACION.md)

### Herramientas de Documentación
- **JSDoc**: Generación de documentación automática del código JavaScript
  ```bash
  npx jsdoc -c jsdoc.json
  ```
- **wkhtmltopdf**: Conversión de HTML a PDF
  ```bash
  wkhtmltopdf docs/*.html documentacion.pdf
  ```

---

## 🔄 Workflows de GitHub Actions

### Deploy (deploy.yml)
Despliega automáticamente la aplicación Angular a GitHub Pages cuando se hace push a `main`.

### Documentación (docs.yml)
Genera automáticamente la documentación JSDoc en HTML y PDF cuando se hace push a `main`.

### Pasos del Workflow de Documentación
1. Checkout del repositorio
2. Configuración de Node.js v20
3. Instalación de dependencias
4. Generación de documentación HTML con JSDoc
5. Conversión a PDF con wkhtmltopdf
6. Subida de artefactos
7. Commit y push automático de cambios

---

## 📁 Estructura del Proyecto

```
Proyecto-Intermodular-2DAW/
├── .github/
│   └── workflows/          # GitHub Actions
├── backend/                # Backend Spring Boot (en desarrollo)
├── docs/                   # Documentación general
│   ├── client/
│   └── design/
│       └── DOCUMENTACION.md
├── frontend/               # Aplicación Angular
│   ├── src/
│   │   ├── app/           # Componentes, servicios, guards
│   │   ├── assets/        # Imágenes e iconos
│   │   ├── pages/         # Páginas de la aplicación
│   │   └── styles/        # Estilos SCSS globales
│   ├── docs/              # Documentación generada
│   └── package.json
└── README.md
```

---

## 🎨 Sistema de Temas

La aplicación incluye un sistema de temas claro/oscuro:
- Cambio de tema desde la página de perfil
- Persistencia de preferencia en localStorage
- Detección automática de preferencia del sistema
- Transiciones suaves entre temas (200ms)

---

## 📄 Licencia

Este proyecto es de uso educativo.

---

## 🔗 Enlaces Útiles

- [Aplicación en Producción](https://adriandiaz24.github.io/Proyecto-Intermodular-2DAW/)
- [Repositorio en GitHub](https://github.com/AdrianDiaz24/Proyecto-Intermodular-2DAW)
- [Documentación Técnica](docs/design/DOCUMENTACION.md)

