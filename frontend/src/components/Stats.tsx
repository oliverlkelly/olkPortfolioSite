import { useRef, useEffect, useState } from 'react';
import type { Profile, Experience, Project } from '@/types';
import styles from './Stats.module.css';

interface StatsProps {
  profile:    Profile | null;
  experience: Experience[];
  projects:   Project[];
}

function useCountUp(target: number, duration = 1600, active = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      // ease out expo
      const eased = 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
      else setCount(target);
    };
    requestAnimationFrame(step);
  }, [active, target, duration]);

  return count;
}

function StatBox({
  value, label, suffix = '', delay = 0, active,
}: {
  value: number; label: string; suffix?: string; delay?: number; active: boolean;
}) {
  const count = useCountUp(value, 1400, active);
  return (
    <div className={styles.statBox} style={{ animationDelay: `${delay}ms` }}>
      <span className={styles.statValue}>
        {count}{suffix}
      </span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  );
}

function SkillBar({ skill, index, active }: { skill: string; index: number; active: boolean }) {
  // Deterministic pseudo-random width from skill name
  const pct = 68 + (skill.charCodeAt(0) + skill.charCodeAt(skill.length - 1)) % 30;
  return (
    <div className={styles.skillRow} style={{ animationDelay: `${index * 60}ms` }}>
      <span className={styles.skillName}>{skill}</span>
      <div className={styles.skillTrack}>
        <div
          className={styles.skillFill}
          style={{
            width: active ? `${pct}%` : '0%',
            transitionDelay: active ? `${200 + index * 60}ms` : '0ms',
          }}
        />
      </div>
      <span className={styles.skillPct}>{pct}%</span>
    </div>
  );
}

function yearsOfExperience(experience: Experience[]): number {
  if (!experience.length) return 0;
  const oldest = experience.reduce((a, b) =>
    new Date(a.start_date) < new Date(b.start_date) ? a : b
  );
  const ms = Date.now() - new Date(oldest.start_date).getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24 * 365));
}

export function Stats({ profile, experience, projects }: StatsProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setActive(true); observer.disconnect(); } },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const yoe       = yearsOfExperience(experience);
  const companies = experience.length;
  const projCount = projects.length;
  const skills    = profile?.skills ?? [];

  return (
    <section className={`section ${styles.section}`} ref={sectionRef}>
      <div className="container">
        <div className={styles.inner}>

          {/* Left — counters */}
          <div className={styles.counters}>
            <p className="section-label">By the numbers</p>
            <h2 className={styles.heading}>
              A career <em>in stats</em>
            </h2>
            <div className={`${styles.statGrid} ${active ? styles.visible : ''}`}>
              <StatBox value={yoe}       label="Years experience"   suffix="+"  delay={0}   active={active} />
              <StatBox value={companies} label="Companies worked at" suffix=""   delay={100} active={active} />
              <StatBox value={projCount} label="Projects shipped"    suffix="+"  delay={200} active={active} />
              <StatBox value={skills.length} label="Core skills"    suffix=""   delay={300} active={active} />
            </div>
          </div>

          {/* Right — skill bars */}
          {skills.length > 0 && (
            <div className={styles.skillsCol}>
              <p className={styles.skillsLabel}>Core skills</p>
              <div className={styles.skillList}>
                {skills.map((skill, i) => (
                  <SkillBar key={skill} skill={skill} index={i} active={active} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
