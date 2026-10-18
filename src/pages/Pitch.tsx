import { ChevronLeft, ChevronRight, Maximize, Minimize } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { asset } from '@/lib/asset';
import config from '@/presentation/pitch.config.json';
import { slideFromHash, slides } from '@/presentation/content';
import { PitchMotionContext, preloadPitchScenes } from '@/presentation/LiveScene';
import { Business, ContentWorld, Cover, Customers, DemoFilm, Difference, Future, Harness, Problem, Team } from '@/presentation/PitchSlides';
import '@/presentation/pitch.css';
const retainedPages = slides.flatMap((slide, index) => slide.id === 'harness' || slide.id === 'content' ? [index] : []);
export default function Pitch() {
  const [index, setIndex] = useState(() => slideFromHash(window.location.hash));
  const [direction, setDirection] = useState(1);
  const [scale, setScale] = useState(1);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [fullscreenError, setFullscreenError] = useState('');
  const [preparedPages, setPreparedPages] = useState<number[]>(() => retainedPages.includes(slideFromHash(window.location.hash)) ? [slideFromHash(window.location.hash)] : []);
  const stage = useRef<HTMLDivElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const source = asset(config.video.src);
  const slide = slides[index];

  const showControls = useCallback(() => {
    setControlsVisible(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setControlsVisible(false), 2600);
  }, []);

  const go = useCallback((next: number) => {
    const bounded = Math.max(0, Math.min(slides.length - 1, next));
    if (slides[bounded].id === 'demo' && !document.fullscreenElement) {
      // Request while the navigation click/key still carries user activation.
      void stage.current?.requestFullscreen().catch(() => undefined);
    }
    setDirection(bounded >= index ? 1 : -1);
    setIndex(bounded);
    window.history.replaceState(window.history.state, '', `#${bounded + 1}`);
    setFullscreenError('');
    showControls();
  }, [index, showControls]);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await stage.current?.requestFullscreen();
      setFullscreenError('');
    } catch {
      setFullscreenError('Fullscreen unavailable. Press F11 to use browser fullscreen.');
      showControls();
    }
  }, [showControls]);

  useEffect(() => {
    const originalTitle = document.title;
    const originalLang = document.documentElement.lang;
    document.documentElement.lang = 'en';
    document.body.classList.add('pitch-active');
    const resize = () => setScale(Math.min(window.innerWidth / 1600, window.innerHeight / 900));
    const hashChange = () => setIndex(slideFromHash(window.location.hash));
    const fullscreenChange = () => setFullscreen(!!document.fullscreenElement);
    resize();
    showControls();
    window.addEventListener('resize', resize);
    window.addEventListener('hashchange', hashChange);
    document.addEventListener('fullscreenchange', fullscreenChange);
    return () => {
      document.title = originalTitle;
      document.documentElement.lang = originalLang;
      document.body.classList.remove('pitch-active');
      clearTimeout(hideTimer.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('hashchange', hashChange);
      document.removeEventListener('fullscreenchange', fullscreenChange);
    };
  }, [showControls]);

  useEffect(() => { document.title = `${index + 1}. ${slide.title} · ObjectTalk`; }, [index, slide.title]);

  useEffect(() => {
    const keydown = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      const target = event.target as HTMLElement;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable) return;
      if (['ArrowRight', 'ArrowDown', 'PageDown', ' ', 'ArrowLeft', 'ArrowUp', 'PageUp', 'Home', 'End'].includes(event.key)) {
        // Preserve native Space/Enter activation on focused buttons and links.
        if (event.key === ' ' && target.closest('button, a')) return;
        event.preventDefault();
        if (event.key === ' ' && slide.id === 'demo') {
          const video = stage.current?.querySelector('video');
          if (video) { if (video.paused) void video.play().catch(() => undefined); else video.pause(); }
          return;
        }
        if (event.key === 'Home') go(0);
        else if (event.key === 'End') go(slides.length - 1);
        else go(index + (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(event.key) ? -1 : 1));
      } else if (event.key.toLowerCase() === 'f') { event.preventDefault(); void toggleFullscreen(); }
    };
    window.addEventListener('keydown', keydown);
    return () => window.removeEventListener('keydown', keydown);
  }, [go, index, slide.id, toggleFullscreen]);

  useEffect(preloadPitchScenes, []);

  useEffect(() => {
    // Prepare the two expensive 3D pages before they are shown. Keep their
    // Canvas/GPU resources alive on later visits, with motion stopped offscreen.
    const next = retainedPages.filter(pageIndex => pageIndex <= index + 1);
    if (!next.length) return;
    const timer = window.setTimeout(() => setPreparedPages(current => [...new Set([...current, ...next])]), 350);
    return () => window.clearTimeout(timer);
  }, [index]);

  const renderSlide = () => {
    switch (slide.id) {
      case 'hello': return <Cover />;
      case 'team': return <Team />;
      case 'why': return <Problem />;
      case 'demo': return <DemoFilm source={source} onEnded={() => go(index + 1)} />;
      case 'difference': return <Difference />;
      case 'people': return <Customers />;
      case 'harness': return <Harness />;
      case 'content': return <ContentWorld />;
      case 'business': return <Business />;
      case 'future': return <Future />;
    }
  };

  return <div ref={stage} className={`pitch-shell ${slide.id === 'demo' ? 'pitch-is-demo' : ''} ${controlsVisible ? 'pitch-controls-visible' : ''}`} onPointerMove={showControls} onFocusCapture={showControls}
    onTouchStart={(event) => {
      if ((event.target as HTMLElement).closest('button, a, video')) return;
      touchStart.current = { x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY };
    }}
    onTouchEnd={(event) => {
      if (!touchStart.current) return;
      const dx = event.changedTouches[0].clientX - touchStart.current.x;
      const dy = event.changedTouches[0].clientY - touchStart.current.y;
      if (Math.abs(dx) > 65 && Math.abs(dx) > Math.abs(dy) * 1.5) go(index + (dx < 0 ? 1 : -1));
      touchStart.current = null;
    }}>
    <main className="pitch-stage" style={{ transform: `translate(-50%, -50%) scale(${scale})` }} aria-label="ObjectTalk pitch">
      {!retainedPages.includes(index) && <section key={slide.id} data-slide-active="true" className={`pitch-slide slide-${slide.id}`} style={{ '--pitch-direction': direction } as React.CSSProperties} aria-label={`Slide ${index + 1} of ${slides.length}: ${slide.title}`}>
        <PitchMotionContext.Provider value={true}>{renderSlide()}</PitchMotionContext.Provider>
      </section>}
      {[...new Set([...preparedPages, ...(retainedPages.includes(index) ? [index] : [])])].sort().map(pageIndex => <section key={slides[pageIndex].id} className={`pitch-slide pitch-retained-slide slide-${slides[pageIndex].id}`} data-slide-active={index === pageIndex ? 'true' : 'false'} aria-hidden={index !== pageIndex} inert={index !== pageIndex} aria-label={`Slide ${pageIndex + 1} of ${slides.length}: ${slides[pageIndex].title}`}>
        <PitchMotionContext.Provider value={index === pageIndex}>{slides[pageIndex].id === 'harness' ? <Harness /> : <ContentWorld />}</PitchMotionContext.Provider>
      </section>)}
      {slide.id !== 'demo' && <div className={`pitch-slide-footer${slide.id === 'hello' || slide.id === 'future' ? ' pitch-minimal-footer' : ''}`} aria-hidden="true"><span>ObjectTalk</span><span>{String(index + 1).padStart(2, '0')} <i /> {String(slides.length).padStart(2, '0')}</span></div>}
    </main>
    <span className="pitch-sr-only" aria-live="polite">Slide {index + 1}: {slide.title}</span>
    {slide.id !== 'demo' && <div className="pitch-controls" aria-label="Presentation controls">
      <div className="pitch-tools"><button aria-label={fullscreen ? 'Exit fullscreen (F)' : 'Enter fullscreen (F)'} title="Fullscreen F" onClick={() => void toggleFullscreen()}>{fullscreen ? <Minimize size={19} /> : <Maximize size={19} />}</button></div>
      <div className="pitch-pagination"><button aria-label="Previous slide" disabled={index === 0} onClick={() => go(index - 1)}><ChevronLeft size={24} /></button><span className="pitch-current-page" aria-label={`Slide ${index + 1} of ${slides.length}`}>{String(index + 1).padStart(2, '0')}<span>/ {slides.length}</span></span><button aria-label="Next slide" disabled={index === slides.length - 1} onClick={() => go(index + 1)}><ChevronRight size={24} /></button></div>
    </div>}
    {slide.id !== 'demo' && fullscreenError && <p className="pitch-fullscreen-error" role="status">{fullscreenError}</p>}

  </div>;
}
