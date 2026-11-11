# A Seat at the Table — dining field guide

## Direction
A student's field guide for a professional evening. The original dining room is the invitation; the rest of the site is a deliberately composed publication, workbook and rehearsal. The four-part route is Read → Explore → Practice → Reflect. Each task has its own composition, with shared typography, colors, controls and wayfinding. November 4, 2026: the user explicitly requested a whole-interface redesign and entrusted decisions to the principal agent without questions.

## Product truth and pinned identity
English-language education for University of Arizona students: six chapters, eight table objects with an equivalent SVG map, six dinner decisions, ten visible survey questions and original cited synthesis. Student: Omar Quispe Avalos. No survey collection or persistent answers. Ivory #F7F2E8, burgundy #641D2C, charcoal #262322, linen #E3D7C7, muted #625A56. Salon #281A1E and brass #BD9A5E belong to the original 3D room. Cormorant Garamond display and Source Sans 3 reading/control fonts remain self-hosted. No publication without approval; $0 budget, no paid generation or trials.

## Composition by surface
- Home: a desktop name band spanning the room, invitation copy/action on separate rails, and an independent mobile composition; a four-part journey, a large photographic welcome spread, an interactive chapter directory, contextual questions linking to lessons, then a visual dinner invitation. Every section has a learning destination.
- Chapter directory: six ordered poster-like entries with description and actual reading time; a sticky image changes on pointer hover or keyboard focus. Mobile places the image above full-width entries. Links work without JavaScript.
- Chapters: a chapter-specific image and title cover; chapter/read-time context; an index of real article headings; learning objective, original Markdown prose, takeaway, contextual sources and clear previous/next destinations. The reading index is sticky on desktop and collapsible on smaller screens.
- Table: guided original 3D room, selected-object label, eight buttons, previous/next, instant keyboard/reduced-motion camera, complete SVG/text alternatives. Mobile can move between scene and explanation with focus management.
- Practice: a dark illustrated itinerary beside an ivory decision surface. Six real stages, three options, immediate consequences and explanations, result and replay. Mobile keeps a scene strip and stage indicator above the choices.
- Reflection: a workbook with a sticky introduction, actual six-answer progress and section links; ten visible questions on quiet paper surfaces. Missing-answer recovery, feedback and reset remain in memory only.
- Resources: readable annotated source entries and a context/credit column. Academic submission retains its verified single-page print behavior.
- Shared frame: sticky plain header, current section, native mobile menu with Escape/outside-click dismissal, four-stage journey and a burgundy closing spread with complete navigation.

## Layout and type
One responsive gutter: 24–72px, 1440px content maximum; mobile 20–24px. Asymmetry stays inside the grid. Covers use 60–96px display; section titles 32–80px according to hierarchy; body 17–20px; captions and metadata 14–16px. Mobile copy and line breaks are composed separately. Colors and the paired serif/sans system carry continuity. Controls have visible keyboard focus and useful labels. Filled paper/linen fields separate functional groups; the learning sequence earns its numbering.

## Motion
The camera remains the signature interaction: interruptible GSAP travel for pointer input, instant keyboard/reduced-motion state changes. One invitation-title entrance; chapter preview crossfades; short press, hover and progress feedback. No page-wide reveal gate, autoplay footage or scroll hijacking. Content stays visible if animation fails. The on-demand Three.js renderer caps pixel ratio at 1.6, pauses off-screen and disposes resources; real-device GPU verification remains pending.

## Implementation
Astro static routes, reusable ChapterDirectory.astro and JourneyNav.astro; typed chapter image metadata in src/data/chapter-visuals.ts; Markdown educational content. React is restricted to table, simulator and survey. Chapter hover preview and menu dismissal use small native scripts. No new runtime dependency, service or backend was added for the whole-interface redesign. field-guide.css defines the new cross-surface compositions over the existing base and room styles. Print rules stay separate.

## Sources of visual material
Original procedural 3D room, furniture, tableware, scene material maps, four WebP stills and SVG graphics. Restaurant photograph: Neon Wang, Unsplash rlClfxPYxQM, Unsplash License, credited on Resources. No reference-site imagery or models were copied. No new media licenses or paid assets.

## Design process and evidence
Impeccable assigned grounded candidate 3, student field notes (seed:e1c9f2a9741d3451); the user delegated selection, so no waiting decision board was imposed. Taste dealt Name as a monument, seed 1080495456. Its strong title hierarchy and returning name inform the publication frame; the user-pinned live 3D invitation takes precedence over a literal oversized-name replacement. Field-guide imagery replaces the unrelated dealt fog landscapes. The final desktop cover uses the name-band geometry; its camera/preview supplies movement instead of a decorative marquee. These are explicit departures, not a claim of strict sheet fidelity.

Reference research: Le Doyenné's real site for photographic scale, editorial measure and negative space (https://ledoyennerestaurant.com/about/). MotionSites' public catalog was inspected; the supplied Vasari identifier returned no search match and media preview was unreliable, so no unavailable prompt is claimed as read or copied (https://motionsites.ai/?prompt=vasari-vhs-hero).

Evidence: .qa/interface/ contains before/after captures, the final Taste sheets, responsive Axe results and review proof. REVIEW-DESIGN.md records judgments and exceptions; VALIDATION.md records current checks. The earlier Figma file contains the preceding room-focused sample, not this full-interface revision. Local code and captured build are the current visual authority. No temporary Figma capture script is included.


## Current extension: cinematic learning journey
The November 4 user review rated the preceding interface 4/10 and specifically requested an animated journey and stronger imagery. This extension replaces the photographic welcome with three narrated scenes and replaces repeated legacy imagery with a coherent generated salon/detail/conversation series. Source files and exact prompts are in assets/editorial/ASSETS.md and prompts.json; the published Resources page discloses fictional AI-generated illustrations.

The initial hero is photographic. Taking a seat opens the original 3D teaching environment with a curtain and supported native layout transition; keyboard activation and reduced motion remain instant. Desktop scroll holds a photographic stage while three native article sections move through it. GSAP ScrollTrigger controls image reveals/scale and the real phase indicator. Mobile, reduced motion and no JavaScript use the complete static sequence. A skip link reaches the chapter directory immediately.

cinematic.css supplies progressive cross-document View Transitions, a shared chapter image, menu/accordion feedback and the story compositions. editorial-motion.ts imports GSAP/ScrollTrigger only on the story route, responds to motion/viewport changes, and reverts on page exit. The full-page navigation lifecycle is preserved. No new runtime dependency, skill or service was installed. RESEARCH-MOTION.md records every proposal and its access limits. The current visual evidence is .qa/cinematic/, including 29 actual browser frames encoded into journey-preview.webp. The old Figma sample remains historical.

## Refinamiento a partir del feedback 5.5/10
La guía de objetos usa un estudio geométrico oscuro, títulos/ubicación separados, consejo breve y ocho selectores con iconos propios. La cuchara tiene cuenco cóncavo cerrado y cuello continuo; su etiqueta no tapa el cuenco. El cierre usa un solo titular, fotografía y navegación compacta, con firma pequeña. Resources ofrece dos demostraciones oficiales bajo demanda, después referencias anotadas en filas y contexto/créditos. El fallo de WebGL cambia la disponibilidad del visor, nunca la decisión de entrar; la invitación fotográfica permanece visible. No se añadieron animaciones decorativas nuevas a estos controles.

## Referencia vigente: estudios ilustrados (feedback 5/10)
La sección Watch & learn aprobada por Omar sustituye la antigua ficha Taste de gran wordmark como autoridad de composición. Se conserva identidad, paleta y tipografía. Cada ilustración representa un objetivo de aprendizaje; los seis capítulos tienen arte distinto. El recorrido usa tres composiciones panorámicas de esos estudios. Se retiran las fotografías repetidas; una sola imagen atmosférica se reserva para recibir la invitación. El cierre funciona con tipografía y navegación, sin fotografía ornamental. El visor alternativo es una escena de perspectiva SVG con cámara, no el mapa 2D; la referencia cromática y geométrica también lo alcanza. Los hallazgos mecánicos de Taste se conservan sin forzar fotos o animaciones incompatibles con esta elección del usuario.

## Revisión 5.7/10 — 5 de noviembre
Una sola secuencia editorial: invitación → tarjeta de asiento → pregunta de conversación, con escala contenida y texto breve. El estilo aprobado en vídeos se conserva ahora en seis lecciones. El índice solo necesita títulos y tiempos; el preview sigue foco/ratón y no lleva leyendas redundantes. La introducción al recorrido se compacta. La portada llena pantallas anchas con márgenes iguales. El cierre y la invitación a practicar se fusionan en una única superficie carbón/dorado; se retira el bloque previo. En el visor ilustrado se seleccionan superficies/volúmenes reales, excluyendo líneas decorativas de la detección. El contexto arquitectónico se ve desde la mesa y desde la vista general.

## Revisión del profesor — 7 de noviembre de 2026
Recorrido persistente en el marco compartido y etapa activa, pie breve sin navegación duplicada, 17 piezas en los tres visores, segundo estudio ampliado y descripción contextual bajo el preview de capítulos. Las preguntas finales son situaciones de práctica con respuestas desplegables. Carreño es el fundamento histórico principal, con una edición verificada de la Biblioteca Nacional de Colombia y localizadores exactos, complementado por fuentes contemporáneas. La ficha sale del pie público y se conserva por la consigna. REVIEW-70.md documenta decisiones y pruebas. Las menciones anteriores a ocho piezas son historia del proyecto.


## Refinamiento acotado — feedback 8/10, 8 de noviembre
La cabecera reserva Resources como acceso complementario en la misma familia serif de la firma; JourneyNav asume los cuatro destinos educativos. El puesto propio queda más próximo al borde y las copas se apartan visualmente del comensal vecino. Las descripciones de preview se centran bajo la imagen. Resources incorpora índice izquierdo persistente, compacto en móvil, con offsets medidos y sin alterar las lecciones ni referencias. REVIEW-80.md documenta los cuatro cambios.
