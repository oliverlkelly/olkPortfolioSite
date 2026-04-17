import { useEffect, useRef } from 'react';
import type { Profile } from '@/types';
import styles from './Hero.module.css';

interface HeroProps {
  profile: Profile | null;
}

export function Hero({ profile }: HeroProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);

  // Typewriter cursor blink is CSS-only, just mount animate classes
  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    el.classList.add(styles.visible);
  }, []);

  const socialLinks = [
    { label: 'GitHub',   url: profile?.github_url,   icon: '⌥ GH' },
    { label: 'LinkedIn', url: profile?.linkedin_url,  icon: '⌥ LI' },
  ].filter((s) => s.url);

  return (
    <section id="hero" className={styles.hero}>
      {/* Background grid */}
      <div className={styles.grid} aria-hidden="true" />

      {/* Accent orb */}
      <div className={styles.orb} aria-hidden="true" />

      <div className={`container ${styles.content}`}>
        <div className={styles.eyebrow}>
          <span className={styles.dot} />
          <span className={styles.eyebrowText}>
            {profile?.location ?? 'Available for hire'}
          </span>
        </div>

        <h1 ref={titleRef} className={styles.title}>
          <span className={styles.titleLine1}>
            {profile?.name?.split(' ').slice(0, 2).join(' ') ?? 'Hello,'}
          </span>
          <span className={styles.titleLine2}>
            <em>{profile?.name?.split(' ').slice(2).join(' ') ?? 'World.'}</em>
          </span>
        </h1>

        <p className={styles.role}>
          <span className={styles.roleTag}>{profile?.title ?? 'Full-Stack Engineer'}</span>
        </p>

        <p className={styles.bio}>
          {profile?.bio ?? 'Building fast, accessible and beautiful web applications.'}
        </p>

        {profile?.skills && profile.skills.length > 0 && (
          <div className={styles.skills}>
            {profile.skills.map((skill) => (
              <span key={skill} className="tag">{skill}</span>
            ))}
          </div>
        )}

        <div className={styles.actions}>
          <a href="#projects" className={styles.primaryBtn}>
            View Projects
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          {profile?.email && (
            <a href={`mailto:${profile.email}`} className={styles.secondaryBtn}>
              Get in touch
            </a>
          )}
        </div>

        {socialLinks.length > 0 && (
          <div className={styles.socials}>
            {socialLinks.map(({ label, url, icon }) => (
              <a
                key={label}
                href={url!}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label={label}
              >
                <span className={styles.socialIcon}>{icon}</span>
                <span>{label}</span>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Scroll indicator */}
      <div className={styles.scrollHint} aria-hidden="true">
        <span className={styles.scrollLine} />
        <span className={styles.scrollLabel}>scroll</span>
      </div>
    </section>
  );
}
