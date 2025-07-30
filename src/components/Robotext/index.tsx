import clsx from "clsx";
import { roboText } from "@/utils/roboText";
import styles from "./styles.module.scss";

/**
 * A utility component for rendering dynamic text with variables
 * inserted from a context.
 * 
 * @param props.as
 *   Optionally specify a kind of built-in or custom React elment type
 *   to use to render the container of the text
 * @param props.template
 *   The template string that specifies how to actually render the text
 * @param props.context
 *   A set of variables that are available to be inserted into the template
 */
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
