import React from 'react';
import styles from './StatsBar.module.css';

export default function StatsBar({ stats }) {
  if (!stats) return null;
  const pct = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className={styles.bar}>
      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.val}>{stats.total}</span>
          <span className={styles.lbl}>Total</span>
        </div>
        <div className={styles.divider} />
        <div className={styles.stat}>
          <span className={styles.val} style={{ color: 'var(--accent)' }}>{stats.completed}</span>
          <span className={styles.lbl}>Done</span>
        </div>
        <div className={styles.divider} />
        <div className={styles.stat}>
          <span className={styles.val}>{stats.pending}</span>
          <span className={styles.lbl}>Pending</span>
        </div>
        <div className={styles.divider} />
        <div className={styles.stat}>
          <span className={styles.val} style={{ color: 'var(--high)' }}>{stats.byPriority?.high}</span>
          <span className={styles.lbl}>Urgent</span>
        </div>
      </div>

      <div className={styles.progress}>
        <div className={styles.progressTrack}>
          <div className={styles.progressFill} style={{ width: `${pct}%` }} />
        </div>
        <span className={styles.pct}>{pct}%</span>
      </div>
    </div>
  );
}
