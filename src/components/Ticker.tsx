import React from 'react';

interface TickerProps {
  items?: string[];
}

export const Ticker: React.FC<TickerProps> = () => {
  const tickerContent = [
    'CREATIVE TECHNOLOGIST',
    'FULL STACK ARCHITECTURE',
    'VISUAL DIRECTION & MOTION',
    'BANGALORE (12.9716° N, 77.5946° E)',
    'DIGITAL EXPERIENCES',
    'AVAILABLE FOR SELECT COMMISSIONS // 2026'
  ];

  return (
    <div className="c-ticker-tape" aria-hidden="true">
      <div className="c-ticker-tape__track">
        {/* Track 1 */}
        <div className="c-ticker-tape__content">
          {tickerContent.map((text, i) => (
            <React.Fragment key={`t1-${i}`}>
              <span className="c-ticker-tape__item">{text}</span>
              <span className="c-ticker-tape__star">✦</span>
            </React.Fragment>
          ))}
        </div>

        {/* Track 2 (for seamless loop) */}
        <div className="c-ticker-tape__content">
          {tickerContent.map((text, i) => (
            <React.Fragment key={`t2-${i}`}>
              <span className="c-ticker-tape__item">{text}</span>
              <span className="c-ticker-tape__star">✦</span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
