import React from 'react';
import { services } from '../data/portfolioData';

export const Services: React.FC = () => {
  return (
    <section className="c-services o-section">
      <div className="c-services__header">
        <div>
          <span className="o-title-small">
            Things I <span className="o-accent">Can</span> Help You With
          </span>
        </div>
      </div>

      <div className="c-services__grid">
        {services.map((service, index) => (
          <div className="c-services__item" key={service}>
            <div className="c-services__item-num">0{index + 1}</div>
            <h3 className="c-services__item-title">{service}</h3>
          </div>
        ))}
      </div>
    </section>
  );
};
