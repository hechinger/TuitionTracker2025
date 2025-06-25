import clsx from "clsx";
import { roboText } from "@/utils/roboText";
import styles from "./styles.module.scss";

export default function Robotext(props: {
  template: string;
  context?: Record<string, string>;
  highlightColor?: "pink" | "blue";
}) {
  const {
    template,
    context,
    highlightColor = "",
  } = props;

  const html = roboText({
    template,
    context,
  });

  return (
    <div
      className={clsx(styles.text, styles[highlightColor])}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
