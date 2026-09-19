import React from 'react';
import { ExternalLink } from 'lucide-react';
import { honors } from '../data/portfolioData';

export const Honors: React.FC = () => {
  return (
    <section className="c-honors o-section" id="honors">
      <div className="c-honors__header">
        <h2 className="o-title">
          <span className="line-parent">
            <span className="line-child">
              Ho<span className="o-accent">n</span>ors &amp; Recognition
            </span>
          </span>
        </h2>
        <p className="o-title-small" style={{ marginTop: '1rem' }}>
          All of my past achievements, hackathons, community leadership, and milestones.
        </p>
      </div>

      <div className="c-honors__grid">
        {honors.map((item) => (
          <div className="c-honor-card" key={item.id}>
            <div>
              <h3 className="c-honor-card__title">{item.title}</h3>
              <p className="c-honor-card__desc">{item.description}</p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <span className="c-honor-card__year">{item.year}</span>
              {item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--clr-muted)', transition: 'color 0.2s' }}
                  title="View Certificate / Details"
                >
                  <ExternalLink size={16} />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
