import { useRef, useEffect, useState } from 'react';
import type { Project } from '@/types';
import { ProjectModal } from './ProjectModal';
import styles from './Projects.module.css';

interface ProjectsProps {
  projects: Project[];
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'Present';
  return new Date(dateStr).toLocaleDateString('en-AU', { year: 'numeric', month: 'short' });
}

function ProjectCard({
  project,
  index,
  onOpen,
}: {
  project: Project;
  index: number;
  onOpen: (p: Project) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
      },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className={`${styles.card} ${project.featured ? styles.featured : ''} ${visible ? styles.visible : ''}`}
      style={{ transitionDelay: `${index * 80}ms` }}
      role="button"
      tabIndex={0}
      onClick={() => onOpen(project)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onOpen(project); }}
      aria-label={`View details for ${project.title}`}
    >
      <div className={styles.cardInner}>
        {/* Header row */}
        <div className={styles.cardHeader}>
          <div className={styles.cardMeta}>
            {project.featured && <span className={styles.featuredBadge}>Featured</span>}
            <span className={styles.dates}>
              {formatDate(project.start_date)} — {formatDate(project.end_date)}
            </span>
          </div>
          <div className={styles.cardLinks}>
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.iconLink}
                aria-label="GitHub"
                onClick={(e) => e.stopPropagation()}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                </svg>
              </a>
            )}
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.iconLink}
                aria-label="Live site"
                onClick={(e) => e.stopPropagation()}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            )}
            <span className={styles.expandHint} aria-hidden="true">↗</span>
          </div>
        </div>

        {/* Body */}
        <h3 className={styles.cardTitle}>{project.title}</h3>
        <p className={styles.cardDesc}>{project.description}</p>

        {project.featured && project.long_description && (
          <p className={styles.cardLongDesc}>{project.long_description}</p>
        )}

        {/* Tech stack */}
        <div className={styles.techStack}>
          {project.tech_stack.map((tech) => (
            <span key={tech} className="tag">{tech}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Projects({ projects }: ProjectsProps) {
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const featured = projects.filter((p) => p.featured);
  const rest     = projects.filter((p) => !p.featured);

  return (
    <section id="projects" className={`section ${styles.section}`}>
      {activeProject && (
        <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />
      )}

      <div className="container">
        <p className="section-label">Projects</p>
        <div className={styles.sectionHead}>
          <h2 className={styles.heading}>
            Things I've <em>built</em>
          </h2>
          <p className={styles.subheading}>
            A selection of projects — from production platforms to open-source tools.
            Click any card to see more.
          </p>
        </div>

        {featured.length > 0 && (
          <div className={styles.featuredGrid}>
            {featured.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} onOpen={setActiveProject} />
            ))}
          </div>
        )}

        {rest.length > 0 && (
          <>
            <p className={styles.otherLabel}>Other projects</p>
            <div className={styles.otherGrid}>
              {rest.map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i} onOpen={setActiveProject} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
