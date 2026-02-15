# Capturas de pantalla - Auditoría de Accesibilidad

Este directorio contiene las capturas de pantalla de las herramientas de auditoría de accesibilidad utilizadas en el proyecto ReparaFácil.

## Archivos esperados

### Auditoría inicial (antes de correcciones)
- `lighthouse-antes.png` - Captura de Lighthouse Accessibility antes de las correcciones
- `wave-antes.png` - Captura de WAVE Extension antes de las correcciones
- `taw.png` - Captura de TAW (Test de Accesibilidad Web)

### Auditoría final (después de correcciones)
- `lighthouse-despues.png` - Captura de Lighthouse Accessibility después de las correcciones
- `wave-despues.png` - Captura de WAVE Extension después de las correcciones

### Verificación cross-browser
- `chrome.png` - Captura de la aplicación en Google Chrome
- `firefox.png` - Captura de la aplicación en Mozilla Firefox
- `edge.png` - Captura de la aplicación en Microsoft Edge

## Instrucciones para generar las capturas

### Lighthouse
1. Abrir Chrome DevTools (F12)
2. Ir a la pestaña "Lighthouse"
3. Seleccionar solo "Accessibility"
4. Click en "Analyze page load"
5. Hacer captura de pantalla del resultado

### WAVE
1. Instalar extensión WAVE desde https://wave.webaim.org/extension/
2. Navegar a la página a analizar
3. Activar la extensión
4. Hacer captura de pantalla del panel de resultados

### TAW
1. Ir a https://www.tawdis.net/?lang=es
2. Introducir la URL del proyecto
3. Hacer captura de pantalla del informe generado
