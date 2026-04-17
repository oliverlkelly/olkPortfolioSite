import { useRef, useEffect, useState } from 'react';
import type { Experience } from '@/types';
import styles from './Experience.module.css';

interface ExperienceProps {
  experience: Experience[];
}

function formatDateRange(start: string, end: string | null, isCurrent: boolean): string {
  const fmt = (d: string) => new Date(d).toLocaleDateString('en-AU', { year: 'numeric', month: 'short' });
  const startStr = fmt(start);
  const endStr = isCurrent ? 'Present' : end ? fmt(end) : 'Present';

  const months = (() => {
    const s = new Date(start);
    const e = end ? new Date(end) : new Date();
    const diff = (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth());
    if (diff >= 12) {
      const y = Math.floor(diff / 12);
      const m = diff % 12;
      return m > 0 ? `${y}y ${m}mo` : `${y}y`;
    }
    return `${diff}mo`;
  })();

  return `${startStr} — ${endStr} · ${months}`;
}

function ExperienceItem({ exp, index }: { exp: Experience; index: number }) {
  const itemRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const el = itemRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={itemRef}
      className={`${styles.item} ${visible ? styles.visible : ''} ${exp.is_current ? styles.current : ''}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Timeline dot */}
      <div className={styles.timeline}>
        <div className={styles.dot} />
        {!exp.is_current && <div className={styles.line} />}
      </div>

      <div className={styles.body}>
        <div className={styles.header}>
          <div>
            <div className={styles.companyRow}>
              {exp.company_url ? (
                <a href={exp.company_url} target="_blank" rel="noopener noreferrer" className={styles.company}>
                  {exp.company} ↗
                </a>
              ) : (
                <span className={styles.company}>{exp.company}</span>
              )}
              {exp.is_current && <span className={styles.currentBadge}>Current</span>}
            </div>
            <h3 className={styles.role}>{exp.role}</h3>
          </div>
          <div className={styles.meta}>
            <span className={styles.dates}>
              {formatDateRange(exp.start_date, exp.end_date, exp.is_current)}
            </span>
            {exp.location && <span className={styles.location}>{exp.location}</span>}
            <span className={styles.empType}>{exp.employment_type}</span>
          </div>
        </div>

        <p className={styles.description}>{exp.description}</p>

        {exp.achievements.length > 0 && (
          <div className={`${styles.achievementsWrap} ${expanded ? styles.open : ''}`}>
            <ul className={styles.achievements}>
              {exp.achievements.map((a, i) => (
                <li key={i} className={styles.achievement}>
                  <span className={styles.chevron}>→</span>
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {exp.achievements.length > 0 && (
          <button
            className={styles.toggleBtn}
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? '↑ Less' : `↓ ${exp.achievements.length} highlights`}
          </button>
        )}

        {exp.tech_stack.length > 0 && (
          <div className={styles.techStack}>
            {exp.tech_stack.map((t) => (
              <span key={t} className="tag">{t}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function Experience({ experience }: ExperienceProps) {
  return (
    <section id="experience" className={`section ${styles.section}`}>
      <div className="container">
        <p className="section-label">Experience</p>
        <div className={styles.sectionHead}>
          <h2 className={styles.heading}>
            Where I've <em>worked</em>
          </h2>
        </div>
        <div className={styles.list}>
          {experience.map((exp, i) => (
            <ExperienceItem key={exp.id} exp={exp} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
