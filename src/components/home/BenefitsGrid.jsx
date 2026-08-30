import styles from "./benefits-grid.module.css";
import { BenefitCard } from "./benefit-card";

const benefits = [
  {
    title: "15% back in rewards",
    description: "on every item every day.",
    subtitle: "Bonus: They never expire!",
  },
  {
    title: "Free shipping on every order",
    description: "From plates to sofas-it's on us",
  },
  {
    title: "Special offers & perks",
    description: "We'll treat you on your birthday - and just because.",
  },
  {
    title: "member support line",
    description: "call for fast, quality assistance",
  },
  {
    title: "save across our family of brands",
    description: "enjoy member benefits on All modern, Birch Lane, and joss & Main.",
  },
];

export function BenefitsGrid() {
  return (
    <section className={styles.b - container}>
      <div className={styles.b - grid}>
        {benefits.map((benefit, index) => (
          <BenefitCard key={index} title={benefit.title} description={benefit.description} subtitle={benefit.subtitle} />
        ))}
      </div>
    </section>
  );
}
