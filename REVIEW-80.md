# Ajustes del feedback 8/10 — 8 de noviembre de 2026

Alcance limitado a los cuatro puntos pedidos. Cambios locales, sin nuevo despliegue.

1. **Cabecera:** un único acceso directo a Resources, con Cormorant Garamond, la misma familia del nombre del sitio. Los cuatro destinos educativos quedan en JourneyNav; ya no se duplican en la esquina superior. En móvil Resources es visible sin abrir un menú.
2. **Espacio en la mesa:** el puesto principal se acerca al borde frontal y sus tres vasos/copas se acercan a su plato. Se conservan las 17 piezas, las otras mesas y las funciones. El ajuste llega a WebGL, perspectiva SVG y posiciones del mapa; cada motor respeta sus propias dimensiones.
3. **Capítulos:** las seis descripciones se centran bajo la imagen en inicio y en el índice. Se conservan los textos, el cambio por foco/puntero y las descripciones accesibles de los enlaces.
4. **Resources:** introducción más breve y miniíndice vertical a la izquierda, fijo durante el recorrido de la colección. En pantallas pequeñas se convierte en una franja compacta bajo los cuatro pasos. Sus cuatro enlaces y destinos se conservan. El índice mide su altura para que los títulos no queden tapados. Carreño, las seis lecciones y las siete referencias mantienen su contenido y estilo.

## Verificación

- Build de 14 documentos: 0 errores, 0 advertencias, 0 sugerencias.
- 35 casos distintos aprobados: 32 de navegador y 3 de contenido. Incluyen navegación, selección de las 17 piezas, móvil, recuperación sin WebGL, simulador, encuesta, enlaces, contenido sin JavaScript y ficha impresa.
- Comprobaciones específicas de cabecera, centrado y navegación del índice a 320/390/768/1440 px, sin desbordamientos ni infracciones Axe en las vistas auditadas. El test del salto entre secciones detectó un conflicto con el scroll-padding heredado; se corrigió únicamente dentro de Resources.
- Tres casos clave repetidos en Brave instalado con perfil temporal: selección de las 17 piezas, clic directo en el modelo y visibilidad del índice/encabezados.
- Impeccable sin hallazgos mecánicos. Seis capturas en .qa/feedback-80/, sin errores JavaScript en ese recorrido.

Las verificaciones manuales pendientes de navegadores y tecnologías de asistencia siguen documentadas en VALIDATION.md. La web pública de Vercel conserva el despliegue del 5 de noviembre hasta autorizar una actualización.
