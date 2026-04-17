import styles from './Skeleton.module.css';

export function Skeleton() {
  return (
    <div className={styles.wrap}>
      <div className={styles.heroSkeleton}>
        <div className={`${styles.bar} ${styles.sm}`} />
        <div className={`${styles.bar} ${styles.xl}`} />
        <div className={`${styles.bar} ${styles.lg}`} />
        <div className={`${styles.bar} ${styles.md}`} />
        <div className={styles.pills}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={styles.pill} />
          ))}
        </div>
        <div className={styles.btns}>
          <div className={styles.btn} />
          <div className={`${styles.btn} ${styles.btnSecondary}`} />
        </div>
      </div>
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        fontFamily: 'var(--font-mono)',
        color: 'var(--text-dim)',
      }}
    >
      <span style={{ fontSize: '2rem' }}>⚠</span>
      <p style={{ fontSize: '0.8rem', letterSpacing: '0.1em' }}>
        Failed to load portfolio data
      </p>
      <p style={{ fontSize: '0.7rem', color: 'var(--border-2)' }}>{message}</p>
    </div>
  );
}
