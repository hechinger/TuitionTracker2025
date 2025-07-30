export function getAlignmentTransform(opts: {
  min?: number;
  value: number;
  max?: number;
}) {
  const {
    min = 0,
    value,
    max = value,
  } = opts;

  if (value < min) return "";
  if (value > max) return "translateX(-100%)";
  return "translateX(-50%)";
};

