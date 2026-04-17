import type { Profile } from '@/types';
import { ContactForm } from './ContactForm';
import styles from './Footer.module.css';

interface FooterProps {
  profile: Profile | null;
}

export function Footer({ profile }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className={styles.footer}>
      <div className="container">
        <div className={styles.cta}>
          <p className="section-label">Contact</p>
          <h2 className={styles.ctaHeading}>
            Let's build something <em>great</em>
          </h2>
          <p className={styles.ctaText}>
            Open to full-time roles, contracts and interesting collaborations.
            Drop me a line — I usually reply within a day.
          </p>
          <div className={styles.socialRow}>
            {profile?.github_url && (
              <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className={styles.socialBtn}>
                GitHub
              </a>
            )}
            {profile?.linkedin_url && (
              <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className={styles.socialBtn}>
                LinkedIn
              </a>
            )}
            {profile?.twitter_url && (
              <a href={profile.twitter_url} target="_blank" rel="noopener noreferrer" className={styles.socialBtn}>
                Twitter / X
              </a>
            )}
          </div>
          <ContactForm profile={profile} />
        </div>

        <hr className={styles.divider} />

        <div className={styles.bottom}>
          <span className={styles.copy}>
            © {year} {profile?.name ?? 'Portfolio'}. Built with React, Node &amp; PostgreSQL.
          </span>
          <a href="#hero" className={styles.backTop}>
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
