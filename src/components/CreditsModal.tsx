import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { personalInfo } from '../data/portfolioData';

interface CreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreditsModal: React.FC<CreditsModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <div
      className={`c-credits-modal ${isOpen ? 'is-open' : ''}`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="c-credits-modal__box"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="c-credits-modal__close"
          onClick={onClose}
          aria-label="Close Credits"
        >
          <X size={20} />
        </button>

        <div className="c-credits-modal__item">
          <div className="c-credits-modal__label">Core Architecture</div>
          <div className="c-credits-modal__val">React 18 + TypeScript + Vite</div>
        </div>

        <div className="c-credits-modal__item">
          <div className="c-credits-modal__label">Animations &amp; Motion</div>
          <div className="c-credits-modal__val">GSAP &amp; Lenis Smooth Scroll</div>
        </div>

        <div className="c-credits-modal__item">
          <div className="c-credits-modal__label">Typography</div>
          <div className="c-credits-modal__val">
            <span className="o-accent">Mazius</span> &amp; Gilroy
          </div>
        </div>

        <div className="c-credits-modal__item">
          <div className="c-credits-modal__label">Author &amp; Direction</div>
          <div className="c-credits-modal__val">
            Designed &amp; Developed for {personalInfo.name}
          </div>
        </div>
      </div>
    </div>
  );
};
