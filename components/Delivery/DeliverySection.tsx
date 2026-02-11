import React from 'react';
import styles from './Delivery.module.css';

const DeliverySection: React.FC = () => {
  return (
    <section className={styles.section}>
      <div className={styles.contentWrapper}>
        <h2 className={styles.title}>
          Your product,<br />
          delivered.
        </h2>
        <p className={styles.subtitle}>
          From code to customer in record time. Our integrated logistics and digital
          infrastructure ensure your product reaches its destination seamlessly.
        </p>
      </div>

      <div className={styles.scene}>
        <div className={styles.cube}>
          <div className={styles.innerGlow} />
          
          <div className={`${styles.face} ${styles.front}`}></div>
          <div className={`${styles.face} ${styles.back}`}></div>
          <div className={`${styles.face} ${styles.right}`}></div>
          <div className={`${styles.face} ${styles.left}`}></div>
          <div className={`${styles.face} ${styles.top}`}></div>
          <div className={`${styles.face} ${styles.bottom}`}></div>
        </div>
      </div>
    </section>
  );
};

export default DeliverySection;
