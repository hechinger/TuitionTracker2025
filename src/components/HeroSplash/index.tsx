"use client";

import a11y from "@/styles/accessibility.module.scss";
import { useContent } from "@/hooks/useContent";
import AppLogo from "@/components/AppLogo";
import styles from "./styles.module.scss";

export default function HeroSplash() {
  const content = useContent();

  const sponsorImage = content("HeroSplash.sponsor.image");

  return (
    <div className={styles.splash}>
      <h1 className={a11y.srOnly}>
        Tuition Tracker
      </h1>
      <div className={styles.logo}>
        <AppLogo />
      </div>

      <p className={styles.subtitle}>
        {content("HeroSplash.subtitle")}
      </p>

      {sponsorImage && (
        <div className={styles.sponsor}>
          <p className={styles.sponsorText}>
            {content("HeroSplash.sponsor.text")}
          </p>
          <img
            src={content("HeroSplash.sponsor.image")}
            className={styles.sponsorLogo}
            alt={content("HeroSplash.sponsor.imageAlt")}
          />
        </div>
      )}
    </div>
  );
}
