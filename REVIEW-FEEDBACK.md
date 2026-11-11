# Cierre de los cinco puntos de feedback

4 de noviembre de 2026. La valoración del usuario de la iteración anterior es 5.5/10. No se asigna una nota estética nueva. Se mantuvieron identidad, contenido académico, rutas y presupuesto; no se publicó.

| Before | After | Why |
|---|---|---|
| Guía lateral dominada por texto y una lista plana | Estudio visual del objeto, posición bajo el título, consejo destacado y ocho selectores con siluetas originales | Identificar, ubicar y aprender con una jerarquía escaneable |
| Cuenco esférico y mango separados | Cuenco elíptico cóncavo, superficie interior/exterior, borde y cuello continuo; etiqueta elevada | Corregir la forma y dejar visible la unión |
| Cierre con dos titulares grandes, párrafo y marca repetida | Una invitación breve junto a una fotografía; navegación y firma compactas | Reducir mensajes competidores y conservar todas las rutas |
| Fallo de WebGL forzaba `entered=true` y omitía la portada | Disponibilidad del 3D independiente de la aceptación de la invitación | Conservar la entrada fotográfica y abrir el mapa solo al elegir entrar |
| Resources como lista de lecturas y bloque largo de notas | Biblioteca Watch/Read, dos vídeos citados, capítulos relacionados, referencias en filas y créditos desplegables | Facilitar aprendizaje visual y consulta sin ocultar las fuentes |

## Vídeos y alcance de comprobación

Se verificaron las páginas y los identificadores de los reproductores publicados por The Emily Post Institute:

- [The Napkin](https://emilypost.com/advice/table-manners-video-the-napkin): `FitRDb6yTXY`.
- [B & D for Bread and Drink](https://emilypost.com/advice/table-manners-video-b-and-d-for-bread-and-drink): `ohk5ZDRgNY0`.

Las descripciones son síntesis originales. Los diagramas de portada son propios y están identificados como ilustraciones. No se descargaron vídeos ni miniaturas del editor. La conexión a YouTube ocurre al abrir la lección; cerrar elimina el reproductor activo. No hay autoplay. Los enlaces al editor y a los capítulos funcionan sin JavaScript.

Las pruebas funcionales interceptan la respuesta del reproductor para verificar carga bajo demanda, cierre y enlaces sin depender de terceros. La comprobación en vivo de YouTube no pudo confirmar un reproductor listo en el navegador automatizado: **reproducción completa pendiente en un navegador normal**. Cada vídeo mantiene un enlace alternativo visible al editor. No se afirma que se hayan visto completos.

## Verificación

- Compilación: 14 documentos, 0 errores/advertencias/sugerencias de Astro. Vite conserva la advertencia del módulo 3D superior a 500 KB.
- 20 pruebas de navegador + 3 de contenido aprobadas. Se añadió cobertura de vídeos y se corrigió la regresión del inicio sin WebGL; Resources se incluye en los cuatro anchos de aceptación.
- Nueve auditorías Axe adicionales: mesa/recursos a 320, 390, 768 y 1440 px, más inicio sin WebGL después de entrar. Sin infracciones detectadas, desbordamientos ni errores de página. Esto no certifica accesibilidad completa.
- Impeccable sobre seis archivos de interfaz modificados: sin hallazgos mecánicos. Revisión visual real de panel, cuchara, cierre, biblioteca y portada sin 3D.
- Evidencia final en `.qa/feedback/`: capturas por tamaño, `audits.json` y diagnóstico de la comprobación de vídeo en vivo. No se incluyen estos archivos en el sitio publicado.

Permanecen pendientes Safari/Firefox, lector de pantalla, zoom real 200 %, dispositivo táctil/GPU real, reproducción completa de YouTube y acceso anónimo a la URL definitiva después de una publicación autorizada. Sin nuevas skills, dependencias, planes o créditos de Higgsfield.
