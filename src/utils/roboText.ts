export function roboText(opts: {
  template: string | undefined;
  context?: Record<string, string | undefined>;
}) {
  const {
    template,
    context = {},
  } = opts;

  if (!template) return "";

  return Object.entries(context).reduce((string, [key, value]) => {
    const v = typeof value === "undefined" ? `{${key}}` : value;
    return string.split(`{${key}}`).join(v);
  }, template);
}
