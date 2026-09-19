import React, { useEffect, useState, useRef } from 'react';
import { ArrowDown, CornerRightDown } from 'lucide-react';
import { personalInfo } from '../data/portfolioData';

export const Hero: React.FC = () => {
  // Mouse position normalized (-1 to 1) for kinetic physics
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [timeString, setTimeString] = useState('');
  const cardRef = useRef<HTMLDivElement | null>(null);

  // Live IST Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format to IST (Indian Standard Time)
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      setTimeString(new Intl.DateTimeFormat('en-GB', options).format(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Smooth mouse movement listener for kinetic typography & 3D tilt
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const normalizedX = (e.clientX / innerWidth) * 2 - 1;
      const normalizedY = (e.clientY / innerHeight) * 2 - 1;
      setMousePos({ x: normalizedX, y: normalizedY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const scrollToContent = () => {
    const el = document.getElementById('about');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Kinetic typography transform calculations
  const rituTransform = `translate3d(${mousePos.x * 12}px, ${mousePos.y * 8}px, 0) rotate(${mousePos.x * -0.8}deg)`;
  const rajTransform = `translate3d(${mousePos.x * -16}px, ${mousePos.y * -10}px, 0) rotate(${mousePos.x * 0.6}deg)`;
  
  // 3D card tilt calculations
  const cardTilt = `perspective(1000px) rotateY(${mousePos.x * 12}deg) rotateX(${mousePos.y * -12}deg) translate3d(${mousePos.x * -8}px, ${mousePos.y * -6}px, 20px)`;

  return (
    <section className="c-editorial-hero" id="start">
      {/* Editorial Grid Hairlines */}
      <div className="c-editorial-hero__grid-line c-editorial-hero__grid-line--left" />
      <div className="c-editorial-hero__grid-line c-editorial-hero__grid-line--right" />

      {/* Top Meta Bar */}
      <div className="c-editorial-hero__meta-top">
        <div className="c-editorial-hero__meta-col">
          <span className="c-editorial-tag">[01 // FOLIO]</span>
          <span className="c-editorial-text">EDITION 2026</span>
        </div>

        <div className="c-editorial-hero__meta-col o-desktop">
          <span className="c-editorial-tag">[LOC // BENGALURU]</span>
          <span className="c-editorial-text">12.9716° N, 77.5946° E</span>
        </div>

        <div className="c-editorial-hero__meta-col">
          <span className="c-editorial-tag">[LIVE CLOCK]</span>
          <span className="c-editorial-text c-editorial-clock">
            <span className="c-editorial-pulse-dot" />
            {timeString || '12:00:00'} IST
          </span>
        </div>
      </div>

      {/* Main Asymmetric Composition Canvas */}
      <div className="c-editorial-hero__stage">
        {/* Kinetic Row 1: RITU */}
        <div className="c-editorial-hero__name-row c-editorial-hero__name-row--one">
          <div 
            className="c-editorial-hero__word c-editorial-hero__word--ritu"
            style={{ transform: rituTransform }}
          >
            <span className="o-accent">Ritu</span>
          </div>

          {/* Micro Manifesto Callout */}
          <div className="c-editorial-hero__callout o-desktop">
            <div className="c-editorial-hero__callout-header">
              <CornerRightDown size={14} color="var(--clr-accent)" />
              <span>DISCIPLINE &amp; FOCUS</span>
            </div>
            <p className="c-editorial-hero__callout-body">
              Engineering scalable distributed architectures, high-performance web systems, and algorithmic computing at the intersection of logic &amp; performance.
            </p>
          </div>
        </div>

        {/* Middle Floating Visual Card Layer (Asymmetrical overlap) */}
        <div 
          className="c-editorial-hero__card-wrap"
          ref={cardRef}
          style={{ transform: cardTilt }}
        >
          <div className="c-editorial-card">
            <div className="c-editorial-card__badge">
              <span>FIG. 01 — IDENTITY</span>
              <span className="o-accent">●</span>
            </div>

            <div className="c-editorial-card__img-box">
              <img 
                src="/images/Ritu_1.jpeg" 
                alt="Ritu Raj portrait" 
                className="c-editorial-card__img"
              />
              <div className="c-editorial-card__overlay" />
            </div>

            <div className="c-editorial-card__footer">
              <span>{personalInfo.name.toUpperCase()} // ARCHIVE</span>
              <span>{personalInfo.year}</span>
            </div>
          </div>
        </div>

        {/* Kinetic Row 2: RAJ */}
        <div className="c-editorial-hero__name-row c-editorial-hero__name-row--two">
          <button 
            className="c-editorial-hero__scroll-trigger"
            onClick={scrollToContent}
            aria-label="Scroll to explore"
          >
            <div className="c-editorial-hero__scroll-circle">
              <ArrowDown size={18} />
            </div>
            <span className="c-editorial-hero__scroll-label">EXPLORE</span>
          </button>

          <div 
            className="c-editorial-hero__word c-editorial-hero__word--raj"
            style={{ transform: rajTransform }}
          >
            <span className="c-editorial-hero__raj-text">RAJ</span>
          </div>
        </div>
      </div>

      {/* Editorial Bottom Metadata Footer */}
      <div className="c-editorial-hero__meta-bottom">
        <div className="c-editorial-hero__statement">
          <span className="o-accent">Curated Playground:</span> {personalInfo.role}.
        </div>

        <div className="c-editorial-hero__status">
          <span className="c-editorial-badge">
            <span className="c-editorial-badge__dot" />
            AVAILABLE FOR Q2/Q3 2026
          </span>
        </div>
      </div>
    </section>
  );
};
