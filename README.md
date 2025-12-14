+114
-1
Lines changed: 114 additions & 1 deletion


Original file line number	Diff line number	Diff line change
@@ -1 +1,114 @@
# Proyecto-Intermodular-2DAW
# Proyecto-Intermodular-2DAW
## Herramientas usadas
- JSdoc
  - Comando para ejecutarlo: ```npx jsdoc -c jsdoc.json```
- wkhtmltopdf
  - Comando para ejecutarlo: ```wkhtmltopdf docs/*.html documentacion.pdf```
## Ejmplo de codigo documentado
```js
/**
 * Suma dos números.
 * @param {number} a - Primer número.
 * @param {number} b - Segundo número.
 * @returns {number} La suma de ambos números.
 */
export function sumar(a, b) {
    return a + b;
}
```
## Formatos generados
- HTML (github pages): https://adriandiaz24.github.io/Proyecto-Intermodular-2DAW
- PDFs: https://github.com/AdrianDiaz24/Proyecto-Intermodular-2DAW/tree/main/docs/pdf
## Explicacion breve del workflow
Al ejecutar un push sobre el repositorio en la rama "Main" se ejecuta el workflow
### Pasos del job
1. Checkout del repositorio: Descarga el código fuente del proyecto para que los siguientes pasos puedan acceder a él.
2. Configurar Node.js: Instala Node.js con la versión 20 para ejecutar las herramientas de JavaScript.
3. Instalar jsdoc: Instala ```jsdoc```, el generador de documentación automática a partir de los comentarios del código
4. Generar la documentación en HTML: Ejecuta ```npx jsdoc -c jsdoc.json para crear``` la documentación del código en formato HTML dentro de docs/html, especificando en el ```json``` donde se encuentra los archivos a analizar y en que directorio crear el HTML.
5. Instalar wkhtmltopdf: Instala la herramienta que convierte archivos HTML a PDF.
6. Subir PDFs como artefactos: Guarda los PDF generados como artifacts descargables desde GitHub Actions.
7. Commit y push automáticos: Si hay cambios en docs/, los sube automáticamente al repositorio con el mensaje “Actualizar jsdoc y PDFs”.
8. Publicar en GitHub Pages: Sube la documentación HTML generada a la rama gh-pages para que esté disponible públicamente como sitio web.
## Como clonar el repositorio
Realizar un fork del repositorio y desde intelliJ o el IDE que prefieras usar la opcion de clonar proyecto/repositorio a traves del enlace del fork, una vez clonado cualquier cambio que hagas y subas deberia ejecutar automaticamente el workflow actualizando el HTMLs y PDFs.
## Respuesta al cuestionario.
### a) ¿Qué herramienta o generador utilizaste en el workflow para crear la documentación en /docs?
 
```jsdoc``` y ```wkhtmltopdf```
### b) Muestra un fragmento del código con comentarios/docstrings estructurados que haya sido procesado por la herramienta. Comenta que estilo de documentación has utlicado.
```js
/**
 * Suma dos números.
 * @param {number} a - Primer número.
 * @param {number} b - Segundo número.
 * @returns {number} La suma de ambos números.
 */
export function sumar(a, b) {
    return a + b;
}
```
He usado JSDoc de Google Style
### c) ¿Qué segundo formato (además de HTML) generaste? Explica la configuración o comandos del workflow y herramientas que lo producen.
He generado PDFs como segundo formato.
la parte del job del workflow que genera los PDFs, hace lo siguiente:
1. Instala la herramienta wkhtmltopdf.
2. Busca todos los archivos .html dentro de la carpeta docs/html.
3. Crea una carpeta docs/pdf.
4. Convierte cada archivo HTML encontrado en un PDF con el mismo nombre.
``` yaml
    - name: Instalar wkhtmltopdf
      run: sudo apt-get update && sudo apt-get install -y wkhtmltopdf
    - name: Convertir HTMLs a PDFs
      run: |
        mkdir -p docs/pdf
        for html in $(find docs/html -type f -name "*.html"); do
          base=$(basename "$html" .html)
          pdf="docs/pdf/${base}.pdf"
          echo "Generando $pdf..."
          wkhtmltopdf --enable-local-file-access "file://$(pwd)/$html" "$pdf"
        done
        echo "Archivos PDF generados:"
        ls -l docs/pdf
```
### d) Explica cómo GitHub facilita mantener la documentación cuando colaboran varias personas.
Lo facilita ya que crea y actualiza automaticamente la documentacion cada vez que se realiza un commit & push haciendo que aunque trabaje varias personas no pierdan tiempo en ejecutar ellos la propia herramientas, encargandose esta de explciar tambien las demas cosas realizadas por otros compañeros que se hayan subido antes de lo mio y yo desconozca, haciendo que si se hiciera de forma manua obviara esos cambios.
### f) ¿Qué medidas/configuración del repositorio garantizan que solo personal autorizado accede al código y la documentación?
Haciendo el repositorio privado, lo cual hace que ninguna persona que no se le haya dado acceso pueda acceder al mismo.
### g) Indica dónde en el README.md explicas el funcionamiento del workflow y dónde detallas las herramientas y comandos de documentación.
Se indica tanto en el apartado de "Explicacion breve del workflow" como "Herramientas usadas"
### h) Justifica por qué el workflow utilizado es CI. ¿Qué evento dispara automáticamente la generación/actualización de la documentación?
Por se implementa de forma continua y automatica la documentacion, aunque en este caso tambien se podria considerar que hay CD ya que se despliega automaticamente el HTML a traves de Github Pages.
El evento que activa la generacion automatica de la documentacion en al hacer un ```push```
