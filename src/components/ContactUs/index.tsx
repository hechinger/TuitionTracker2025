import styles from "./styles.module.scss";

export default function ContactUs() {
  return (
    <div className={styles.contactUs}>
      <div className={styles.icon} />
      <h2>Have a question?</h2>
      <p>
        Send us a message if you can’t find what you’re looking for or if something doesn’t seem right.
      </p>
    </div>
  );
}
