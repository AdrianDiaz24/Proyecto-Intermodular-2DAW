# Justificación DIW

## Arquitectura

1. ¿Por qué has colocado tus variables en la capa Settings y tus estilos en Components?

Las variables se colocan en Settings porque son valores que se pueden acceder desde diferentes componentes importando su uso, en cambio los estilos de ese compononente de como se ajusta, tamaño son unicos para ese componnte.

2. ¿Qué pasaría si importaras Components antes que Settings en el manifiesto?

Si importo components antes que Settings se cargarian primero esos estilos, haciendo conflicto con los de Settings e impidiendo su uso por quien use esas variables.

## Metodología

1. Explica una ventaja real que te haya aportado usar BEM en este examen frente a usar selectores de etiqueta anidados (ej: div > button).

Usar BEM me ha permitido crear estilos especificos para cada etiqueta sin que se mezclen con otros, en cambio si usara selectores de etiqueta anidados seria mas dificil su mantenimiento y causando problemas usando estilos que no se deberia usar en X parte.

