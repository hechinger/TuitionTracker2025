import logo from './logo.png';
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

const BrandTopper = () => {
  return (
    <header className={styles.brandTopper}>
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
    </header>
  );
};

export default BrandTopper;
