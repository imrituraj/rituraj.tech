import React from 'react';
import { ExternalLink } from 'lucide-react';
import { archiveItems } from '../data/portfolioData';

export const Archive: React.FC = () => {
  return (
    <div className="o-section" style={{ paddingTop: 0 }}>
      <div className="c-archive">
        <h3 className="c-archive__title">
          Other Links &amp; <span className="o-accent">Experiments</span>
        </h3>

        <div className="c-archive__list">
          {archiveItems.map((item) => (
            <a
              key={item.title}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="c-archive__item"
            >
              <span>{item.title}</span>
              <ExternalLink size={15} />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
