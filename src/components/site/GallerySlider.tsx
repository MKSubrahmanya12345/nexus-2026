'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';

const SLIDES = [
  { src: '/gallery-1.jpeg', alt: 'NEXUS 2026 highlight 1' },
  { src: '/gallery-2.jpeg', alt: 'NEXUS 2026 highlight 2' },
  { src: '/gallery-3.jpeg', alt: 'NEXUS 2026 highlight 3' },
];

export default function GallerySlider() {
  const listRef = useRef<HTMLUListElement>(null);
  const [current, setCurrent] = useState(0);
  const [atEnd, setAtEnd] = useState(false);

  function goTo(index: number) {
    const next = Math.max(0, Math.min(index, SLIDES.length - 1));
    const list = listRef.current;
    const card = list?.children[next] as HTMLElement | undefined;
    if (!list || !card) return;
    list.scrollTo({
      left: card.offsetLeft - list.offsetLeft,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    });
    setCurrent(next);
  }

  function updateCurrent() {
    const list = listRef.current;
    if (!list) return;
    const cards = Array.from(list.children) as HTMLElement[];
    setAtEnd(list.scrollLeft >= list.scrollWidth - list.clientWidth - 2);
    const next = cards.reduce(
      (closest, card, index) =>
        Math.abs(card.offsetLeft - list.offsetLeft - list.scrollLeft) <
        Math.abs(cards[closest].offsetLeft - list.offsetLeft - list.scrollLeft)
          ? index
          : closest,
      0,
    );
    setCurrent(next);
  }

  return (
    <section className="gallery-section" aria-label="NEXUS 2026 highlights">
      <div className="gallery-inner">
        <div className="gallery-header">
          <div>
            <p className="eyebrow">05 / Highlights</p>
            <h2 className="gallery-title">
              Moments from <em>NEXUS.</em>
            </h2>
            <p className="gallery-sub">Swipe or use the arrows to explore.</p>
          </div>
          <div className="gallery-controls">
            <span aria-live="polite">
              {String(current + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
            </span>
            <button type="button" onClick={() => goTo(current - 1)} disabled={current === 0} aria-label="Previous highlight">
              ←
            </button>
            <button type="button" onClick={() => goTo(current + 1)} disabled={atEnd || current === SLIDES.length - 1} aria-label="Next highlight">
              →
            </button>
          </div>
        </div>
        <ul ref={listRef} className="gallery-list" onScroll={updateCurrent} tabIndex={0} aria-label="NEXUS 2026 highlights">
          {SLIDES.map((s, index) => (
            <li className="gallery-card" key={s.src}>
              <div className="gallery-card-art">
                <Image src={s.src} alt={s.alt} fill sizes="(max-width: 700px) 90vw, 420px" className="gallery-img" />
              </div>
              <p className="gallery-card-caption">Highlight {String(index + 1).padStart(2, '0')}</p>
            </li>
          ))}
        </ul>
        <p className="gallery-hint">
          SWIPE TO EXPLORE <span aria-hidden="true">→</span>
        </p>
      </div>
    </section>
  );
}
