'use client';
import { useEffect, useRef } from 'react';
import styles from './HowItWorks.module.css';

const steps = [
  {
    num: '01',
    icon: '📤',
    title: 'Upload Your Records',
    desc: 'Upload any medical document — lab reports, prescriptions, discharge summaries, X-rays. Arogya AI supports PDFs, images, and DICOM files.',
  },
  {
    num: '02',
    icon: '🤖',
    title: 'AI Parses & Analyzes',
    desc: 'Our multimodal AI reads your documents using OCR and NLP, extracts biomarkers, flags anomalies, and cross-references against clinical databases.',
  },
  {
    num: '03',
    icon: '💡',
    title: 'Receive Clear Insights',
    desc: 'Get a plain-language health summary with highlighted concerns, trend graphs, and evidence-based recommendations — no medical degree required.',
  },
  {
    num: '04',
    icon: '📈',
    title: 'Track & Improve',
    desc: 'Set health goals, track biomarker progress over time, connect wearables, and let Arogya AI guide you toward measurable improvements in vitality.',
  },
];

export default function HowItWorks() {
  const stepsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && e.target.classList.add(styles.visible)),
      { threshold: 0.2 }
    );
    stepsRef.current.forEach(el => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.section} id="how-it-works">
      {/* Background blob */}
      <div className={styles.bgBlob} aria-hidden="true" />

      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.label}>How It Works</span>
          <h2 className={styles.title}>
            From records to <em>clarity</em> in minutes
          </h2>
          <p className={styles.subtitle}>
            A seamless, four-step journey from raw clinical data to actionable health intelligence.
          </p>
        </div>

        <div className={styles.timeline}>
          {steps.map((step, i) => (
            <div
              key={step.num}
              className={styles.step}
              ref={el => stepsRef.current[i] = el}
              style={{ transitionDelay: `${i * 0.15}s` }}
            >
              {/* Connector line */}
              {i < steps.length - 1 && <div className={styles.connector} />}

              <div className={styles.stepCard}>
                <div className={styles.stepNum}>{step.num}</div>
                <div className={styles.stepIconWrap}>
                  <span className={styles.stepIcon}>{step.icon}</span>
                </div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
