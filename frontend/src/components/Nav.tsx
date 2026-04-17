import { useState, useEffect } from 'react';
import type { Profile } from '@/types';
import styles from './Nav.module.css';

interface NavProps {
  profile: Profile | null;
}

const NAV_LINKS = [
  { href: '#projects',   label: 'Projects' },
  { href: '#experience', label: 'Experience' },
  { href: '#education',  label: 'Education' },
  { href: '#contact',    label: 'Contact' },
];

export function Nav({ profile }: NavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on outside click / resize
  useEffect(() => {
    if (!menuOpen) return;
    const close = () => setMenuOpen(false);
    window.addEventListener('resize', close);
    return () => window.removeEventListener('resize', close);
  }, [menuOpen]);

  // Track active section via IntersectionObserver
  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <nav className={`${styles.nav} container`}>
        <a href="#hero" className={styles.logo}>
          <span className={styles.logoInitials}>
            {profile?.name
              ? profile.name.split(' ').map((n) => n[0]).join('')
              : 'AM'}
          </span>
          <span className={styles.logoName}>{profile?.name ?? 'Portfolio'}</span>
        </a>

        {/* Desktop links */}
        <ul className={styles.links}>
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <a
                href={href}
                className={`${styles.link} ${activeSection === href.slice(1) ? styles.active : ''}`}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA */}
        {profile?.resume_url && (
          <a href={profile.resume_url} target="_blank" rel="noopener noreferrer" className={styles.cta}>
            Résumé ↗
          </a>
        )}

        {/* Mobile hamburger */}
        <button
          className={`${styles.hamburger} ${menuOpen ? styles.open : ''}`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* Mobile drawer */}
      <div className={`${styles.drawer} ${menuOpen ? styles.drawerOpen : ''}`}>
        {NAV_LINKS.map(({ href, label }) => (
          <a
            key={href}
            href={href}
            className={styles.drawerLink}
            onClick={() => setMenuOpen(false)}
          >
            {label}
          </a>
        ))}
      </div>
    </header>
  );
}
