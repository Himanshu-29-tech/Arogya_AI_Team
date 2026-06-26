'use client';
import { useEffect, useRef } from 'react';
import styles from './Architecture.module.css';

const nodes = [
  { id: 'user', label: 'User', icon: '👤', x: 10, y: 42, color: '#3b82f6' },
  { id: 'app', label: 'Arogya AI App', icon: '📱', x: 30, y: 20, color: '#2a7d5f' },
  { id: 'api', label: 'API Gateway', icon: '⚡', x: 50, y: 42, color: '#f59e0b' },
  { id: 'ai', label: 'AI Engine', icon: '🧠', x: 70, y: 20, color: '#8b5cf6' },
  { id: 'db', label: 'Secure DB', icon: '🗄️', x: 70, y: 64, color: '#ef4444' },
  { id: 'ext', label: 'External APIs', icon: '🌐', x: 90, y: 42, color: '#06b6d4' },
];

const connections = [
  ['user', 'app'],
  ['app', 'api'],
  ['api', 'ai'],
  ['api', 'db'],
  ['ai', 'ext'],
  ['ai', 'db'],
];

export default function Architecture() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && e.target.classList.add(styles.visible)),
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const getPos = (id) => nodes.find(n => n.id === id);

  return (
    <section className={styles.section} id="architecture" ref={sectionRef}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.label}>System Architecture</span>
          <h2 className={styles.title}>
            Built for <em>trust</em> and scale
          </h2>
          <p className={styles.subtitle}>
            A zero-trust, encrypted architecture designed for hospital-grade reliability and privacy.
          </p>
        </div>

        <div className={styles.diagramWrap}>
          <div className={styles.diagram}>
            {/* SVG Connections */}
            <svg className={styles.svg} viewBox="0 0 100 88" preserveAspectRatio="none">
              {connections.map(([a, b], i) => {
                const from = getPos(a);
                const to = getPos(b);
                return (
                  <line
                    key={i}
                    x1={from.x} y1={from.y}
                    x2={to.x} y2={to.y}
                    stroke="rgba(42,125,95,0.2)"
                    strokeWidth="0.5"
                    strokeDasharray="2,1"
                  />
                );
              })}
            </svg>

            {/* Nodes */}
            {nodes.map(node => (
              <div
                key={node.id}
                className={styles.node}
                style={{
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                  '--node-color': node.color,
                }}
              >
                <div className={styles.nodeCircle} style={{ background: `${node.color}15`, border: `1.5px solid ${node.color}30` }}>
                  <span>{node.icon}</span>
                </div>
                <span className={styles.nodeLabel}>{node.label}</span>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className={styles.legend}>
            <h4 className={styles.legendTitle}>Architecture Highlights</h4>
            {[
              { icon: '🔐', text: 'End-to-end AES-256 encryption' },
              { icon: '⚡', text: 'Sub-200ms API response time' },
              { icon: '🌍', text: 'Multi-region data residency' },
              { icon: '📋', text: 'HIPAA & DISHA compliant' },
              { icon: '🔄', text: 'Real-time event streaming' },
              { icon: '🛡️', text: 'Zero-knowledge proof architecture' },
            ].map((item, i) => (
              <div key={i} className={styles.legendItem}>
                <span className={styles.legendIcon}>{item.icon}</span>
                <span className={styles.legendText}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
