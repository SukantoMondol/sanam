import styles from "./BenefitCard.module.css";

export function BenefitCard({ title, description, subtitle }) {
  return (
    <div className={styles.benefit - card}>
      <div className={styles.hexagonWrapper}>
        <div className={styles.hexagon}>
          <span cla>15%</span>
        </div>
      </div>
      <h3 className={styles.benefit - title}>{title}</h3>
      <p className={styles.benefit - description}>{description}</p>
      {subtitle && <p className={styles.benefit - subtitle}>{subtitle}</p>}
    </div>
  );
}
