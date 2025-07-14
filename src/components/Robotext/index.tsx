import clsx from "clsx";
import { roboText } from "@/utils/roboText";
import styles from "./styles.module.scss";

export default function Robotext(props: {
  as?: React.ElementType;
  template: string | undefined;
  context?: Record<string, string | undefined>;
  highlightColor?: "pink" | "blue";
  className?: string;
  variant?: "graf";
}) {
  const {
    as: Tag = "div",
    template,
    context,
    highlightColor = "",
    className,
    variant = "",
  } = props;

  const html = roboText({
    template,
    context,
  });

  return (
    <Tag
      className={clsx(styles.text, styles[highlightColor], styles[variant], className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
