import React from 'react';
import styles from './ProductDirection.module.css';

const ProductDirection: React.FC = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.label}>
            Client Project Timeline
          </div>
          <h2 className={styles.title}>
            Track Every Step, Real-Time.
          </h2>
          <p className={styles.description}>
            <strong>
              Complete transparency for your peace of mind.
            </strong>{' '}
            We provide a dedicated timeline for your project that details exactly what happened every day. Monitor progress, updates, and milestones at any time.
          </p>
        </div>

        <div className={styles.timelineWrapper}>
          <div className={styles.timelinePlane}>
            <div className={styles.gridLine} style={{ left: '10%' }} data-date="30" />
            <div className={styles.gridLine} style={{ left: '25%' }} data-date="AUG 3" />
            <div className={`${styles.gridLine} ${styles.highlight}`} style={{ left: '40%' }} data-date="10" />
            <div className={styles.gridLine} style={{ left: '55%' }} data-date="17" />
            <div className={`${styles.gridLine} ${styles.highlight}`} style={{ left: '70%' }} data-date="AUG 22" />
            <div className={styles.gridLine} style={{ left: '85%' }} data-date="24" />
            <div className={styles.gridLine} style={{ left: '100%' }} data-date="SEP" />

            <div className={styles.verticalGuide} style={{ left: '25%', height: '300px' }} />
            <div className={styles.verticalGuide} style={{ left: '70%', height: '300px' }} />

            <div className={styles.itemsContainer}>
              <div className={`${styles.itemBar} ${styles.itemPrototype}`}>
                <div className={styles.icon}>
                  <div className={styles.diamond} />
                </div>
                <span>System Design</span>
                <span style={{ position: 'absolute', top: '-30px', left: '0', color: '#888' }}>Phase 1: Planning</span>
              </div>

              <div className={`${styles.itemBar} ${styles.itemBeta}`}>
                <div className={styles.icon}>
                  <div className={styles.diamondGreen} />
                </div>
                <span>Development</span>
              </div>

              <div className={`${styles.itemBar} ${styles.itemRLHF}`}>
                 <span style={{ marginRight: '10px' }}>Deployment &amp; Live</span>
                <div className={styles.icon}>
                   <div className={styles.diamond} />
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '4px' }}>
                    <div style={{ width:20, height:20, borderRadius:'50%', background:'#444' }}></div>
                    <div style={{ width:20, height:20, borderRadius:'50%', background:'#555' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDirection;
