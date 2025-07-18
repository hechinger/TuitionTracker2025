import SocialLogo from "./SocialLogo";
import styles from "./styles.module.scss";

const footerLinks = [
  {
    text: "About",
    url: "https://hechingerreport.org/about/",
  },
  {
    text: "Our Impact",
    url: "https://hechingerreport.org/impact/",
  },
  {
    text: "Topics",
    url: "https://hechingerreport.org/special-reports/",
  },
  {
    text: "Interactives",
    url: "https://hechingerreport.org/interactives/",
  },
  {
    text: "Use Our Stories",
    url: "https://hechingerreport.org/use-our-stories/",
  },
  {
    text: "Corrections",
    url: "https://hechingerreport.org/corrections/",
  },
  {
    text: "Newsletters",
    url: "https://hechingerreport.org/newsletters/",
  },
  {
    text: "Sponsorship",
    url: "https://hechingerreport.org/sponsorship/",
  },
  {
    text: "Jobs",
    url: "https://hechingerreport.org/jobs/",
  },
];

/**
 * A copy of the standardard footer on hechingerreport.org
 */
export default function HechingerFooter() {
  const copyrightYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <aside role="complementary" aria-label="Below Footer">
        <ul className={styles.footerLinks}>
          {footerLinks.map((link) => (
            <li key={link.url}>
              <a href={link.url}>
                {link.text}
              </a>
            </li>
          ))}
        </ul>
      </aside>

      <div className={styles.siteInfo}>
        <span>
          © {copyrightYear} The Hechinger Report
        </span>

        <nav aria-label="Social Links Menu">
          <ul className={styles.socialLinks}>
            <li>
              <SocialLogo social="X" />
            </li>
            <li>
              <SocialLogo social="Facebook" />
            </li>
            <li>
              <SocialLogo social="Instagram" />
            </li>
            <li>
              <SocialLogo social="Feedburner" />
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
