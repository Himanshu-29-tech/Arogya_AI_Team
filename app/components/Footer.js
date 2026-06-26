'use client';
import { useState } from 'react';
import styles from './Footer.module.css';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail('');
    }
  };

  const links = {
    Product: ['Features', 'How It Works', 'Architecture', 'Technology', 'Security'],
    Company: ['About Us', 'Philosophy', 'Blog', 'Careers', 'Press'],
    Legal: ['Privacy Policy', 'Terms of Service', 'HIPAA Notice', 'Data Policy'],
  };

  const socials = [
    { icon: '𝕏', label: 'Twitter', href: 'https://twitter.com/arogyaai' },
    { icon: 'in', label: 'LinkedIn', href: 'https://www.linkedin.com/company/arogya-health-ai/' },
  ];

  return (
    <footer className={styles.footer} id="footer">
      {/* CTA Banner */}
      <div className={styles.ctaBanner}>
        <div className={styles.ctaBlob1} />
        <div className={styles.ctaBlob2} />
        <div className={styles.ctaInner}>
          <span className={styles.ctaLabel}>JOIN THE WAITLIST</span>
          <h2 className={styles.ctaTitle}>
            Start your health <em>journey</em> today
          </h2>
          <p className={styles.ctaSub}>
            Be among the first to experience the future of personal health intelligence.
            Early access members get lifetime premium features.
          </p>
          {submitted ? (
            <div className={styles.successMsg}>
              <span>✅</span> You&apos;re on the list! We&apos;ll reach out soon.
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit}>
              <input
                type="email"
                className={styles.emailInput}
                placeholder="Enter your email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <button type="submit" className={styles.submitBtn}>
                Join Waitlist
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </form>
          )}

          <p className={styles.ctaNote}>🔒 No spam, ever. Unsubscribe anytime.</p>
        </div>
      </div>

      {/* Footer bottom */}
      <div className={styles.bottom}>
        <div className={styles.container}>
          <div className={styles.bottomGrid}>
            {/* Brand */}
            <div className={styles.brand}>
              <div className={styles.brandLogo}>
                <div className={styles.brandIcon}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L3 7v10l9 5 9-5V7L12 2z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
                    <path d="M12 12l-9-5M12 12v10M12 12l9-5" stroke="currentColor" strokeWidth="1.8"/>
                  </svg>
                </div>
                <span className={styles.brandName}>Arogya AI</span>
              </div>
              <p className={styles.brandTagline}>
                Transforming medical records into human clarity. Your AI health companion.
              </p>
              <div className={styles.socials}>
                {socials.map(s => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label={s.label}>
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            {Object.entries(links).map(([category, items]) => (
              <div key={category} className={styles.linkGroup}>
                <h4 className={styles.linkGroupTitle}>{category}</h4>
                <ul className={styles.linkList}>
                  {items.map(item => (
                    <li key={item}>
                      <a href="#" className={styles.footerLink}>{item}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className={styles.divider} />
          <div className={styles.copyright}>
            <span>© 2025 Arogya AI. All rights reserved.</span>
            <span className={styles.madeWith}>Made with ❤️ for Indian Healthcare</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
