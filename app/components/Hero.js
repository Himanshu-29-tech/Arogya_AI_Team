'use client';
import { useEffect, useRef } from 'react';
import styles from './Hero.module.css';

export default function Hero() {
  const heroRef = useRef(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    setTimeout(() => el.classList.add(styles.loaded), 100);
  }, []);

  return (
    <section className={styles.hero} ref={heroRef}>
      {/* Floating blobs */}
      <div className={styles.blob1} aria-hidden="true" />
      <div className={styles.blob2} aria-hidden="true" />
      <div className={styles.blob3} aria-hidden="true" />

      <div className={styles.content}>
        {/* Badge */}
        <div className={styles.badge}>
          <span className={styles.badgeDot} />
          AI HEALTH COMPANION &bull; CLINICAL INTELLIGENCE
        </div>

        {/* Headline */}
        <h1 className={styles.headline}>
          <span className={styles.line1}>Your health data.</span>
          <span className={styles.line2}>
            <em>Understood by AI.</em>
          </span>
        </h1>

        {/* Sub-text */}
        <p className={styles.sub}>
          Arogya AI transforms complex medical records, lab reports, and hospital data
          into clear, actionable insights — bridging the gap between clinical data and
          your everyday vitality.
        </p>

        {/* CTA group */}
        <div className={styles.ctaGroup}>
          <a href="#footer" className={styles.btnPrimary}>
            Get Early Access
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          <a href="#how-it-works" className={styles.btnSecondary}>
            See How It Works
          </a>
        </div>

        {/* Social proof */}
        <div className={styles.proof}>
          <div className={styles.avatars}>
            {['#b7d7c9','#a3c9f5','#f5c6a3','#d4b7f5'].map((c, i) => (
              <div key={i} className={styles.avatar} style={{ background: c }} />
            ))}
          </div>
          <div className={styles.proofText}>
            <strong>10,000+ individuals</strong>
            <span>ON THE PATH TO WELLNESS</span>
          </div>
        </div>
      </div>

      {/* Floating dashboard card */}
      <div className={styles.dashboardWrap}>
        <div className={styles.dashboard}>
          <div className={styles.dashHeader}>
            <div className={styles.dashDot} style={{ background: '#ef4444' }} />
            <div className={styles.dashDot} style={{ background: '#f59e0b' }} />
            <div className={styles.dashDot} style={{ background: '#10b981' }} />
            <span className={styles.dashTitle}>Health Dashboard</span>
          </div>
          <div className={styles.dashBody}>
            {/* Vitals row */}
            <div className={styles.vitalsRow}>
              {[
                { icon: '❤️', label: 'Heart Rate', value: '72 bpm', color: '#ef4444', ok: true },
                { icon: '🩸', label: 'Blood Glucose', value: '98 mg/dL', color: '#f59e0b', ok: true },
                { icon: '🫁', label: 'SpO2', value: '98%', color: '#3b82f6', ok: true },
              ].map(v => (
                <div key={v.label} className={styles.vitalCard}>
                  <span className={styles.vitalIcon}>{v.icon}</span>
                  <div className={styles.vitalInfo}>
                    <span className={styles.vitalLabel}>{v.label}</span>
                    <span className={styles.vitalValue} style={{ color: v.color }}>{v.value}</span>
                  </div>
                  {v.ok && <span className={styles.vitalOk}>✓</span>}
                </div>
              ))}
            </div>

            {/* Chart mockup */}
            <div className={styles.chartArea}>
              <div className={styles.chartLabel}>Health Score Trend</div>
              <div className={styles.chartBars}>
                {[60, 72, 65, 80, 75, 88, 82, 90, 86, 93].map((h, i) => (
                  <div
                    key={i}
                    className={styles.bar}
                    style={{ height: `${h}%`, animationDelay: `${i * 0.08}s` }}
                  />
                ))}
              </div>
            </div>

            {/* AI insight pill */}
            <div className={styles.aiInsight}>
              <span className={styles.aiInsightDot} />
              <span>AI Insight: Your vitamin D levels are trending low — consider supplements.</span>
            </div>
          </div>
        </div>

        {/* Floating mini badges */}
        <div className={styles.floatBadge1}>
          <span>🔒</span> AES-256 Encrypted
        </div>
        <div className={styles.floatBadge2}>
          <span>⚡</span> Real-time Analysis
        </div>
      </div>
    </section>
  );
}
