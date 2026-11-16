'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

type Panelist = {
  name: string;
  designation: string;
  organisation: string;
  photo?: string;
  bio?: string[];
};

function Card({ p, i }: { p: Panelist; i: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setVisible(true);
        });
      },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <li
      ref={ref}
      className={`vss-card ${visible ? 'is-visible' : ''}`}
      style={{ transitionDelay: `${i * 80}ms` }}
    >
      <div className="vss-poster">
        {p.photo && (
          <Image
            src={p.photo}
            alt={`${p.name} — ${p.designation}, ${p.organisation}`}
            fill
            sizes="(max-width: 900px) 90vw, 360px"
            className="vss-poster-img"
          />
        )}
      </div>
      <div className="vss-info">
        <span className="vss-index">{String(i + 1).padStart(2, '0')} / 03</span>
        <h3 className="vss-name">{p.name}</h3>
        <p className="vss-designation">{p.designation}</p>
        <p className="vss-org">{p.organisation}</p>
        <ul className="vss-bullets">
          {(p.bio ?? []).map((b, j) => (
            <li key={j}>{b}</li>
          ))}
        </ul>
      </div>
    </li>
  );
}

export default function VerticalSpeakerStack({ panelists }: { panelists: Panelist[] }) {
  return (
    <section className="vss-section" aria-label="Industry panel speakers">
      <div className="vss-inner">
        <div className="vss-header">
          <p className="eyebrow">03 / Speakers</p>
          <h2 className="vss-title">Industry panel.</h2>
        </div>
        <ul className="vss-list">
          {panelists.map((p, i) => (
            <Card key={p.name} p={p} i={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}