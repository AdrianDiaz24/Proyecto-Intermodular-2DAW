# 🔧 Guía de Debugging - Problemas de Navegación

## Problema: No puedo entrar a `/perfil` ni a `/producto/:id`

### Pasos para Debugging:

#### 1. **Verificar que estás autenticado**
- Abre la Consola del Navegador (F12)
- Ve a la pestaña **Application** → **Local Storage**
- Busca `currentUser` y `auth_token`
- Si no existen, significa que el login no guardó los datos

```javascript
// En la Consola (F12 → Console), ejecuta:
localStorage.getItem('currentUser')
localStorage.getItem('auth_token')
```

#### 2. **Verificar que `enableMockData` está activo**
```javascript
// En la Consola, ejecuta:
// (Este comando dependerá de cómo esté configurado)
console.log('Mock data activo')
```

#### 3. **Ver errores en la consola**
- F12 → Console
- Busca mensajes rojos (errores)
- Busca por "product", "profile", "resolver"

---

## Solución Temporal - Acceso Directo

### Para Acceder al Perfil:
```javascript
// Guardar usuario en localStorage manualmente (en Console):
localStorage.setItem('currentUser', JSON.stringify({
  id: 1,
  username: 'testuser',
  email: 'test@example.com',
  memberSince: new Date().toISOString(),
  phone: '+34 612 345 678'
}));

localStorage.setItem('auth_token', 'mock-jwt-token-' + Date.now());
```

Luego navega a: `http://localhost:4200/perfil`

### Para Acceder a Producto:
Navega directamente a: `http://localhost:4200/producto/1`

Este URL debería cargar el producto con ID 1 del mock.

---

## Problemas Identificados y Soluciones:

### ❌ Problema 1: Resolver no completa
- **Causa**: `BehaviorSubject` nunca completa automáticamente
- **Solución Aplicada**: Usar `take(1)` para completar después del primer valor
- **Estado**: ✅ APLICADO

### ❌ Problema 2: Usuario no se persiste
- **Causa**: Login no guarda datos en localStorage
- **Verificar**: Abre DevTools y mira Local Storage después de login

### ❌ Problema 3: Producto no se encuentra
- **Causa**: Mock data solo tiene productos con ID 1, 2, 3
- **Solución**: Intenta navegar a `/producto/1`, `/producto/2` o `/producto/3`

---

## Próximos Pasos:

1. **Ejecuta la aplicación**:
   ```bash
   npm start
   ```

2. **Intenta hacer login** con cualquier email (ej: `test@example.com`) y contraseña (mín. 6 caracteres)

3. **Abre DevTools** (F12) → Console y verifica:
   ```javascript
   // Ver si se guardó el usuario:
   JSON.parse(localStorage.getItem('currentUser'))
   
   // Ver si se guardó el token:
   localStorage.getItem('auth_token')
   ```

4. **Si ves los datos**, intenta navegar a `/perfil`

5. **Si hay errores**, cópiame el mensaje de error de la Consola

---

## Prueba Rápida

Si sigues sin poder entrar, intenta esto en la Consola (F12):

```javascript
// Simular login manual
localStorage.setItem('currentUser', JSON.stringify({
  id: 1,
  username: 'User123',
  email: 'user@example.com',
  memberSince: '2026-01-15',
  phone: '+34 612 345 678'
}));

localStorage.setItem('auth_token', 'test-token-' + Date.now());
localStorage.setItem('refresh_token', 'test-refresh-' + Date.now());

// Luego navega a:
// http://localhost:4200/perfil
```

---

**Si aún tienes problemas, cópiame:**
1. El error que ves en la Consola (F12)
2. Lo que ves en Local Storage (F12 → Application)
3. La URL a la que intentas navegar

