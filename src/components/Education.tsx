import React from 'react';
import { GraduationCap, MapPin, Calendar } from 'lucide-react';
import { educationHistory } from '../data/portfolioData';

export const Education: React.FC = () => {
  return (
    <section className="c-education o-section" id="education">
      <div className="c-education__header">
        <div>
          <span className="o-title-small">[02 // ACADEMIC PROFILE]</span>
          <h2 className="o-title" style={{ marginTop: '0.6rem' }}>
            Academic <span className="o-accent">Journey</span>
          </h2>
        </div>
      </div>

      <div className="c-education__grid">
        {educationHistory.map((item, index) => (
          <div 
            className={`c-education-card ${item.current ? 'is-current' : ''}`}
            key={item.institution}
          >
            <div className="c-education-card__top">
              <span className="c-education-card__num">0{index + 1}</span>
              <div className="c-education-card__badge">
                {item.current ? (
                  <>
                    <span className="c-editorial-pulse-dot" />
                    <span>CURRENT // {item.period}</span>
                  </>
                ) : (
                  <>
                    <Calendar size={13} color="var(--clr-muted)" />
                    <span>{item.period}</span>
                  </>
                )}
              </div>
            </div>

            <div className="c-education-card__body">
              {item.logo ? (
                <div className="c-education-card__logo-wrap">
                  <img
                    src={item.logo}
                    alt={`${item.institution} Logo`}
                    className="c-education-card__logo-img"
                  />
                </div>
              ) : (
                <div className="c-education-card__icon-wrap">
                  <GraduationCap size={26} color="var(--clr-accent)" />
                </div>
              )}
              
              <h3 className="c-education-card__institution">{item.institution}</h3>
              <div className="c-education-card__degree">{item.degree}</div>
              
              <div className="c-education-card__location">
                <MapPin size={14} color="var(--clr-muted)" />
                <span>{item.location}</span>
              </div>

              {item.details && (
                <p className="c-education-card__details">{item.details}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
