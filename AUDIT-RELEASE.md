# Auditoría final y publicación — 9 de noviembre de 2026

Sitio: https://a-seat-at-the-table-opal.vercel.app

## Resultado

Identidad y recorrido aprobados conservados. Se revisaron móvil y escritorio, teclado, actividades, enlaces, recursos audiovisuales y publicación. La compilación genera 14 documentos con 0 errores, advertencias o sugerencias. **41 casos distintos aprobados: 38 de navegador y 3 de contenido**.

Correcciones observadas:

- El scroll-padding global no ganaba al selector :root original: algunas anclas dejaban títulos parcialmente detrás de la cabecera. Se corrigió la especificidad y se añadieron regresiones de teclado y anclas de inicio/capítulos.
- La prueba pública detectó un clic en el simulador antes de que React conectara sus manejadores. Las acciones de mesa, simulador y encuesta ahora se habilitan al terminar esa conexión. Tres pruebas retienen artificialmente los scripts y comprueban el primer uso. El contenido estático sigue legible; la interacción requiere JavaScript.
- Cada vídeo ofrece un acceso directo a YouTube además de la página del editor, para navegadores que bloqueen la reproducción integrada. Se identifica la lección escrita equivalente.
- La ficha académica incluye Carreño y nombra los navegadores realmente comprobados. Se conserva su impresión en una hoja A4.

## Cobertura

La batería incluye 17 objetos, selección directa y teclado, cámara, mapa, recuperación sin WebGL, seis decisiones y resultados/reinicio, diez preguntas, validación de respuestas, seis reproductores bajo demanda, siete referencias, navegación, vista sin JavaScript e impresión.

Se comprobaron 320/390/768/1440 px, vistas anchas previas de 1920/2560 px, paisaje compacto y reflujo a 640×450 equivalente al área CSS de un escritorio de 1280 px ampliado al 200 %. Esto no sustituye una prueba manual del zoom nativo. Axe no encontró infracciones en las vistas/estados auditados; no es una certificación completa de WCAG. El detector mecánico de Impeccable no encontró hallazgos.

Seis vídeos reales de Emily Post iniciaron y avanzaron más de un segundo en la URL pública, con controles de subtítulos disponibles. No se afirma haber revisado íntegramente cada vídeo o sus subtítulos. Evidencia: .qa/release/live-videos.json y video-1.png a video-6.png.

Los enlaces de la Biblioteca Nacional de Colombia, TCU, Western Michigan, Virginia Tech y University of Arizona respondieron 200. Emily Post devuelve una comprobación antirobot (403, “Un momento…”) a este entorno; no se clasificó como página inexistente ni se intentó saltar la comprobación. Se mantienen las referencias oficiales, los enlaces directos a YouTube y las lecciones propias. Su acceso desde otro equipo requiere comprobación humana si aparece ese control.

Guías de revisión: https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md. Los criterios se aplicaron a la implementación y a los recorridos, conservando las decisiones visuales aprobadas.

## Rúbrica original

| Criterio | Puntos | Evidencia |
|---|---:|---|
| Enlace interno | 10 | Inicio, seis capítulos, mesa, simulador, reflexión y recursos; validación de destinos, activos y fragmentos. |
| Enlace externo | 10 | Carreño y fuentes universitarias accesibles; referencias oficiales de Emily Post y enlaces de vídeo. Limitación antirobot identificada arriba. |
| Gráfico | 10 | Comedor propio, 17 piezas modeladas, mapas y estudios SVG originales; imagen de apertura acreditada como ilustración generada. |
| Función avanzada | 20 | Simulador de seis decisiones con tres opciones, consecuencias, explicación, resultado y repetición; mesa con cámara guiada y alternativas. |
| Diseño básico | 30 | Jerarquía editorial, navegación persistente, contraste, teclado, formularios, diseño adaptable y movimiento reducido comprobados. |
| Referencias | 5 | Carreño como fundamento histórico con edición/localizadores; fuentes contemporáneas diferenciadas y siete referencias anotadas. |
| Ortografía y gramática | 5 | Contenido y controles en inglés, con explicaciones y contexto; sin errores relevantes observados. |
| Estilo general | 10 | Identidad marfil/borgoña/carbón, fuentes locales, recursos coherentes y dirección aprobada por el usuario. |
| **Total posible** | **100** | Evidencia de cumplimiento; no es una nota asignada por el profesor. |
| Encuesta obligatoria | — | Diez preguntas visibles: seis de conocimiento, dos de confianza y dos abiertas; respuestas locales sin recopilación. |
| Ficha obligatoria | — | /submission/, Omar Quispe Avalos, URL HTTPS validada e impresión A4 de seis campos. El estudiante introduce la URL definitiva si necesita entregarla. |
| Entrega tardía | −10 | Fecha y entrega en D2L pendientes de comprobación por el estudiante; no se inventó una fecha. |

## Publicación

Proyecto existente: omar-d870/a-seat-at-the-table. Node 24.x, Astro estático, salida dist, plan Hobby. Actualización autorizada explícitamente por el usuario.

Despliegue final: **dpl_5wtpDgtVHHN5JEq11zvggVBTTd2b**, estado **Ready**, producción actualizada. Se conserva el dominio público, sin inicio de sesión.

La verificación final usó un contexto nuevo sin cookies ni credenciales: 13 rutas respondieron 200, con títulos correctos, versión nueva, imágenes de portada cargadas y cero errores JavaScript en ese recorrido. Ocho pruebas funcionales pasaron sobre el dominio público en Edge, incluidas las seis decisiones completas, resultados/reinicio, encuesta, 17 piezas, recuperación gráfica y pantallas móviles. Cuatro pruebas adicionales pasaron en Brave, incluida la protección de los primeros clics con scripts retenidos. Evidencia: .qa/release/public-routes.json, public-home.png, public-tests/ y brave-public/.

## Límites manuales

No estaban disponibles Safari, Opera, Firefox ni un lector de pantalla real; no se instaló software adicional. También quedan la prueba en teléfono físico, zoom nativo y revisión completa de subtítulos. Las comprobaciones de Edge/Brave y Axe no se presentan como sustitutos de esas pruebas.
