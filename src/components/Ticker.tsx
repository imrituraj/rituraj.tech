import React from 'react';

interface TickerProps {
  items?: string[];
}

export const Ticker: React.FC<TickerProps> = ({ items }) => {
  const defaultItems = [
    'ASPIRING SDE @ MAANG & TIER-1 TECH',
    'DATA STRUCTURES & ADVANCED ALGORITHMS',
    'DISTRIBUTED SYSTEMS & SCALABLE ARCHITECTURES',
    'IIT PATNA M.TECH CSE // ADVANCED COMPUTING',
    'HIGH-LEVEL (HLD) & LOW-LEVEL (LLD) SYSTEM DESIGN',
    'LOW-LATENCY MICROSERVICES & HIGH-THROUGHPUT APIS',
    'CONCURRENCY, MULTITHREADING & ASYNC I/O',
    'DATABASE INTERNALS, INDEXING & ACID TRANSACTIONS',
    'ASYMPTOTIC COMPLEXITY OPTIMIZATION [O(1) / O(log N)]',
    'EVENT-DRIVEN ARCHITECTURES & DISTRIBUTED CACHING'
  ];

  const tickerContent = items && items.length > 0 ? items : defaultItems;

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
