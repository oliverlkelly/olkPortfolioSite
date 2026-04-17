import { useRef, useEffect, useState } from 'react';
import type { Education } from '@/types';
import styles from './Education.module.css';

interface EducationProps {
  education: Education[];
}

function formatYear(dateStr: string | null): string {
  if (!dateStr) return 'Present';
  return new Date(dateStr).getFullYear().toString();
}

function EducationCard({ edu, index }: { edu: Education; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
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
      ref={cardRef}
      className={`${styles.card} ${visible ? styles.visible : ''}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Year range label */}
      <div className={styles.yearRange}>
        <span>{formatYear(edu.start_date)}</span>
        <span className={styles.yearSep}>–</span>
        <span>{formatYear(edu.end_date)}</span>
      </div>

      <div className={styles.cardBody}>
        <div className={styles.cardHead}>
          <div>
            {edu.institution_url ? (
              <a href={edu.institution_url} target="_blank" rel="noopener noreferrer" className={styles.institution}>
                {edu.institution} ↗
              </a>
            ) : (
              <span className={styles.institution}>{edu.institution}</span>
            )}
            {edu.location && <span className={styles.location}>{edu.location}</span>}
          </div>
          {edu.grade && (
            <span className={styles.grade}>{edu.grade}</span>
          )}
        </div>

        <h3 className={styles.degree}>{edu.degree}</h3>
        {edu.field_of_study && (
          <p className={styles.field}>{edu.field_of_study}</p>
        )}

        {edu.description && (
          <p className={styles.description}>{edu.description}</p>
        )}

        {edu.achievements.length > 0 && (
          <ul className={styles.achievements}>
            {edu.achievements.map((a, i) => (
              <li key={i} className={styles.achievement}>
                <span className={styles.bullet}>◆</span>
                <span>{a}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export function Education({ education }: EducationProps) {
  return (
    <section id="education" className={`section ${styles.section}`}>
      <div className="container">
        <p className="section-label">Education</p>
        <div className={styles.sectionHead}>
          <h2 className={styles.heading}>
            How I <em>learned</em>
          </h2>
        </div>
        <div className={styles.grid}>
          {education.map((edu, i) => (
            <EducationCard key={edu.id} edu={edu} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
