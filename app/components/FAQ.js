'use client';
import { useState, useRef, useEffect } from 'react';
import styles from './FAQ.module.css';

const faqs = [
  {
    q: 'What is Arogya AI?',
    a: 'Arogya AI is a personal health companion that uses artificial intelligence to transform complex medical records, lab reports, and hospital data into clear, actionable health insights. It bridges the gap between clinical data and human understanding.',
  },
  {
    q: 'How does Arogya AI protect my medical data?',
    a: 'We use hospital-grade AES-256 encryption, zero-knowledge architecture, and hardware-isolated secure enclaves. Your medical data is private, encrypted, and solely yours. We implement row-level security and never share your data with third parties.',
  },
  {
    q: 'Can Arogya AI connect to my hospital records?',
    a: 'Yes. Arogya AI integrates with ABHA (Ayushman Bharat Health Account), DigiLocker, and major hospital portals through encrypted gateways. It also connects with wearables to monitor real-time vitals like heart rate and sleep quality.',
  },
  {
    q: 'Is Arogya AI a substitute for a doctor?',
    a: 'No — Arogya AI is a health intelligence companion, not a diagnostic tool or medical service. It helps you understand your reports and trends, but always consult qualified healthcare professionals for medical decisions.',
  },
  {
    q: 'Which file formats are supported?',
    a: 'Arogya AI supports PDF reports, JPEG/PNG scans, DICOM files (X-rays, MRIs), and structured data from wearables. Our OCR engine can read handwritten prescriptions too.',
  },
  {
    q: 'When will Arogya AI be publicly available?',
    a: 'We are in closed beta with select users and plan to open public access in Q3 2025. Join the waitlist to be among the first to experience Arogya AI and influence its development.',
  },
];

function FAQItem({ faq, index }) {
  const [open, setOpen] = useState(false);
  const contentRef = useRef(null);

  return (
    <div className={`${styles.item} ${open ? styles.open : ''}`}>
      <button className={styles.question} onClick={() => setOpen(o => !o)} aria-expanded={open}>
        <span>{faq.q}</span>
        <span className={styles.chevron} aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </button>
      <div
        className={styles.answer}
        ref={contentRef}
        style={{ maxHeight: open ? '300px' : '0' }}
      >
        <p className={styles.answerText}>{faq.a}</p>
      </div>
    </div>
  );
}

export default function FAQ() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && e.target.classList.add(styles.visible)),
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.section} id="faq" ref={sectionRef}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.label}>FAQ</span>
          <h2 className={styles.title}>
            Questions <em>answered</em>
          </h2>
          <p className={styles.subtitle}>
            Everything you need to know about Arogya AI before you join the journey.
          </p>
        </div>

        <div className={styles.list}>
          {faqs.map((faq, i) => (
            <FAQItem key={i} faq={faq} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
