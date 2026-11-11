// Progressive enhancement: static reading remains the default at every width.
let disposeMotion = () => {};
let generation = 0;
let running = false;

async function startMotion() {
  disposeMotion();
  const run = ++generation;
  const story = document.querySelector<HTMLElement>('[data-story]');
  if (!story || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const { default: gsap } = await import('gsap');
  const { ScrollTrigger } = await import('gsap/ScrollTrigger');
  if (run !== generation || document.hidden) return;
  gsap.registerPlugin(ScrollTrigger);
  const media = gsap.matchMedia();
  disposeMotion = () => { media.revert(); running = false; delete story.dataset.enhanced; delete story.dataset.active; };
  if (story) {
    media.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
      const images = gsap.utils.toArray<HTMLImageElement>('.story-layer', story);
      const chapters = gsap.utils.toArray<HTMLElement>('[data-story-chapter]', story);
      const counter = story.querySelector<HTMLElement>('[data-story-count]');
      story.dataset.enhanced = 'true';
      gsap.set(images.slice(1), { clipPath: 'inset(100% 0 0 0)' });
      gsap.fromTo(images[0], { scale: 1.04 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: chapters[0], start: 'top bottom', end: 'bottom top', scrub: 0.45 } });
      chapters.forEach((chapter, index) => {
        if (index > 0) gsap.fromTo(images[index], { clipPath: 'inset(100% 0 0 0)', scale: 1.06 }, { clipPath: 'inset(0% 0 0 0)', scale: 1, ease: 'none', scrollTrigger: { trigger: chapter, start: 'top bottom', end: 'top 25%', scrub: 0.45, invalidateOnRefresh: true } });
        ScrollTrigger.create({ trigger: chapter, start: 'top center', end: 'bottom center', onToggle: self => {
          if (self.isActive) { story.dataset.active = String(index); if (counter) counter.textContent = String(index + 1).padStart(2, '0'); }
        } });
      });
      ScrollTrigger.refresh();
      const onLayout = () => ScrollTrigger.refresh();
      story.addEventListener('load', onLayout, true);
      document.fonts.ready.then(() => { if (run === generation) ScrollTrigger.refresh(); });
      return () => { delete story.dataset.enhanced; delete story.dataset.active; story.removeEventListener('load', onLayout, true); };
    });
  }
  running = true;
}

const initialize = () => { void startMotion().catch(() => disposeMotion()); };
initialize();
window.addEventListener('pagehide', () => { generation++; disposeMotion(); });
window.addEventListener('pageshow', event => { if (event.persisted) initialize(); });
document.addEventListener('visibilitychange', () => { if (!document.hidden && !running) initialize(); });
window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', event => { if (!event.matches) initialize(); });
