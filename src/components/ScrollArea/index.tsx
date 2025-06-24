import * as RadixScrollArea from '@radix-ui/react-scroll-area';
import styles from "./styles.module.scss";

export default function ScrollArea(props: {
  scroll?: "xy" | "x" | "y";
  children?: React.ReactNode;
}) {

  const {
    scroll = "xy",
    children,
  } = props;

  const scrollX = scroll.includes('x');
  const scrollY = scroll.includes('y');

  return (
    <RadixScrollArea.Root>
      <RadixScrollArea.Viewport>
        {children}
      </RadixScrollArea.Viewport>

      {scrollX && (
        <RadixScrollArea.Scrollbar
          className={styles.bar}
          orientation="horizontal"
        >
          <RadixScrollArea.Thumb
            className={styles.thumb}
          />
        </RadixScrollArea.Scrollbar>
      )}

      {scrollY && (
        <RadixScrollArea.Scrollbar
          className={styles.bar}
          orientation="vertical"
        >
          <RadixScrollArea.Thumb
            className={styles.thumb}
          />
        </RadixScrollArea.Scrollbar>
      )}

      {scrollX && scrollY && (
        <RadixScrollArea.Corner />
      )}
    </RadixScrollArea.Root>
  );
}
