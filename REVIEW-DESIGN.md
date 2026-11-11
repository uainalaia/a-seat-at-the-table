# Revisión de diseño — A Seat at the Table

Revisión del 31 de octubre de 2026. El rediseño está implementado y funciona en la vista previa local. No se ha publicado.

## Decisión creativa

La invitación se convierte en un lugar: entrar al comedor, tomar asiento y aprender a partir de los objetos de la mesa. Se mantienen el nombre, la paleta, las fuentes, los contenidos académicos y las actividades. La nueva escena es 3D real, original y estilizada; no es una fotografía ni una visualización arquitectónica fotorrealista.

Se vieron los dos reels facilitados, sin audio. Se tomaron como referencias la revelación de un espacio y la dirección de cámara, no los automóviles ni sus recursos visuales. También se revisaron visualmente [Lusion](https://lusion.co/) y [AUREL, de By Omid](https://byomid.com/projects/aurel-restaurant/). No se copiaron sus modelos, código, fotografías ni composiciones.

## Skills y criterios aplicados

Se instalaron únicamente las dos skills autorizadas, desde sus repositorios oficiales:

- `emil-design-eng`: `C:/Users/omarq/.agents/skills/emil-design-eng/SKILL.md`, de [Emil Kowalski](https://github.com/emilkowalski/skills). Cámara interrumpible, respuesta inmediata, controles de teclado sin desplazamiento animado y estados de pulsación.
- `design-taste-frontend`: `C:/Users/omarq/.agents/skills/design-taste-frontend/SKILL.md`, de [Taste](https://github.com/Leonxlnx/taste-skill). Referencias reales, composición desde el tema, capturas a tres tamaños y revisión visual iterativa.

Las skills instaladas `frontend-design`, `ui-ux-pro-max`, `impeccable`, `web-design-guidelines`, `vercel-react-best-practices` y GSAP complementan composición, accesibilidad, semántica, carga condicional y movimiento. Three.js es una dependencia del sitio, no una skill adicional. Se trabajó con un agente principal.

Taste propuso **The page is the object**, semilla **1092322972**, conservando paleta y tipografía. La escena 3D solicitada por el usuario reemplaza la tarjeta impresa del patrón propuesto y su animación de pie de página. La idea concreta: el nombre del sitio se convierte en el acto de tomar asiento y explorar la mesa.

## Antes y después

| Antes | Después | Motivo |
| --- | --- | --- |
| Invitación junto a una fotografía | Invitación dentro de un comedor 3D | La experiencia se entiende desde la primera pantalla |
| SVG como única exploración espacial | Cámara guiada, selección sobre los objetos y mapa equivalente | Aprendizaje contextual con una alternativa accesible |
| Mesa separada de la portada | Una misma escena compartida entre inicio y mesa | Continuidad visual y funcional |
| Simulador exclusivamente tipográfico | Imágenes originales del comedor junto al itinerario | Relación visual entre explorar y practicar |
| Movimiento de entrada genérico | Acercamientos que explican dónde está cada objeto | Movimiento con una función clara |
| Error WebGL potencialmente excluyente | Recuperación al mapa y a las mismas explicaciones | Mantener completo el recorrido educativo |

## Crítica final de las capturas

ROUND 3
Seen in one second: una invitación dentro de un comedor borgoña.
Idea (one sentence): tomar asiento convierte los objetos de una cena profesional en el índice del aprendizaje.
Live thing: elegir uno de ocho objetos en el espacio real o con controles equivalentes y recibir su explicación.
Layout words by section: hero=espacio / bienvenida=editorial / capítulos=menú / práctica=invitación / footer=colofón.
Scores: design 7.5 · usability 8.5 · creativity 7.5 · content 8.5 → overall 7.9 antes de límites estilísticos.
Caps applied: el criterio estricto de Taste limita la nota a 6.5 por una sola fotografía y numeración visible. No se presenta como una nota externa ni como la rúbrica universitaria. Se prioriza el comedor interactivo y la secuencia educativa solicitados sobre llenar la página con cuatro fotografías o animaciones automáticas.
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. El suelo anterior fragmentaba visualmente la escena (`.qa/redesign/home-first.png`): corregido con una superficie continua de madera y una iluminación más controlada.
2. El enlace secundario se perdía sobre el mantel en móvil (`.taste-skill/inspect/mobile-fold.jpg`): corregido con una superficie oscura legible, visible en `.taste-skill/final/mobile-fold.jpg`.
3. La escena 3D sigue siendo estilizada, especialmente en sillas y tejidos (`.taste-skill/final/desktop-fold.jpg`): limitación visual reconocida; no se afirma que sea fotorrealista. No se detectan bloqueos visuales o funcionales adicionales en las capturas finales.

Se abrieron y revisaron las seis imágenes finales de Taste: primera pantalla y hoja completa de escritorio, tableta y móvil. También se revisaron los estados finales del simulador, detalles móviles y recuperación al mapa. No se ejecutó el sistema de subagentes ni se instalaron otras skills.

## Detectores: resultado y límites

Impeccable: `detect src --json` devolvió `[]`.

Taste: inspección inicial con 9 FAIL y 7 WARN. Se corrigieron contraste móvil, tamaños pequeños, párrafo sobredimensionado, separadores innecesarios y la etiqueta decorativa del diálogo. La última inspección devuelve **0 FAIL y 6 WARN con cinco excepciones explícitas**:

| Excepción | Justificación |
| --- | --- |
| `numbering` | Los seis capítulos están dentro de un `ol` y describen una secuencia real de aprendizaje |
| `few-pictures` | El contenido visual principal es el comedor 3D interactivo; no se añaden fotografías sin función |
| `still-page` | La cámara se mueve por decisión del usuario; no se animan automáticamente todos los bloques |
| `shadow` | El detector incluye la sombra del menú flotante nativo, permitida para esa función |
| `eyebrow` | Los últimos hallazgos son un enlace del bloque anterior y un pie de foto, no etiquetas sobre un título |

Las seis advertencias restantes son la cursiva y el marfil aprobados, la escala tipográfica heredada, ausencia de video, borde del menú y texto secundario con contraste 6:1. Se conservan por identidad, función o legibilidad. No se afirma que el sitio cumpla todas las preferencias estilísticas de Taste sin excepciones.

El linter estático de Taste registra **13 FAIL y 11 WARN**. Incluye falsos positivos como `shadow` en un comentario sobre sombras 3D, `cutting edge` al explicar el filo del cuchillo, `box-shadow: none` y reglas CSS sustituidas por estilos posteriores. También señala convenciones intencionales de formularios, impresión y diagramas. El informe original queda en `.qa/redesign/taste-lint.txt`; la revisión del render, las pruebas funcionales y Axe determinan el resultado del producto.

## Recursos visuales y publicación

La escena, los materiales procedurales y cuatro imágenes WebP son originales del proyecto. La fotografía existente es de Neon Wang, Unsplash `rlClfxPYxQM`, bajo la [Unsplash License](https://unsplash.com/license), acreditada en Resources. No se añadieron videos ni fotografías de archivo. Fuentes y licencia MIT de Three.js están en `public/licenses`.

El módulo 3D pesa aproximadamente 594 KB minificado / 150 KB gzip y carga solo en inicio y mesa. Vite conserva una advertencia por superar 500 KB; no se ocultó aumentando el umbral. Las imágenes generadas pesan aproximadamente 18–76 KB cada una. La renderización funciona bajo demanda, sin bucle continuo.

Faltan pruebas en hardware móvil real, NVDA/VoiceOver, Safari/Firefox y zoom real del navegador al 200 %. También confirmar acceso normal a Emily Post. La publicación requiere aprobación explícita, después acceso anónimo a la URL definitiva, completar la ficha y entregar en D2L. No se publica desde este informe.


## Actualización de la muestra — 4 de noviembre de 2026

Se refinaron cámaras, perfiles de cubiertos, porcelana, pliegues e iluminación. El marcador y anterior/siguiente explicitan la exploración; el enlace al simulador conecta aprender con practicar. El regreso móvil mantiene imagen y foco. La revisión visual detectó poco contraste sobre el mantel: se prolongó el fondo oscuro detrás de la orientación y se comprobó de nuevo.

Se conservaron identidad y contenido educativo. La escena es 3D estilizada; tejidos y sillas no se presentan como fotorrealistas. Se revisaron las capturas finales y tres composiciones de Figma, con textos y jerarquía editables y el comedor representado como imagen. No se creó biblioteca de componentes ni se gastaron créditos de generación.

Build aprobado, 3 pruebas de contenido y 13 de navegador aprobadas; Impeccable sin hallazgos. Queda la advertencia de tamaño del motor 3D y la revisión en hardware real. Esta actualización conserva las excepciones Taste; sus puntuaciones internas anteriores no son una calificación externa. VALIDATION.md contiene evidencia y pendientes.


## Whole-interface redesign — November 4, 2026

The request expanded beyond table modeling. The direction is a student's dining field guide, with different compositions for reading, exploring, rehearsing and reflecting. Grounded candidates were: dining menu, museum object catalog, student field notes, theater program, art-book contact sheet, service blueprint and campus typography poster. Impeccable assigned student field notes. Its type-specimen challenger loses product clarity but raises hierarchy discipline; split-flap signage loses the dining context but raises consistent stage-state discipline; the installer wizard conflicts with immediate access and ten visible questions but raises error recovery. All were declined before borrowing any styling. No user preference was invented from this selection; the user explicitly delegated the decision.

Taste: Name as a monument, seed 1080495456. Translation is explicit: the live room invitation remains pinned; the returning name and stronger publication hierarchy carry the rest. Unrelated landscape imagery and a marquee were replaced with original dining images and purposeful camera/preview movement. Le Doyenné was visually inspected for real hospitality composition. MotionSites opened, but the Vasari search returned no match and its media did not render reliably; no full prompt is claimed as consulted.

ROUND 3 — final rendered review
Seen in one second: an invitation to enter a dining room; below it, a photographic student field guide.
Idea: a professional evening becomes a readable route from the invitation through six lessons, exploration, rehearsal and reflection.
Live thing: selected table objects teach in context; the chapter preview responds to both pointer and keyboard focus.
Layout by section: room / photographic spread / visual syllabus / contextual questions / rehearsal / closing spread.
Scores (internal judgment only): design 7.7, usability 8.5, creativity 7.4, content 8.5; weighted 7.96 before caps. Strict Taste caps still limit this to 6.5 for retained sequence numbering and motion preferences. These are not an Awwwards rating or the academic grade. The 3D furniture remains stylized and one restaurant photograph repeats; visual originality can still grow through a future coherent photography series.
Top three observed problems and fixes:
1. Mobile summaries and closing headline exceeded two lines: shortened questions, replaced text plus signs with SVG, resized the closing headline. Evidence: final Taste mobile sheet.
2. Mobile rehearsal lost the scene completely: restored an illustrated strip and stage indicators. Evidence: practice-390.png.
3. The collapsed menu retained measurable descendant boxes, and a hidden line break joined two words: explicit closed-menu display and normal text spacing corrected both. Evidence: final inspector and native mobile capture.

Final inspector: 0 FAIL, 4 WARN, with explicit allowances numbering (real ordered learning sequences), still-page (the user-driven 3D signature), shadow (a floating menu), eyebrow (functional object-location/source metadata, not promotional badges). No few-pictures allowance is now needed. Remaining warnings: approved italic title, approved ivory, many type sizes across reading and interactive surfaces, no video. Video was not added because the original live room supplies the spatial experience; no unrelated footage or paid generation was introduced. Twenty measured sizes remain an opportunity for future token consolidation; the report does not call them fully resolved.

Static lint retains 13 FAIL and 11 WARN in legacy and functional patterns (including knife cutting edge, old overridden styles, real form borders and sequence numbering). It was run and preserved in .qa/interface/taste-lint.txt; it is not presented as clean. Rendered checks and accessibility tests determine whether the delivered behavior is broken.

All seven final Taste images were opened: desktop fold/two sheets, tablet fold/sheet, mobile fold/sheet. Additional chapter, simulator, survey and resource views were checked. Build and functional evidence are in VALIDATION.md. No new runtime dependency, media generation, skill installation or deployment was used.


Final cover pass: the desktop title now spans the room as a publication name band, with the invitation copy and immediate action in separate rails. Mobile retains its own two-line composition. The final inspector was rerun after this change and remained at 0 FAIL/4 WARN. The WebGL failure path now opens the complete map and guide immediately on the homepage, avoiding an invitation overlaid on the fallback diagram; its regression passed. The four-panel review image is .qa/interface/interface-overview.png.


## Revisión tras la valoración 4/10 del usuario
La valoración del usuario sobre la iteración anterior prevalece sobre las puntuaciones internas históricas de este documento. La nueva dirección trabaja imagen y continuidad temporal: portada fotográfica, entrada al entorno 3D, tres escenas guiadas por scroll, continuidad de imagen entre páginas y estados breves. Se revisaron capturas de escritorio/móvil y los estados de entrada y de cada escena; se conserva el carácter estilizado del modelo 3D.

Se detectaron dos problemas concretos: resolución insuficiente al recortar la foto de portada en móvil y fondo claro heredado por textos de escenas fuera de pantalla. Ambos fueron corregidos y el contraste se revalidó. La secuencia ofrece salto al índice, controles nativos y alternativa completa estática. No se asigna una puntuación estética nueva. Ver RESEARCH-MOTION.md para fuentes, decisiones y límites de acceso; VALIDATION.md para resultados. La maqueta Figma anterior no se actualizó en esta iteración.
