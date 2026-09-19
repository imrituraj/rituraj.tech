import React, { useState, useRef } from 'react';
import { Volume2, VolumeX, ChevronDown, Lock, BookOpen } from 'lucide-react';
import { personalInfo, socialLinks } from '../data/portfolioData';

interface NavbarProps {
  onOpenLogin: () => void;
  isAuthenticated: boolean;
  onToggleStudyTools: () => void;
  isStudyView: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenLogin,
  isAuthenticated,
  onToggleStudyTools,
  isStudyView
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleMusic = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.warn('Audio play error:', err);
      });
    }
  };

  return (
    <header className="c-editorial-nav">
      <div className="c-editorial-nav__inner">
        {/* Brand with Monospace Flag */}
        <a
          href="#start"
          className="c-editorial-nav__brand"
          onClick={(e) => {
            if (isStudyView) {
              e.preventDefault();
              onToggleStudyTools();
            }
          }}
        >
          <span className="c-editorial-nav__brand-prefix">[RR]</span>
          <span className="c-editorial-nav__brand-name">{personalInfo.name}</span>
        </a>

        {/* Center Live Availability Monospace Pill */}
        <div className="c-editorial-nav__status o-desktop">
          <span className="c-editorial-pulse-dot" />
          <span>{isStudyView ? 'IIT PATNA // M.TECH CSE CONSOLE' : 'OPEN TO SELECT COMMISSIONS'}</span>
        </div>

        {/* Actions */}
        <div className="c-editorial-nav__actions">
          {/* Study Tools / Login Button */}
          {isAuthenticated ? (
            <button
              type="button"
              onClick={onToggleStudyTools}
              className={`c-editorial-nav__portal-btn is-auth ${isStudyView ? 'is-active' : ''}`}
              title={isStudyView ? 'Switch to Portfolio View' : 'Open IIT Patna Study Deck'}
            >
              <BookOpen size={13} />
              <span>{isStudyView ? 'VIEW PORTFOLIO' : 'STUDY DECK'}</span>
              <span className="c-editorial-nav__portal-dot" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenLogin}
              className="c-editorial-nav__portal-btn"
              title="Study Tools Login"
            >
              <Lock size={13} />
              <span>LOGIN</span>
            </button>
          )}

          <a
            href={personalInfo.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="c-editorial-nav__link o-desktop"
          >
            RESUME
          </a>

          {/* Socials Dropdown */}
          <div
            className="c-editorial-nav__socials-wrap o-desktop"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <button
              className="c-editorial-nav__btn"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              aria-expanded={isDropdownOpen}
            >
              <span>INDEX</span>
              <ChevronDown size={13} />
            </button>

            <div className={`c-editorial-nav__dropdown ${isDropdownOpen ? 'is-open' : ''}`}>
              <div className="c-editorial-nav__dropdown-header">NETWORK // SOCIALS</div>
              {socialLinks.map((social) => (
                <a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="c-editorial-nav__dropdown-item"
                >
                  <span className="c-editorial-nav__dropdown-name">{social.platform}</span>
                  <span className="c-editorial-nav__dropdown-handle">{social.handle}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Audio controller */}
          <button
            className={`c-editorial-nav__music-btn ${isPlaying ? 'is-active' : ''}`}
            onClick={toggleMusic}
            title={isPlaying ? 'Pause Audio' : 'Play Audio'}
            aria-label="Toggle Audio"
          >
            {isPlaying ? <Volume2 size={15} /> : <VolumeX size={15} />}
          </button>
          <audio ref={audioRef} src={personalInfo.musicUrl} loop preload="auto" />

          {/* Contact CTA */}
          <a
            href={`mailto:${personalInfo.email}`}
            className="c-editorial-nav__contact-btn"
          >
            CONTACT
          </a>
        </div>
      </div>
    </header>
  );
};
