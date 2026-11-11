# Auditoría general — dirección visual y fiabilidad 3D

4 de noviembre de 2026. Referencia principal: la sección de vídeos que aprobó Omar. Su valoración de la iteración anterior, **5/10**, sustituye cualquier autoevaluación anterior. Esta revisión no concede una nueva nota estética.

## Dictamen

La dirección de arte estaba fragmentada: tres fotografías se reutilizaban para seis temas, varios bloques añadían imagen sin explicar nada y el comedor tenía un acabado diferente. La comprobación anterior en Edge y la existencia del mapa no demostraban que el recorrido funcionara en los navegadores del estudiante.

Se conservaron la paleta, las fuentes, las rutas, los seis capítulos, los ocho objetos, el simulador y las diez preguntas. La sección aprobada aporta ahora el lenguaje común: geometría precisa, campos marfil/borgoña/carbón, contraste sobrio y espacio con intención.

## Hallazgos y cambios

| Prioridad | Before | After | Motivo / evidencia |
|---|---|---|---|
| P1 | Un fallo gráfico terminaba directamente en un mapa | Visor 3D con WebGL y segundo visor de geometría proyectada en SVG, con cámara, perspectiva y selección; mapa como alternativa explícita | Pruebas con WebGL bloqueado y capturas en Brave |
| P1 | Los errores se silenciaban y no había recuperación | Mensaje de estado, detalles de visualización y reintento; opción voluntaria de vista ilustrada | Pérdida de contexto y recuperación probadas |
| P1 | La carga parcial podía dejar un canvas vacío | Liberación de GPU y limpieza del contenedor antes de cambiar de visor | Caso específico: WebGL permitido y canvas 2D bloqueado |
| P1 | Fotografías genéricas repetidas entre lecciones | Seis estudios originales de invitación, servilleta, mesa, menú, conversación y agradecimiento | Cada portada corresponde a su objetivo educativo |
| P2 | Cuchara formada por piezas, mango plano y encuadre lejano | Una superficie cerrada continua, cuenco cóncavo y cámara cercana; etiqueta fuera del cuenco | Captura actual `spoon-after.png` |
| P2 | Imágenes reiteradas en recorrido, preguntas, simulador y cierre | Recorrido ilustrado por actos; arte por decisión; preguntas y cierre sin fotos de relleno | Se conserva una única imagen atmosférica en la invitación |
| P2 | Titular de tres líneas en tableta y nueva imagen que desbordaba a 320 px | Medidas y proporciones corregidas | Prueba completa en cuatro anchos y capturas |
| P2 | Firma y enlaces pequeños en el cierre | Texto secundario del cierre a 14 px | Revisión visual y de legibilidad |

## Qué aportaron las referencias

La comparación usa los casos y análisis ya presentes en el catálogo de Taste; no implica haber obtenido el código privado de esos sitios.

| Referencia | Qué hace útil el recurso | Aplicación aquí |
|---|---|---|
| [Kereliott](https://kereliott.com/) | Su contenido describe un lugar concreto y sus imágenes representan habitaciones, entorno y actividades identificables | Exigir un motivo a cada imagen. La repetición de una foto de cubiertos para varios temas se sustituyó por diagramas específicos |
| NOTHIN’, documentado en Taste | Su gran marca tipográfica es el tema de la página | Conservar jerarquía y escala sin repetir la marca como un segundo titular gigante al final de una guía educativa |
| [Transitions.dev](https://transitions.dev/) y Emil | Movimiento ligado a cambios comprensibles de estado y espacio | Cámara interrumpible, navegación entre páginas y feedback breve; teclado y movimiento reducido instantáneos |
| Sección Watch & learn aprobada | La ilustración permite reconocer el tema antes de leer | Extender ese lenguaje a capítulos y práctica; no usarla como un adorno intercambiable |

## Navegadores: qué quedó probado

- **Brave instalado, perfil temporal y modo automatizado:** el recorrido original sí arrancó con WebGL. No se reprodujo la configuración concreta de la sesión del usuario y no se modificaron sus preferencias, extensiones ni Shields.
- **Brave con APIs bloqueadas deliberadamente:** funciona la cámara 3D ilustrada, además del contenido y la selección. No es una captura prerenderizada ni el mapa 2D.
- **Brave y Edge:** ocho casos del recorrido en Brave y la suite completa en Edge, incluyendo bloqueo total de WebGL, bloqueo solo de canvas 2D, pérdida del contexto y reintento.
- **Opera:** no hubo ejecutable disponible para realizar una comprobación real. No se declara resuelto de forma universal. El visor sin WebGL reduce esa dependencia; falta probar la sesión del estudiante.

La versión de Three utilizada [requiere WebGL 2](https://threejs.org/docs/pages/WebGLRenderer). Brave [documenta protecciones sobre las APIs gráficas](https://brave.com/privacy-updates/38-webgl-webgpu-fingerprinting-protections/). Estas fuentes explican posibilidades; **no identifican la causa del incidente concreto**. No se pidió desactivar las protecciones del usuario.

## Calidad y límites

Lectura técnica orientativa de Impeccable; no es la nota de diseño ni la calificación del profesor:

| Dimensión | 0–4 | Fundamento y límite |
|---|---:|---|
| Accesibilidad | 3 | Teclado, errores y Axe comprobados; lector de pantalla pendiente |
| Rendimiento | 2 | Motor de tamaño material, preparación anticipada y SVG por CPU; medición móvil real pendiente |
| Tema y tokens | 3 | Paleta coherente; persisten valores locales en materiales e ilustraciones |
| Responsive | 3 | Cuatro anchos sin overflow; tacto y zoom reales pendientes |
| Integridad | 2 | Recuperación probada; sigue la deuda de cascada de estilos y no se reprodujo la sesión original |
| **Total técnico** | **13/20** | Queda trabajo de consolidación y comprobación real; no implica una nota estética nueva |

Compilación final: 14 documentos, cero errores/advertencias/sugerencias de Astro y sin el aviso previo de chunk >500 KB. La división de módulos deja aproximadamente 371 KB en el módulo del comedor y 235 KB en el módulo compartido de geometría: el coste total del motor sigue siendo material, aunque ya no lo concentre un único archivo.

Pruebas: **25 casos distintos aprobados** (22 navegador + 3 contenido). Los ocho casos del recorrido se repitieron en Brave; no se suman como ocho funcionalidades nuevas. Doce auditorías Axe adicionales sobre mesa, índice de capítulos y práctica a 320/390/768/1440 px en Brave: sin infracciones detectadas, desbordamientos ni errores de página. El mapa permanece accesible y las rutas educativas funcionan sin JavaScript.

Impeccable: escaneo mecánico sin hallazgos, seguido de inspección real. La revisión visual detectó y corrigió un problema de superposición de superficies del visor SVG que las pruebas funcionales no detectaban. No se presenta el escaneo como certificación estética o WCAG.

Taste conserva resultados sin filtrar en `.qa/audit-general/taste-final/report.json`. No se anuncia un aprobado estricto: sus requisitos sobre cantidad de fotografías y número de elementos animados contradicen la referencia ilustrada elegida y el movimiento deliberado. Los números pertenecen a capítulos ordenados y al progreso; algunos “eyebrows” detectados son tiempos de lectura y enlaces del bloque anterior. La paleta y la cursiva son decisiones aprobadas. La diversidad de tamaños y la cascada de estilos siguen siendo deuda de mantenimiento; no se añadieron fotos ni animaciones para mejorar un contador.

Pendientes reales: Opera en la sesión del estudiante, Safari/Firefox, lector de pantalla, zoom real del 200 %, dispositivo táctil y rendimiento móvil, reproducción completa de YouTube, URL pública anónima y ficha de entrega después de publicar. El cierre anterior fue demasiado optimista sobre compatibilidad; esta revisión delimita la evidencia.

No hubo publicación, push, conexión de hosting, instalación de skills/dependencias ni consumo de créditos de Higgsfield. La maqueta Figma anterior no se actualizó. Evidencia vigente: `.qa/audit-general/`. La tabla académica continúa en [VALIDATION.md](<C:/Users/omarq/Documents/ChatGPT/WEB SIE 415/VALIDATION.md>).
