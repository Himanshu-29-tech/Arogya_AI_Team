'use client';
import { useEffect, useRef } from 'react';
import styles from './FutureScope.module.css';

const milestones = [
  {
    quarter: 'Q3 2025',
    status: 'current',
    title: 'Public Beta Launch',
    desc: 'Open access to core features: lab report analysis, biomarker dashboard, and health record upload for 10,000 beta users.',
    icon: '🚀',
    color: '#10b981',
  },
  {
    quarter: 'Q4 2025',
    status: 'upcoming',
    title: 'Wearable & Hospital Sync',
    desc: 'Deep integration with Apple Health, Google Fit, and ABHA health records. Real-time vitals streaming and hospital portal connections.',
    icon: '⌚',
    color: '#3b82f6',
  },
  {
    quarter: 'Q1 2026',
    status: 'upcoming',
    title: 'AI Doctor Consultation',
    desc: 'Conversational AI health assistant for symptom analysis, medication reminders, and specialist referrals — available 24/7.',
    icon: '🩺',
    color: '#8b5cf6',
  },
  {
    quarter: 'Q2 2026',
    status: 'upcoming',
    title: 'Predictive Health Scoring',
    desc: 'Longitudinal health risk prediction using multi-year biomarker trends. Early warning for diabetes, cardiovascular risk, and metabolic syndrome.',
    icon: '🔮',
    color: '#f59e0b',
  },
  {
    quarter: 'Q4 2026',
    status: 'vision',
    title: 'Genomics Integration',
    desc: 'Partner with genetic testing labs to correlate DNA profiles with biomarker data for truly personalized preventive healthcare.',
    icon: '🧬',
    color: '#06b6d4',
  },
];

export default function FutureScope() {
  const itemRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && e.target.classList.add(styles.visible)),
      { threshold: 0.2 }
    );
    itemRefs.current.forEach(el => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.section} id="future-scope">
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.label}>Future Scope</span>
          <h2 className={styles.title}>
            The road <em>ahead</em>
          </h2>
          <p className={styles.subtitle}>
            Our vision for the next chapter of AI-powered healthcare in India and beyond.
          </p>
        </div>

        <div className={styles.timeline}>
          <div className={styles.timelineLine} />

          {milestones.map((m, i) => (
            <div
              key={m.quarter}
              className={`${styles.item} ${i % 2 === 0 ? styles.left : styles.right}`}
              ref={el => itemRefs.current[i] = el}
              style={{ transitionDelay: `${i * 0.12}s` }}
            >
              {/* Dot */}
              <div className={styles.dot} style={{ background: m.color, boxShadow: `0 0 0 6px ${m.color}20` }} />

              <div className={styles.card}>
                <div className={styles.cardTop}>
                  <span className={styles.cardIcon} style={{ background: `${m.color}15` }}>{m.icon}</span>
                  <div>
                    <span className={styles.quarter}>{m.quarter}</span>
                    <span
                      className={`${styles.statusBadge} ${styles[m.status]}`}
                      style={{ color: m.status === 'current' ? '#10b981' : m.status === 'upcoming' ? '#3b82f6' : '#f59e0b' }}
                    >
                      {m.status === 'current' ? '● In Progress' : m.status === 'upcoming' ? '○ Upcoming' : '◇ Vision'}
                    </span>
                  </div>
                </div>
                <h3 className={styles.cardTitle}>{m.title}</h3>
                <p className={styles.cardDesc}>{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
