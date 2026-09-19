import React from 'react';
import { personalInfo } from '../data/portfolioData';

export const About: React.FC = () => {
  return (
    <section className="c-about o-section" id="about">
      <div>
        <span className="o-title-small">About Myself</span>
        <p className="c-about__text">
          I'm {personalInfo.name}, pursuing M.Tech in CSE at <span className="o-accent">IIT Patna</span>, with a B.Tech from <span className="o-accent">TIU Kolkata</span>. Passionate about engineering <span className="o-accent">scalable distributed systems</span>, <span className="o-accent">robust backend architectures</span>, and <span className="o-accent">high-impact software solutions</span>.
        </p>
      </div>

      <div className="c-about__cards-stack">
        <div className="c-about__card">
          <img src="/images/Ritu_2.jpeg" alt="Ritu Raj portrait" loading="lazy" />
        </div>
        <div className="c-about__card">
          <img src="/images/Ritu_3.jpeg" alt="Ritu Raj graduation" loading="lazy" />
        </div>
        <div className="c-about__card">
          <img src="/images/Ritu_1.jpeg" alt="Ritu Raj profile" loading="lazy" />
        </div>
      </div>
    </section>
  );
};
