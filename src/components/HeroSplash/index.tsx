import a11y from "@/styles/accessibility.module.scss";
import logo from "./logo.png";
import partner from "./partner.png";
import styles from "./styles.module.scss";

export default function HeroSplash() {
  return (
    <div className={styles.splash}>
      <h1 className={a11y.srOnly}>
        Tuition Tracker
      </h1>
      <img
        src={logo.src}
        className={styles.logo}
        alt="Tuition Tracker logo"
      />

      <p className={styles.subtitle}>
        Revealing the true cost of college
      </p>

      <div className={styles.sponsor}>
        <p className={styles.sponsorText}>
          In partnership with
        </p>
        <img
          src={partner.src}
          className={styles.sponsorLogo}
          alt="Big Charitable Group logo"
        />
      </div>
    </div>
  );
}
