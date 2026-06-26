'use client';
import { useEffect, useRef } from 'react';
import styles from './Features.module.css';

const features = [
  {
    icon: '🧬',
    title: 'Medical Record Analysis',
    desc: 'Upload any lab report, discharge summary, or radiology scan. Our AI parses clinical jargon and translates findings into plain language you actually understand.',
    tag: 'Core',
    color: '#10b981',
  },
  {
    icon: '📊',
    title: 'Biomarker Tracking',
    desc: 'Track 200+ biomarkers over time — cholesterol, HbA1c, CBC, hormones, and more. Visualize trends and get AI-powered alerts when values drift from your personal baseline.',
    tag: 'Analytics',
    color: '#3b82f6',
  },
  {
    icon: '🔗',
    title: 'Hospital Record Sync',
    desc: 'Securely connect your ABHA/DigiLocker health records and hospital portals. Your entire health history in one unified, intelligent timeline.',
    tag: 'Integration',
    color: '#8b5cf6',
  },
  {
    icon: '⌚',
    title: 'Wearable Integration',
    desc: 'Sync Apple Health, Google Fit, Fitbit, and Garmin devices. Correlate real-time vitals with clinical data for a complete picture of your well-being.',
    tag: 'Connectivity',
    color: '#f59e0b',
  },
  {
    icon: '🔒',
    title: 'Hospital-Grade Security',
    desc: 'AES-256 encryption, zero-knowledge architecture, and hardware-isolated secure enclaves. Your data is private, encrypted, and solely yours — always.',
    tag: 'Security',
    color: '#ef4444',
  },
  {
    icon: '🌐',
    title: 'Multi-Language Support',
    desc: 'Receive health insights in your language. Arogya AI supports Hindi, Tamil, Telugu, Bengali, Marathi, and 12 more Indian languages for inclusive healthcare.',
    tag: 'Accessibility',
    color: '#06b6d4',
  },
];

export default function Features() {
  const cardsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
          }
        });
      },
      { threshold: 0.15 }
    );
    cardsRef.current.forEach(el => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.section} id="features">
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.label}>AI Healthcare Features</span>
          <h2 className={styles.title}>
            Everything your health <em>deserves</em>
          </h2>
          <p className={styles.subtitle}>
            Six pillars of intelligence that work together to give you a complete,
            clinical-grade view of your health — without the medical degree.
          </p>
        </div>

        <div className={styles.grid}>
          {features.map((f, i) => (
            <div
              key={f.title}
              className={styles.card}
              ref={el => cardsRef.current[i] = el}
              style={{ transitionDelay: `${i * 0.08}s` }}
            >
              <div className={styles.cardInner}>
                <div className={styles.iconWrap} style={{ background: `${f.color}15`, border: `1px solid ${f.color}25` }}>
                  <span className={styles.icon}>{f.icon}</span>
                </div>
                <div className={styles.tag} style={{ color: f.color, background: `${f.color}12` }}>
                  {f.tag}
                </div>
                <h3 className={styles.cardTitle}>{f.title}</h3>
                <p className={styles.cardDesc}>{f.desc}</p>
              </div>
              <div className={styles.cardGlow} style={{ background: `radial-gradient(circle at 50% 100%, ${f.color}10, transparent 70%)` }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
