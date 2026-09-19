import React, { useEffect, useState } from 'react';
import { personalInfo } from '../data/portfolioData';

interface PreloaderProps {
  onComplete?: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [isHidden, setIsHidden] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsHidden(true);
      if (onComplete) onComplete();
    }, 1400);

    const removeTimer = setTimeout(() => {
      setIsRemoved(true);
    }, 2200);

    return () => {
      clearTimeout(timer);
      clearTimeout(removeTimer);
    };
  }, [onComplete]);

  if (isRemoved) return null;

  return (
    <div className={`c-preloader ${isHidden ? 'is-hidden' : ''}`}>
      <div className="c-preloader__top">
        Portfolio <br />
        <span>©{personalInfo.year}</span>
      </div>

      <h2 className="c-preloader__title">
        Hey <span className="o-accent">there!</span> <br />
        I am {personalInfo.firstName}
      </h2>

      <div className="c-preloader__bar">
        <div className="c-preloader__progress"></div>
      </div>
    </div>
  );
};
