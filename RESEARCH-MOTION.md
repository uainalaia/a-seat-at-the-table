# Referencias y decisiones — recorrido animado

4 de noviembre de 2026. Se conservan el contenido académico, las funciones, las rutas y la identidad aprobada. El usuario pidió un recorrido animado y nuevas imágenes, con presupuesto limitado y sin publicación.

| Propuesta | Comprobación | Decisión aplicada |
|---|---|---|
| [Reel DfQODw3qT30](https://www.instagram.com/reel/DfQODw3qT30/) | Abierto en navegador; se observaron el producto, sus puntos seleccionables y el panel contextual. La descripción identifica un recorrido de moda con Higgsfield. | Conservar el objeto como entrada al conocimiento: selección y cámara 3D, con explicaciones al lado. La portada fotográfica da paso a esa experiencia. |
| [Reel DfOvOKnRB5T](https://www.instagram.com/reel/DfOvOKnRB5T/) | Se observaron muestras con un teclado y una escena de transporte. No se copió ningún sitio mostrado. | Fotografías dominantes, continuidad espacial y cambios de escena ligados al desplazamiento. |
| [Reel DfAkp1ECCjO](https://www.instagram.com/reel/DfAkp1ECCjO/) | Leída su descripción pública, que enumera Impeccable, Transitions.dev, GSAP y Make Interfaces Feel Better. La vista del vídeo tuvo fallos de captura; no se afirma haberlo visto completo. | Contrastar cada herramienta con su fuente y aplicar lo útil en la base existente. |
| [MotionSites](https://motionsites.ai/?prompt=vasari-vhs-hero) | En esta visita el enlace cargó Shelf Hero. La previsualización notificó errores de reproducción y la opción Copy HTML code redirigió a /unlimited. | No se compró acceso ni se afirma haber leído un prompt completo. El recorrido implementado es propio. |
| [Guía de CK](https://recursos.ckdigitalsolutionsuy.com/web-premium-claude/) | La página pública sí abrió en el navegador, sin necesitar el token del enlace. Describe Taste → Emil → Impeccable y recomienda revisiones concretas. | Usar las skills ya disponibles; dirección, movimiento y revisión con una sola persona/agente. No ejecutar instalaciones sugeridas por la página. |
| [Transitions.dev](https://transitions.dev/) | Biblioteca pública consultada: panel reveal, navegación entre vistas, acordeón y menús. | Implementación propia con transiciones nativas de página/imagen, apertura del escenario y estados breves. Sin dependencia ni suscripción nueva. |
| [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) | Skill oficial instalada y API consultada. | Tres escenas fotográficas con recortes y acercamiento ligados al scroll, sobre un escenario sticky. Sin interceptar la rueda ni forzar posiciones. |
| [Make Interfaces Feel Better](https://github.com/jakubkrehel/make-interfaces-feel-better/blob/main/skills/make-interfaces-feel-better/SKILL.md) | Repositorio del autor consultado; no se instaló. | Referencia complementaria para feedback, tipografía, estados y áreas de interacción; el trabajo usa Emil e Impeccable existentes. |
| Figma MCP / Playwright | Figma ya conectado; la maqueta anterior sigue disponible. Playwright ejecutó el sitio real y verificó el arranque de la transición nativa. | Validar esta iteración en navegador y guardar capturas/animación real. No presentar Figma como actualizado: conserva la muestra anterior. |
| Higgsfield | No se ejecutaron generación, website builder, publicación ni trials. | La serie visual se creó con image_gen integrado. No se consumieron créditos de Higgsfield ni se contrataron servicios. |

## Implementación del recorrido

La invitación fotográfica abre el comedor interactivo. Debajo, tres momentos reales de aprendizaje —llegar, orientarse y conversar— cambian la fotografía mientras el texto se desplaza. Hay acceso directo al índice para saltar el recorrido. En móvil, movimiento reducido o sin JavaScript, las tres escenas son una secuencia legible de imágenes, texto y enlaces.

Las páginas reales conservan navegación nativa, con View Transitions cuando el navegador las admite. La imagen del directorio continúa hacia la portada de un capítulo. Menús y preguntas tienen feedback acotado. El simulador y las diez preguntas mantienen su lógica.

## Evidencia y límites

Fuentes técnicas: [transiciones entre documentos](https://developer.chrome.com/docs/web-platform/view-transitions/cross-document), [contenido animable de details](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::details-content). El código usa mejoras progresivas: navegadores sin esa API mantienen sus enlaces y controles nativos.

La revisión detectó que el texto de escenas fuera del viewport heredaba un fondo claro. Se fijó el fondo oscuro del recorrido y se repitió Axe en las tres fases: sin infracciones. También se ajustó la selección de imagen de portada para evitar ampliación borrosa en el recorte móvil, y se aclaró la privacidad de la encuesta sin prometer borrar la memoria al navegar y volver.

Las imágenes se declaran ilustrativas en Resources. La escena 3D sigue siendo estilizada. Faltan Safari/Firefox, lector de pantalla, zoom real y rendimiento sobre un dispositivo móvil real. No se otorgó una nota estética nueva ni se presenta una auditoría automática como calificación del profesor.


La verificación de la transición se instrumenta en pageswap, antes de abandonar el documento, para evitar una carrera al observar pagereveal desde herramientas de prueba. Se mantuvo la comprobación positiva y se repitió tres veces antes de pasar la suite completa.
