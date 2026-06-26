'use client';
import { useEffect, useRef, useState } from 'react';
import styles from './Impact.module.css';

const stats = [
  { value: 10000, suffix: '+', label: 'Individuals on Waitlist', icon: '👥', color: '#2a7d5f' },
  { value: 98.4, suffix: '%', label: 'AI Analysis Accuracy', icon: '🎯', color: '#3b82f6', decimals: 1 },
  { value: 200, suffix: '+', label: 'Biomarkers Tracked', icon: '🧬', color: '#8b5cf6' },
  { value: 3, suffix: 's', label: 'Average Report Analysis', icon: '⚡', color: '#f59e0b' },
  { value: 15, suffix: '+', label: 'Indian Languages', icon: '🌐', color: '#06b6d4' },
  { value: 100, suffix: '%', label: 'Data Ownership to User', icon: '🔒', color: '#ef4444' },
];

function Counter({ target, suffix, decimals = 0, color, active }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    let start = 0;
    const duration = 2000;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [active, target]);

  return (
    <span className={styles.statNum} style={{ color }}>
      {decimals > 0 ? count.toFixed(decimals) : Math.floor(count)}{suffix}
    </span>
  );
}

export default function Impact() {
  const [active, setActive] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.section} id="impact" ref={sectionRef}>
      {/* Dark banner background */}
      <div className={styles.banner}>
        <div className={styles.bannerBlob1} />
        <div className={styles.bannerBlob2} />

        <div className={styles.container}>
          <div className={styles.header}>
            <span className={styles.label}>Impact & Benefits</span>
            <h2 className={styles.title}>
              Numbers that <em>matter</em>
            </h2>
            <p className={styles.subtitle}>
              Real outcomes for real people — from waitlist to wellness,
              Arogya AI is already making a difference.
            </p>
          </div>

          <div className={styles.statsGrid}>
            {stats.map((s, i) => (
              <div key={s.label} className={styles.statCard}>
                <div className={styles.statIconWrap}>
                  <span className={styles.statIcon}>{s.icon}</span>
                </div>
                <Counter target={s.value} suffix={s.suffix} decimals={s.decimals} color={s.color} active={active} />
                <p className={styles.statLabel}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Quote */}
          <div className={styles.quote}>
            <p className={styles.quoteText}>
              &ldquo;Health is a lifelong journey. We provide the map, the compass,
              and the companion to navigate it with confidence.&rdquo;
            </p>
            <span className={styles.quoteAuthor}>— Arogya AI Team</span>
          </div>
        </div>
      </div>
    </section>
  );
}
