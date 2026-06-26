'use client';
import { useEffect, useRef } from 'react';
import styles from './TechStack.module.css';

const categories = [
  {
    label: 'Frontend',
    color: '#3b82f6',
    icon: '🎨',
    items: ['Next.js 15', 'React 19', 'TypeScript', 'Framer Motion', 'Recharts', 'Radix UI'],
  },
  {
    label: 'Backend',
    color: '#2a7d5f',
    icon: '⚙️',
    items: ['Node.js', 'FastAPI (Python)', 'GraphQL', 'WebSockets', 'Redis', 'Nginx'],
  },
  {
    label: 'AI / ML',
    color: '#8b5cf6',
    icon: '🧠',
    items: ['GPT-4o Vision', 'Gemini 1.5 Pro', 'MedPaLM 2', 'Custom NLP', 'LangChain', 'FAISS'],
  },
  {
    label: 'Database',
    color: '#f59e0b',
    icon: '🗄️',
    items: ['PostgreSQL', 'Supabase', 'Vector DB', 'TimescaleDB', 'S3 / MinIO', 'Elasticsearch'],
  },
  {
    label: 'APIs & Integrations',
    color: '#06b6d4',
    icon: '🔗',
    items: ['ABHA / DigiLocker', 'HL7 FHIR', 'Apple HealthKit', 'Google Fit', 'Twilio', 'Razorpay'],
  },
];

export default function TechStack() {
  const cardRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && e.target.classList.add(styles.visible)),
      { threshold: 0.15 }
    );
    cardRefs.current.forEach(el => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.section} id="tech-stack">
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.label}>Technology Stack</span>
          <h2 className={styles.title}>
            Powered by <em>world-class</em> technology
          </h2>
          <p className={styles.subtitle}>
            An end-to-end modern stack built for performance, security, and seamless
            healthcare intelligence.
          </p>
        </div>

        <div className={styles.grid}>
          {categories.map((cat, i) => (
            <div
              key={cat.label}
              className={styles.card}
              ref={el => cardRefs.current[i] = el}
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <div className={styles.cardHead}>
                <div className={styles.catIcon} style={{ background: `${cat.color}15`, border: `1px solid ${cat.color}25` }}>
                  {cat.icon}
                </div>
                <h3 className={styles.catLabel} style={{ color: cat.color }}>{cat.label}</h3>
              </div>
              <ul className={styles.itemList}>
                {cat.items.map(item => (
                  <li key={item} className={styles.item}>
                    <span className={styles.itemDot} style={{ background: cat.color }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
