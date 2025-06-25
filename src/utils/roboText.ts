export function roboText(opts: {
  template: string;
  context?: Record<string, string>;
}) {
  const {
    template,
    context = {},
  } = opts;

  return Object.entries(context).reduce((string, [key, value]) => {
    return string.split(`{${key}}`).join(value);
  }, template);
}
