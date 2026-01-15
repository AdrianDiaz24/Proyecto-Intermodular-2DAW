# Solución: Error TS2306 "File is not a module"

## Problema
El IDE (WebStorm/IntelliJ) muestra el error:
```
error TS2306: File 'C:/Users/.../app.routes.ts' is not a module.
```

Sin embargo, el proyecto compila correctamente con `ng build` y `ng serve`.

## Causa
Este es un falso positivo del IDE que ocurre cuando:
1. El archivo `app.routes.ts` es un archivo de configuración, no un módulo Angular
2. El IDE está utilizando una versión diferente de TypeScript que la CLI de Angular
3. El caché del IDE está desactualizado

## Soluciones

### Opción 1: Limpiar caché del IDE (Recomendado)
1. En WebStorm: **File → Invalidate Caches → Invalidate and Restart**
2. Espera a que el IDE se reinicie y reindex los archivos

### Opción 2: Actualizar la ruta de importación
Si el error persiste, asegúrate de que la importación sea correcta:

```typescript
// ✅ Correcto
import { appRoutes } from './app.routes';

// ❌ Incorrecto
import appRoutes from './app.routes';
```

### Opción 3: Verificar tsconfig.json
Asegúrate de que `tsconfig.app.json` incluya el archivo:

```json
{
  "compilerOptions": {
    "outDir": "../out-tsc/app",
    "types": ["node"]
  },
  "files": ["main.ts"],
  "include": ["**/*.d.ts"]
}
```

### Opción 4: Reiniciar el servidor de desarrollo
1. Detén `ng serve`
2. Elimina la carpeta `.angular/cache`
3. Ejecuta `ng serve` nuevamente

### Opción 5: Reconstruir el proyecto
```bash
# Limpiar archivos generados
rm -r dist/ .angular/

# Reconstruir
ng build
```

## Verificación
Para confirmar que el proyecto está bien configurado:

```bash
# Compilación exitosa
ng build

# Servidor de desarrollo
ng serve

# Sin errores de compilación (solo warnings de budget es normal)
ng lint
```

## Nota Importante
**El error TS2306 en el IDE es un falso positivo si el proyecto compila correctamente.**

El archivo `app.routes.ts` es un archivo TypeScript normal que exporta una constante `Routes`, no un módulo Angular NgModule. Es completamente válido importarlo en `app.module.ts`.

## Configuración Correcta

### app.routes.ts (✅ Correcto)
```typescript
import { Routes } from '@angular/router';

export const appRoutes: Routes = [
    // rutas...
];
```

### app.module.ts (✅ Correcto)
```typescript
import { appRoutes } from './app.routes';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes)
    ]
})
export class AppModule { }
```

Si después de intentar estas soluciones el error persiste solo en el IDE pero el proyecto compila correctamente, puedes ignorar el error de forma segura.

