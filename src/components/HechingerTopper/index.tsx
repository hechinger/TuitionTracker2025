import Well from "@/components/Well";
import logo from './logo.gif';
import styles from './styles.module.scss';

const menuLinks = [
  {
    text: 'Newsletters',
    url: 'https://hechingerreport.org/newsletters/',
  },
  {
    text: 'About',
    url: 'https://hechingerreport.org/about/',
  },
  {
    text: 'Donate',
    url: 'https://hechingerreport.fundjournalism.org/?amount=15&campaign=701VK000007zCQ1YAM&frequency=monthly',
  },
];

/**
 * A copy of the standard topper on hechingerreport.org. Works with
 * the `PageTopOverlap` component to render the top of the page correctly.
 */
export default function HechingerTopper() {
  return (
    <header className={styles.brandTopper}>
      <Well>
        <div className={styles.content}>
          <div className={styles.brand}>
            <a href="https://hechingerreport.org/" rel="home">
              <img
                src={logo.src}
                className={styles.logo}
                width="300"
                alt="The Hetchinger Report"
              />
            </a>

            <div className={styles.tag}>
              Covering Innovation & Inequality in Education
            </div>
          </div>

          <div className={styles.menu}>
            <nav
              className={styles.menuNav}
              aria-label="Top Menu"
            >
              <ul className={styles.menuList}>
                {menuLinks.map((link) => (
                  <li
                    key={link.url}
                    className={styles.menuListItem}
                  >
                    <a href={link.url}>
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </Well>
    </header>
  );
}
