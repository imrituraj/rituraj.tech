import React from 'react';
import { Mail, ArrowUpRight } from 'lucide-react';
import { personalInfo, socialLinks } from '../data/portfolioData';

interface FooterProps {
  onOpenCredits: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenCredits }) => {
  return (
    <footer className="c-footer" id="contact">
      <div className="c-footer__halo"></div>

      <div className="c-footer__content">
        <div className="c-footer__cta-wrap">
          <h2 className="c-footer__cta-title">
            Let's <span className="o-accent">Connect</span> &amp; <br />
            Create Together
          </h2>

          <a
            href={`mailto:${personalInfo.email}`}
            className="c-footer__email-btn"
          >
            <Mail size={20} />
            <span>{personalInfo.email}</span>
          </a>
        </div>

        {/* Social Profile Cards */}
        <div className="c-footer__socials-grid">
          {socialLinks.map((social) => (
            <a
              key={social.platform}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="c-footer__social-card"
            >
              <div>
                <div className="c-footer__social-platform">{social.platform}</div>
                <div className="c-footer__social-handle">{social.handle}</div>
              </div>
              <ArrowUpRight size={18} color="var(--clr-accent)" />
            </a>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="c-footer__bottom">
          <p>
            ©{personalInfo.year} {personalInfo.name}. All rights reserved.
          </p>

          <button 
            className="c-footer__credits-btn"
            onClick={onOpenCredits}
          >
            Credits &amp; Technologies
          </button>
        </div>
      </div>
    </footer>
  );
};
