import React, { useState } from 'react';
import {
  ArrowUpRight,
  ExternalLink,
  Layers,
  ChevronLeft,
  ChevronRight,
  X,
  Maximize2,
  Code2
} from 'lucide-react';
import { projects } from '../data/portfolioData';
import { ProjectItem } from '../types/portfolio';

export const Projects: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  // Track active thumbnail for each project card
  const [activeImageMap, setActiveImageMap] = useState<Record<string, string>>({});
  // Lightbox modal state
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);

  const filterCategories = [
    { label: 'ALL ARCHIVE', value: 'ALL', count: projects.length },
    {
      label: 'SYSTEMS & WEB',
      value: 'SYSTEMS & WEB',
      count: projects.filter((p) => p.domain === 'SYSTEMS & WEB').length
    },
    {
      label: 'ALGORITHMS',
      value: 'ALGORITHMS',
      count: projects.filter((p) => p.domain === 'ALGORITHMS').length
    },
    {
      label: 'CREATIVE MEDIA',
      value: 'CREATIVE MEDIA',
      count: projects.filter((p) => p.domain === 'CREATIVE MEDIA').length
    }
  ];

  const filteredProjects = projects.filter((p) => {
    if (activeFilter === 'ALL') return true;
    return p.domain === activeFilter;
  });

  const handleOpenLightbox = (project: ProjectItem, index: number = 0) => {
    setSelectedProject(project);
    setLightboxIndex(index);
  };

  const handleCloseLightbox = () => {
    setSelectedProject(null);
    setLightboxIndex(0);
  };

  const handlePrevImage = () => {
    if (!selectedProject || !selectedProject.previewImages) return;
    setLightboxIndex((prev) =>
      prev === 0 ? selectedProject.previewImages!.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    if (!selectedProject || !selectedProject.previewImages) return;
    setLightboxIndex((prev) =>
      prev === selectedProject.previewImages!.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <section className="c-projects o-section" id="projects">
      {/* Editorial Section Masthead */}
      <div className="c-projects__header">
        <div>
          <div className="c-projects__flag">
            <span className="c-editorial-pulse-dot" />
            <span className="o-title-small">[03 // SELECTED WORKS & SYSTEMS]</span>
          </div>
          <h2 className="o-title" style={{ marginTop: '0.6rem' }}>
            Engineered <span className="o-accent">Creations</span> & Code
          </h2>
          <p className="c-projects__intro">
            A curated exhibition of full-stack systems, distributed solutions, algorithmic foundations, and creative visual directions.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="c-projects__filters-wrap">
          <div className="c-projects__filters">
            {filterCategories.map((filter) => (
              <button
                key={filter.value}
                className={`c-projects__filter-btn ${
                  activeFilter === filter.value ? 'is-active' : ''
                }`}
                onClick={() => setActiveFilter(filter.value)}
              >
                <span>{filter.label}</span>
                <span className="c-projects__filter-count">{filter.count}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Projects Exhibition Grid */}
      <div className="c-projects__exhibition-grid">
        {filteredProjects.map((project, index) => {
          const currentImg =
            activeImageMap[project.id] ||
            project.image ||
            (project.previewImages ? project.previewImages[0] : '');

          const techList = project.techStack
            ? project.techStack.split(',').map((t) => t.trim())
            : [];

          return (
            <article key={project.id} className="c-editorial-project-card">
              {/* Card Top Metadata Bar */}
              <div className="c-editorial-project-card__top">
                <div className="c-editorial-project-card__idx">
                  <span>[0{index + 1} // FOLIO]</span>
                  <span className="c-editorial-project-card__domain">
                    {project.domain || project.category}
                  </span>
                </div>
                <div className="c-editorial-project-card__year">{project.year}</div>
              </div>

              {/* Showcase Image & Live Filmstrip */}
              <div className="c-editorial-project-card__visual">
                <div
                  className="c-editorial-project-card__img-container"
                  onClick={() => handleOpenLightbox(project, 0)}
                  title="Click to inspect gallery"
                >
                  <img
                    src={currentImg}
                    alt={project.title}
                    className="c-editorial-project-card__img"
                    loading="lazy"
                  />
                  <div className="c-editorial-project-card__overlay">
                    <span className="c-editorial-project-card__inspect-pill">
                      <Maximize2 size={13} />
                      <span>INSPECT GALLERY</span>
                    </span>
                  </div>
                </div>

                {/* Screenshot Filmstrip Selector */}
                {project.previewImages && project.previewImages.length > 1 && (
                  <div className="c-project-filmstrip">
                    <div className="c-project-filmstrip__label">
                      <Layers size={12} />
                      <span>SHOTS ({project.previewImages.length}):</span>
                    </div>
                    <div className="c-project-filmstrip__thumbs">
                      {project.previewImages.map((thumb, tIndex) => (
                        <button
                          key={thumb + tIndex}
                          type="button"
                          className={`c-project-filmstrip__thumb ${
                            currentImg === thumb ? 'is-active' : ''
                          }`}
                          onMouseEnter={() =>
                            setActiveImageMap((prev) => ({
                              ...prev,
                              [project.id]: thumb
                            }))
                          }
                          onClick={() => {
                            setActiveImageMap((prev) => ({
                              ...prev,
                              [project.id]: thumb
                            }));
                            handleOpenLightbox(project, tIndex);
                          }}
                          title={`View Shot 0${tIndex + 1}`}
                          aria-label={`Thumbnail ${tIndex + 1}`}
                        >
                          <img src={thumb} alt={`Thumbnail ${tIndex + 1}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Card Content */}
              <div className="c-editorial-project-card__content">
                <div className="c-editorial-project-card__title-wrap">
                  <h3 className="c-editorial-project-card__title">
                    {project.title}
                  </h3>
                  <p className="c-editorial-project-card__subtitle">
                    {project.subtitle}
                  </p>
                </div>

                {project.description && (
                  <p className="c-editorial-project-card__desc">
                    {project.description}
                  </p>
                )}

                {/* Key Architectural Highlights */}
                {project.highlights && project.highlights.length > 0 && (
                  <ul className="c-editorial-project-card__highlights">
                    {project.highlights.map((h, hIdx) => (
                      <li key={hIdx} className="c-editorial-project-card__highlight-item">
                        <span className="c-editorial-project-card__bullet">✦</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Tech Stack Chips */}
                {techList.length > 0 && (
                  <div className="c-editorial-project-card__tech">
                    <div className="c-editorial-project-card__tech-header">
                      <Code2 size={12} />
                      <span>ARCHITECTURE & STACK</span>
                    </div>
                    <div className="c-editorial-project-card__tech-pills">
                      {techList.map((tech) => (
                        <span key={tech} className="c-tech-pill">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Card Action Links */}
                <div className="c-editorial-project-card__actions">
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="c-editorial-project-card__primary-btn"
                  >
                    <span>EXPLORE PROJECT</span>
                    <ArrowUpRight size={15} />
                  </a>

                  {project.previewImages && project.previewImages.length > 0 && (
                    <button
                      type="button"
                      onClick={() => handleOpenLightbox(project, 0)}
                      className="c-editorial-project-card__gallery-btn"
                    >
                      <Layers size={14} />
                      <span>GALLERY ({project.previewImages.length})</span>
                    </button>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Lightbox / Gallery Modal */}
      {selectedProject && selectedProject.previewImages && (
        <div
          className="c-project-lightbox"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleCloseLightbox();
          }}
          role="dialog"
          aria-modal="true"
        >
          <div className="c-project-lightbox__container">
            {/* Top Bar */}
            <div className="c-project-lightbox__top">
              <div className="c-project-lightbox__info">
                <span className="c-project-lightbox__badge">
                  {selectedProject.domain || 'PROJECT'}
                </span>
                <h3 className="c-project-lightbox__title">
                  {selectedProject.title}
                </h3>
                <span className="c-project-lightbox__counter">
                  SHOT {lightboxIndex + 1} OF {selectedProject.previewImages.length}
                </span>
              </div>

              <div className="c-project-lightbox__actions">
                <a
                  href={selectedProject.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="c-project-lightbox__link-btn"
                >
                  <span>VISIT</span>
                  <ExternalLink size={14} />
                </a>
                <button
                  className="c-project-lightbox__close"
                  onClick={handleCloseLightbox}
                  aria-label="Close Lightbox"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Main Stage Viewport */}
            <div className="c-project-lightbox__stage">
              <button
                className="c-project-lightbox__nav-btn is-prev"
                onClick={handlePrevImage}
                aria-label="Previous Shot"
              >
                <ChevronLeft size={24} />
              </button>

              <div className="c-project-lightbox__img-wrap">
                <img
                  src={selectedProject.previewImages[lightboxIndex]}
                  alt={`${selectedProject.title} view ${lightboxIndex + 1}`}
                  className="c-project-lightbox__img"
                />
              </div>

              <button
                className="c-project-lightbox__nav-btn is-next"
                onClick={handleNextImage}
                aria-label="Next Shot"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Thumbnail Strip */}
            <div className="c-project-lightbox__strip">
              {selectedProject.previewImages.map((shot, sIdx) => (
                <button
                  key={shot + sIdx}
                  className={`c-project-lightbox__strip-thumb ${
                    lightboxIndex === sIdx ? 'is-active' : ''
                  }`}
                  onClick={() => setLightboxIndex(sIdx)}
                >
                  <img src={shot} alt={`Thumbnail ${sIdx + 1}`} />
                  <span className="c-project-lightbox__strip-num">0{sIdx + 1}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
